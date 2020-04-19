const HTTPS_PORT = process.env.PORT || 8443;

const key = process.env.HTTP_TLS_KEY || 'key.pem';
const cert = process.env.HTTP_TLS_CERTIFICATE || 'cert.pem';
const https = process.env.HTTP !== "true";

const fs = require('fs');
const http = https ? require('https') : require('http');
const WebSocket = require('ws');
const WebSocketServer = WebSocket.Server;
const static = require('node-static');
const file = new (static.Server)('./static');
const gameService = require('./game').gameService;

let lastActivity = Date.now();

// Yes, TLS is required
const serverConfig = https ? {
    key: fs.readFileSync(key),
    cert: fs.readFileSync(cert),
} : {}

// ----------------------------------------------------------------------------------------

// Create a server for the client html page
const handleRequest = function (request, response) {
    // Render the single client html file for any request the HTTP server receives
    console.log('request received: ' + request.url);

    /*
      if(request.url === '/') {
        response.writeHead(200, {'Content-Type': 'text/html'});
        response.end(fs.readFileSync('client/index.html'));
      } else if(request.url === '/webrtc.js') {
        response.writeHead(200, {'Content-Type': 'application/javascript'});
        response.end(fs.readFileSync('client/webrtc.js'));
      }else{

      }
    */
    if (request.url === '/stats') {
        response.end(JSON.stringify({lastActivity: lastActivity}));
    } else {
        file.serve(request, response);
    }

};

const httpsServer = http.createServer(serverConfig, handleRequest);
httpsServer.listen(HTTPS_PORT, '0.0.0.0');

// ----------------------------------------------------------------------------------------

// Create a server for handling websocket calls
const wss = new WebSocketServer({server: httpsServer});
gameService.ws = wss;
wss.on('connection', function (ws) {

    console.log('new connection');

    // sending state of the game to new connections
    wss.broadcast(JSON.stringify({type: 'game', game: gameService.game}));

    ws.on('error', function (error) {
        console.log(error);
    });

    ws.on('message', function (message) {
        const messageObject = JSON.parse(message);
        console.log('received: %s', message);
        if (messageObject.type === 'game') {
            wss.broadcast(JSON.stringify(gameService.processCommand(messageObject.command, messageObject.params, messageObject.from)));
        } else {

            wss.broadcast(message);
        }
        lastActivity = Date.now();

    });
});

wss.broadcast = function (data) {
    this.clients.forEach(function (client) {
        if (client.readyState === WebSocket.OPEN) {
            client.send(data);
        }
    });
};

console.log('Server running. Visit http' + (https ? "s" : "") + '://localhost:' + HTTPS_PORT + ' in Firefox/Chrome.\n\n\
Some important notes:\n\
  * Some browsers or OSs may not allow the webcam to be used by multiple pages at once. You may need to use two different browsers or machines.\n'
);
