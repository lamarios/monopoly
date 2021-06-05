import React from 'react';
import Board from "./Board";

import {gameService} from "./services/GameService";
import Logs from "./Logs";
import Video from "./Video";
import Players from './Players';
import SelectPlayerDialog from "./SelectPlayerDialog";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTimesCircle} from "@fortawesome/free-solid-svg-icons";
import {rtcService} from "./services/webrtc";
import Settings from "./Settings";
import HelpDialog from "./HelpDialog";

const MAX_LOGS = 200;

export default class App extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            logs: [],
            chat: [],
            cardToShow: null,
            showHelp: true,
            lostConnection: false
        };
    }

    componentDidMount() {
        this.connectToGame();
    }

    connectToGame = () => {
        this.setState({game: null}, () => {
            const location = window.location;
            let url = location.protocol.replace("http", "ws") + '//' + window.location.hostname + (location.port.length > 0 ? ':' + location.port : "") + location.pathname;
            console.log('connecting to websocket', location, url);
            const wsConnection = new WebSocket(url);

            wsConnection.onclose = () => {
                this.setState({lostConnection: true}, () => {
                    setTimeout(this.connectToGame, 1000);
                });
            }

            wsConnection.onmessage = this.updateGame;
            gameService.ws = wsConnection;
            rtcService.serverConnection = wsConnection;
        })

    }

    updateGame = (message) => {
        const data = JSON.parse(message.data);
        if (data.type === 'game') {
            const game = data.game;
            gameService.game = game;
            this.setState({game: game});
        } else if (data.type === 'log') {
            this.setState({logs: data.message});
        } else if (data.type === 'chat') {
            this.setState({chat: data.message});
        } else if (data.type === 'cardDrawn') {
            this.setState({
                cardToShow: {
                    card: data.card,
                    player: data.player,
                    type: data.cardType,
                }
            });
        } else if (data.type === 'newGame') {
            gameService.currentPlayer = null;
        } else {
            rtcService.gotMessageFromServer(message);
        }
    }

    showHelp = () => this.setState({showHelp: true});
    hideHelp = () => this.setState({showHelp: false});

    render() {
        if (this.state.game) {
            const showPlayerDialog = gameService.currentPlayer === null && !this.state.showHelp;
            const card = this.state.cardToShow;
            return (<div>
                <Settings game={this.state.game} logs={this.state.logs} chat={this.state.chat}
                          showHelp={this.showHelp}/>
                <div className="game">
                    <Board game={this.state.game}/>
                    <Logs logs={this.state.logs}/>
                    <Video game={this.state.game} chat={this.state.chat}/>
                    <Players game={this.state.game}/>
                </div>
                {this.state.showHelp && <HelpDialog dismiss={this.hideHelp}/>}
                {showPlayerDialog && <SelectPlayerDialog game={this.state.game}/>}
                {card && <div className="card-overlay">
                    <div className={"card-picked " + card.type}>
                        {<a className="close" onClick={(e) => {
                            this.setState({cardToShow: null});
                        }}><FontAwesomeIcon icon={faTimesCircle}/></a>}
                        <span className="card-type">{card.type}</span>
                        <span className="card-text">{card.card}</span>
                        <span className="card-player">TO: {card.player.name}</span>
                    </div>
                </div>}
            </div>);
        } else {
            return (<div className="game-loading">
                {this.state.lostConnection && <span>Lost connection to server, reconnecting...</span>}
                {!this.state.lostConnection && <span>Loading game...</span>}
            </div>);
        }
    }

}
