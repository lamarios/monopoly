const DOCKER_SOCKET = process.env.DOCKER_SOCKET || '/var/run/docker.sock';

const DOCKER_HOST = process.env.DOCKER_HOST;
const DOCKER_PORT = process.env.DOCKER_PORT;

const DOCKER_NETWORK = process.env.DOCKER_NETWORK || 'bridge';
const GAME_CONTAINER_PREFIX = process.env.GAME_CONTAINER_PREFIX || 'monopoly-game-';
const MAX_GAMES = process.env.MAX_GAMES || 100;
const GAME_IMAGE = process.env.GAME_IMAGE || 'gonzague/monopoly';

let dockerConfig = {socketPath: DOCKER_SOCKET};

if (DOCKER_HOST && DOCKER_PORT) {
    dockerConfig = {
        host: DOCKER_HOST,
        port: DOCKER_PORT
    }
}

// improts
const express = require('express');
const app = express();
const {createProxyMiddleware} = require('http-proxy-middleware');
const Docker = require('dockerode');
const {v4: uuidv4} = require('uuid');
const fetch = require("node-fetch");

docker = new Docker(dockerConfig);

function getGameId(str) {
    var test = str.match(/[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89aAbB][a-f0-9]{3}-[a-f0-9]{12}/g);
    console.log('getGameid', str, test);
    return test[0];
}

const customRouter = function (req) {
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

const webSocketRouter = function (req) {
    const gameName = GAME_CONTAINER_PREFIX + req.params.gameId;
    let newUrl = 'ws://' + gameName + ":8443";
    console.log('routing ws to', newUrl);
    return newUrl;
}

const rewriteGamePAth = function (path, req) {
    let newPath = path.replace('/game/' + getGameId(req.url), '/');
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
 * Checks the started games and if expired, the container will be stopped
 */
async function retireExpiredGames() {
    console.log('Checking running games');

    const listContainers = await docker.listContainers();
    const games = listContainers.filter(c => c.Names.some(n => n.indexOf(GAME_CONTAINER_PREFIX) !== -1));

    console.log('running games', games.length);
    games.forEach(g => {
        let container = docker.getContainer(g.Id);
        // container.stop();
    })
}

/**
 * Creates a new game
 * @param req
 * @param res
 * @returns the game name
 */
function createNewGame(req, res) {
    console.log('creating new game');
    const gameName = uuidv4();

    docker.createContainer({
        Image: GAME_IMAGE,
        name: GAME_CONTAINER_PREFIX + gameName,
        Env: [
            "HTTP=true"
        ],
        HostConfig: {
            NetworkMode: DOCKER_NETWORK
        }
    }).then(function (container) {
        container.start();
    })

    res.send(gameName);
}

//clean games every hour
// setInterval(retireExpiredGames, 3600 * 1000);
setInterval(retireExpiredGames, 30 * 1000);

app.use(express.static('static'));

app.get('/new-game', createNewGame);
app.use('/game/:gameId', myProxy);

const server = app.listen(8080);
server.on('upgrade', myProxy.upgrade); // <-- subscribe to http 'upgrade'



