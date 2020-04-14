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
const httpProxy = require('http-proxy');
const apiProxy = httpProxy.createProxyServer();
const Docker = require('dockerode');
const {v4: uuidv4} = require('uuid');

docker = new Docker(dockerConfig);

apiProxy.on('error', function (err, req, res) {
    res.writeHead(500, {
        'Content-Type': 'text/plain'
    });

    res.end('Couldn\'t connect to your game');
});

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
        container.stop();
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

/**
 * Reverse proxy the game url to the game itself
 * @param req
 * @param res
 */
async function routeToGame(req, res) {
    if (req.params.gameId) {
        const gameName = GAME_CONTAINER_PREFIX + req.params.gameId;

        const listContainers = await docker.listContainers();
        const game = listContainers.find(c => c.Names.indexOf(gameName) !== -1);
        if (game) {
            console.log(game);

            apiProxy.web(req, res, {
                target: 'http://' + gameName + ":8080",
                ws: true
            })
        } else {
            res.sendStatus(404);
        }

    } else {
        res.sendStatus(404);
    }
}

//clean games every hour
setInterval(retireExpiredGames, 3600 * 1000);

app.use(express.static('static'));

app.get('/new-game', createNewGame);
app.get('/game/:gameId/*', routeToGame);

app.listen(8080);




