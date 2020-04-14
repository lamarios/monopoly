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

const MAX_LOGS = 200;

export default class App extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            logs: [],
            cardToShow: null,
        };
    }

    componentDidMount() {
        const location = window.location;
        let url = location.protocol.replace("http", "ws") + '//' + window.location.hostname + (location.port.length > 0 ? ':' + location.port : "") + location.pathname;
        console.log('location', location, url);
        const wsConnection = new WebSocket(url);

        wsConnection.onmessage = this.updateGame;
        gameService.ws = wsConnection;
        rtcService.serverConnection = wsConnection;
    }

    updateGame = (message) => {
        const data = JSON.parse(message.data);
        if (data.type === 'game') {
            const game = data.game;
            gameService.game = game;
            this.setState({game: game});
        } else if (data.type === 'log') {
            this.setState({logs: data.message});
        } else if (data.type === 'cardDrawn') {
            this.setState({
                cardToShow: {
                    card: data.card,
                    player: data.player,
                    type: data.cardType,
                }
            });
        } else {
            rtcService.gotMessageFromServer(message);
        }
    }

    render() {
        if (this.state.game) {
            const showPlayerDialog = gameService.currentPlayer === null;
            const card = this.state.cardToShow;
            return (<div>
                <div className="game">
                    <Board game={this.state.game}/>
                    <Logs logs={this.state.logs}/>
                    <Video game={this.state.game}/>
                    <Players game={this.state.game}/>
                </div>

                {showPlayerDialog && <SelectPlayerDialog game={this.state.game}/>}
                {card && <div class="card-overlay">
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
            return (<div>Loading Game</div>);
        }
    }

}
