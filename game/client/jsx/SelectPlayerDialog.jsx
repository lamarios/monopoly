import React from 'react';
import Dialog from "./components/Dialog";
import Token from "./Token";
import {gameService} from './services/GameService';

const TOKENS = ['hat-cowboy-side', 'dog', 'cat', 'car', 'ship', 'frog'];

export default class SelectPlayerDialog extends React.Component {
    state = {
        newPlayer: {
            name: '',
            token: '',
            error: ''
        }
    }

    setPlayerName = (event) => {
        const player = this.state.newPlayer;
        player.name = event.target.value;
        this.setState({newPlayer: player});
    }

    selectToken = (token) => {
        const player = this.state.newPlayer;
        player.token = token;
        this.setState({newPlayer: player});
    }

    addPlayer = () => {
        const player = this.state.newPlayer;
        if (player.name.length === 0) {
            this.setState({error: 'Name is empty'})
            return;
        }
        if (player.token.length === 0) {
            this.setState({error: 'You need to select a token'})
            return;
        }
        if (this.props.game.players.some(p => p.name.toLowerCase() === player.name.toLowerCase() || p.token === player.token)) {
            this.setState({error: 'Player with the same name or token already exist'})
            return;
        }

        gameService.addNewPlayer(player);
    }

    selectPlayer = (player) => {
        gameService.currentPlayer = player.id;
        gameService.sendToWs('dull', 'dull');
    }

    render() {
        const availablePlayers = this.props.game.players.filter(p => p.id !== 1);
        const availableTokens = TOKENS.filter(t => availablePlayers.findIndex(p => p.token === t) === -1);
        return (<Dialog>
            <div className="select-player-dialog">
                {availablePlayers.length > 0 && <div className="select-player">
                    <h1>Play as</h1>
                    {availablePlayers.map(p => <div key={p.id} onClick={() => this.selectPlayer(p)} className="player">
                        <Token token={p.token}/>
                        {p.name}
                    </div>)}
                </div>}
                {!this.props.game.started && <div className="new-player">
                    {availablePlayers.length > 0 && <h3>Or create a new Player</h3>}
                    {availablePlayers.length === 0 && <h1>Create a new Player</h1>}
                    <div>
                        <input type="text" placeholder="Player name" value={this.state.newPlayer.name}
                               onChange={this.setPlayerName}/>
                    </div>
                    <p>Select token:</p>
                    <div className="tokens">
                        {availableTokens.map(t => <span key={t} onClick={() => this.selectToken(t)}>
                        <Token token={t} selected={this.state.newPlayer.token === t}/>
                    </span>)}
                    </div>
                    <button onClick={this.addPlayer}>Start</button>
                    &nbsp;{this.state.error}
                </div>}
            </div>
        </Dialog>)
    }
}