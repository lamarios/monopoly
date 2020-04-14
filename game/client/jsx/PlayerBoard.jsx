import React from 'react';
import Note from "./Note";
import {gameService} from "./services/GameService";
import Street from "./Street";
import Utility from "./Utility";
import TrainStation from "./TrainStation";
import SendMoneyDialog from "./SendMoneyDialog";

export default class PlayerBoard extends React.Component {
    state = {};

    render() {
        if (this.props.player) {
            const game = this.props.game;
            const player = game.players.find(p => p.id === this.props.player);
            const notes = Object.keys(player.notes).sort((n1, n2) => n2 - n1);
            const deeds = game.deeds;
            return (<div className="player-board">
                <div>
                    <p>Total: ${gameService.calculateNotesSum(player.notes)}</p>
                    <div className="notes">
                        {notes.map(k => <div key={k} className="noteStack">
                                <Note value={k}/>
                                x{player.notes[k]}
                            </div>
                        )}
                        {(gameService.currentPlayer === player.id) &&
                        <button onClick={() => this.setState({sendMoneyDialog: true})}>Send money to player /
                            bank</button>}
                        {(player.id === 1) &&
                        <button onClick={() => this.setState({sendMoneyDialog: true})}>Take money from bank</button>}
                    </div>
                </div>
                <div>
                    <p>Deeds:</p>
                    <div className="deeds">
                        {deeds.regular.filter(s => s.owner == player.id).map(s => <Street key={s.title}
                                                                                          position={s.position}
                                                                                          game={game}/>)}
                        {deeds.trainStations.filter(s => s.owner == player.id).map(s => <TrainStation key={s.title}
                                                                                                      position={s.position}
                                                                                                      game={game}/>)}
                        {deeds.utilities.filter(s => s.owner == player.id).map(s => <Utility key={s.title}
                                                                                             position={s.position}
                                                                                             game={game}/>)}
                    </div>
                </div>
                {this.state.sendMoneyDialog &&
                <SendMoneyDialog game={game} player={player} dismiss={() => this.setState({sendMoneyDialog: false})}/>}
            </div>)
        } else {
            return (<div></div>);
        }
    }
}