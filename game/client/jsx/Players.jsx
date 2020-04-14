import React from 'react';
import {gameService} from "./services/GameService";
import Token from "./Token";
import PlayerBoard from "./PlayerBoard";

export default class Players extends React.Component {
    state = {};

    render() {
        const selected = this.state.selected;
        const players = this.props.game.players.sort((p1, p2) => {
            return gameService.scorePlayerForSorting(p1) - gameService.scorePlayerForSorting(p2);
        });
        return (<div className="player-list">
            Players
            <div className="player-tabs">
                {players.map(p => <div key={p.id}
                                       onClick={() => this.setState({selected: p.id})}
                                       className={"player "}>
                    <Token token={p.token} selected={p.id === selected}/>
                    {p.name}
                </div>)}
            </div>
            <PlayerBoard player={this.state.selected} game={this.props.game}/>
        </div>)
    }
}
