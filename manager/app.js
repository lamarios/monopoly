const DOCKER_SOCKET = process.env.DOCKER_SOCKET || '/var/run/docker.sock';

const DOCKER_HOST = process.env.DOCKER_HOST;
const DOCKER_PORT = process.env.DOCKER_PORT;

const DOCKER_NETWORK = process.env.DOCKER_NETWORK || 'bridge';
const GAME_CONTAINER_PREFIX = process.env.GAME_CONTAINER_PREFIX || 'monopoly-game-';
const MAX_GAMES = process.env.MAX_GAMES || 500;
const GAME_IMAGE = process.env.GAME_IMAGE || 'gonzague/monopoly';

let dockerConfig = {socketPath: DOCKER_SOCKET};

if (DOCKER_HOST && DOCKER_PORT) {
    dockerConfig = {
        host: DOCKER_HOST,
        port: DOCKER_PORT
    }
}

// HTTPS or not stuff

const key = process.env.HTTP_TLS_KEY || 'key.pem';
const cert = process.env.HTTP_TLS_CERTIFICATE || 'cert.pem';
const USE_HTTPS = process.env.HTTP !== "true";

const fs = require('fs');
const http = USE_HTTPS ? require('https') : require('http');
const serverConfig = USE_HTTPS ? {
    key: fs.readFileSync(key),
    cert: fs.readFileSync(cert),
} : {}

// imports
const express = require('express');
const app = express();
const {createProxyMiddleware} = require('http-proxy-middleware');
const Docker = require('dockerode');
const {v4: uuidv4} = require('uuid');
const fetch = require("node-fetch");

docker = new Docker(dockerConfig);

let totalGames = 0;

/**
 * Extracts a game ID from a string
 * @param str
 * @returns {*|string}
 */
function getGameId(str) {
    var test = str.match(/[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89aAbB][a-f0-9]{3}-[a-f0-9]{12}/g);
    console.log('getGameid', str, test);
    return test[0];
}

/**
 * Route reverse proxy url to the related monopoly game
 * @param req
 * @returns {string}
 */
function customRouter(req) {
    const seemsWs = !req.protocol;
    console.log('request', req.url, getGameId(req.url));
    const gameName = GAME_CONTAINER_PREFIX + getGameId(req.url);
    let newUrl = 'http://' + gameName + ":8443";

    if (seemsWs) {
        newUrl.replace('http', 'ws');
    }
    console.log('routing to', newUrl);
    return newUrl;
};

/**
 * Rewrites the path of the proxy
 * @param path
 * @param req
 * @returns {string}
 */
function rewriteGamePAth(path, req) {
    let newPath = path.replace('/game/' + getGameId(req.url), '/').replace('//', '/');
    console.log('new Path', newPath);
    return newPath;
};

const options = {
    target: 'http://localhost:8000',
    // ws: true,
    router: customRouter,
    logLevel: 'debug',
    pathRewrite: rewriteGamePAth
};

const myProxy = createProxyMiddleware(options);

/**
 * Gets a list of running game by inspecing the containers on the hosts that match the GAME_PREFIX
 * @returns {Promise<*>}
 */
async function getRunningGames() {

    const listContainers = await docker.listContainers();
    let games = listContainers.filter(c => c.Names.some(n => n.indexOf(GAME_CONTAINER_PREFIX) !== -1));
    return games;
}

/**
 * Checks whether a game is expired by calling /stats on the container.
 * if the container can't be reached it'll be terminated
 * @param container
 * @returns {Promise<boolean>}
 */
async function isGameExpired(container) {
    const gameId = getGameId(container.Names.find(n => n.indexOf(GAME_CONTAINER_PREFIX) !== -1));
    const stats = await fetch('http://' + GAME_CONTAINER_PREFIX + gameId + ':8443/stats')
        .then(r => r.json())
        .catch(e => console.log("Couldn't reach server"));

    if (stats && stats.lastActivity) {
        const now = Date.now();
        return (now - stats.lastActivity) > 1000 * 60 * 60 * 24;
    } else {
        // if we  can't get the info, the game is expired
        return true;
    }
}

/**
 * Checks the started games and if expired, the container will be stopped
 */
async function retireExpiredGames() {
    console.log('Checking running games');

    const games = await getRunningGames();

    console.log('running games', games.length);
    games.forEach(async g => {
        let container = docker.getContainer(g.Id);
        // container.stop();
        if (await isGameExpired(g)) {
            console.log('stopping', g.Names);
            container.stop()
        }
    })
}

/**
 * Creates a new game
 * @param req
 * @param res
 * @returns the game name
 */
async function createNewGame(req, res) {
    console.log('creating new game');
    const gameName = uuidv4();
    const games = await getRunningGames();
    if (games.length < MAX_GAMES) {
        docker.createContainer({
            Image: GAME_IMAGE,
            name: GAME_CONTAINER_PREFIX + gameName,
            Env: [
                "HTTP=true"
            ],
            HostConfig: {
                NetworkMode: DOCKER_NETWORK,
                AutoRemove: true
            }
        }).then(function (container) {
            container.start();
            totalGames++;
        });

        res.send(gameName);
    } else {
        res.status(401);
    }
}

/**
 * Get stats of monopoly manager
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
async function getStats(req, res) {
    const games = await getRunningGames();
    const current = games.length;
    const total = current > totalGames ? current : totalGames;
    totalGames = total;
    res.send(JSON.stringify({
        total: total,
        current: games.length,
        max: MAX_GAMES
    }));
}

console.log('Pulling ' + GAME_IMAGE)
docker.pull(GAME_IMAGE).then(s => {
        console.log('Pull compete, starting server');
        //clean games every hour
        // setInterval(retireExpiredGames, 3600 * 1000);
        setInterval(retireExpiredGames, 10 * 60 * 1000);
        // pulling the game every 24 hours
        setInterval(() => {
            console.log('Pulling ' + GAME_IMAGE)
            docker.pull(GAME_IMAGE).then(s => console.log('pull complete'));
        }, 1000 * 60 * 60 * 24)

        app.use(express.static('static'));

        app.get('/new-game', createNewGame);
        app.get('/stats', getStats);
        app.use('/game/:gameId', myProxy);

        const httpsServer = http.createServer(serverConfig, app);
        httpsServer.listen(8080, '0.0.0.0');
        httpsServer.on('upgrade', myProxy.upgrade); // <-- subscribe to http 'upgrade'

        console.log('Server running. Visit http' + (USE_HTTPS ? "s" : "") + '://localhost:8080 in Firefox/Chrome.\n\n\
Some important notes:\n\
  * Some browsers or OSs may not allow the webcam to be used by multiple pages at once. You may need to use two different browsers or machines.\n\
  * Some browsers may not allow the webcam and microphone to work on a non secure connection\n'
        );
    }
);

