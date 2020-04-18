# Monopoly
This is an online replica of the famous board game, it also has video and text chat.

The game includes little game logic to replicate playing the board game version. Meaning that if you roll the dice, you need to move your token. If you pass through the GO, the person in charge of the bank need to send you the money.
You can make change with other players etc... If you take a deed, the person in charge of the bank needs to give it to you and you need to send the money to the bank yourself.

A running instance can be found here: https://monop.ftpix.com

This repo is split in two different applications, the game itself and a game launcher. The launcher is a small application to launch new instance of the game container. 

## The Game


### Run

#### Configuration
The application can run without any environment variables.
Note that video chat and microphone access might not work if the software is not running under HTTPS (enabled by default).

##### Environment variables

| Name | Description | Default | Required |
| ---- | -------| ---- | ---- |
| PORT | Which port to run the application on | 8443 | No |
| HTTP_TLS_KEY | Path of the SSL  key | 'key.pem' | No (but recommended) |
| HTTP_TLS_CERTIFICATE | Path of the SSL Certificate | 'cert.pem' | No (but recommended) |
| HTTP | Set to 'true' to disable https. To use if you want to run the game behind a HTTPS reverse proxy for example | 'false' | No |

#### Docker

```
docker run -p "8443:8443" gonzague/monopoly
```
Add environment variables from above relevant for your use case

#### Node
This require node to run.

First the ui needs to be build
```
cd game/client
npm install
npm run build
```
Then we can start the server
```
cd game
npm install
npm start
```

## The launcher
The launcher is a simple web application that will help launch multiple instances of the game and reverse proxy to the instances. It must be ran as a docker container as it needs to communicate with the game instances that will run as containers.

### Run

#### Configuration
The application needs to be able to talk to a docker host.
Note that video chat and microphone access might not work if the software is not running under HTTPS (enabled by default).

##### Environment variables


| Name | Description | Default | Required |
| ---- | -------| ---- | ---- |
| PORT | Which port to run the application on | 8443 | No |
| HTTP_TLS_KEY | Path of the SSL  key | 'key.pem' | No (but recommended) |
| HTTP_TLS_CERTIFICATE | Path of the SSL Certificate | 'cert.pem' | No (but recommended) |
| HTTP | Set to 'true' to disable https. To use if you want to run the launcher behind a HTTPS reverse proxy for example | 'false' | No |
| DOCKER_SOCKET | The path to the docker socket | /var/run/docker.sock | No |
| DOCKER_HOST | If connecting to the docker host via http | | No |
| DOCKER_PORT | The port if connecting to the docker host via http | | No |
| DOCKER_NETWORK| The network which the new games will be started. **It must be the same network as the manager**. If not set the reverse proxy to the games is not going to work. | | **YES** |
| GAME_CONTAINER_PREFIX | This will be use to prefix the  name the new containers | monopoly-game | No |
| MAX_GAMES | Maximum number of games to be ran at the same time | 500 | No |
| GAME_IMAGE | The docker image to be used to run the games | gonzague/monopoly | No |

#### Docker
If you're connecting to the docker socket directly, otherwise use the DOCKER_HOST and DOCKER_PORT environment variables.
```
# The network creation is only for the example, you may not need to create it
docker network create monopoly-network
docker run -p "8080:8080" -v "/var/run/docker.sock:/var/run/docker.sock:ro' --network="monopoly-network" -e "DOCKER_NETWORK=monopoly-network"
```
Add environment variables from above relevant for your use case

## Technology used

- Nodejs
- Websockets
- WebRTC
- React
