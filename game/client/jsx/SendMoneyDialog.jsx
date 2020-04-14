import React from 'react';
import Dialog from "./components/Dialog";
import {gameService} from "./services/GameService";
import Token from "./Token";
import Note from "./Note";

export default class SendMoneyDialog extends React.Component {
    state = {
        toSend: {
            500: 0,
            100: 0,
            50: 0,
            20: 0,
            10: 0,
            5: 0,
            1: 0,
        }
    };

    addNote = (note) => {
        const toSend = this.state.toSend;
        toSend[note] = toSend[note] + 1;
        if (toSend[note] > this.props.player.notes[note]) {
            toSend[note] = this.props.player.notes[note];
        }

        this.setState({toSend: toSend});
    }
    removeNote = (note) => {
        const toSend = this.state.toSend;
        toSend[note] = toSend[note] - 1;
        if (toSend[note] < 0) {
            toSend[note] = 0;
        }

        this.setState({toSend: toSend});
    }

    selectPlayer = (player) => {
        this.setState({dest: player.id})
    }

    sendMoney = () => {
        if(this.state.dest) {
            gameService.sendMoney(this.props.player.id, this.state.dest, this.state.toSend);
            this.props.dismiss();
        }
    }

    render() {
        const player = this.props.player;
        if (player) {
            const availablePlayers = this.props.game.players.filter(p => p.id !== player.id);
            const notes = Object.keys(player.notes).sort((n1, n2) => n2 - n1);
            const sum = gameService.calculateNotesSum(this.state.toSend);

            const actions = [
                {
                    name: 'Close',
                    click: () => this.props.dismiss(),
                },
                {
                    name: 'Send $' + sum,
                    click: () => this.sendMoney(),
                },
            ];

            return (<Dialog actions={actions}>
                <div className="send-money-dialog">
                    <h1>Send Money</h1>
                    <div className="select-player">
                        <h3>Select Player</h3>
                        {availablePlayers.map(p => <div key={p.id} onClick={() => this.selectPlayer(p)}
                                                        className="player">
                            <Token token={p.token} selected={this.state.dest === p.id}/>
                            {p.name}
                        </div>)}

                    </div>
                    <div className="select-notes">
                        <h3>Select notes</h3>
                        <div className="notes">
                            {notes.map(k => <div key={k} className="noteStack">
                                    <Note value={k}/>
                                    <div>
                                        <button onClick={() => this.removeNote(k)}>-</button>
                                        &nbsp;
                                        {this.state.toSend[k]}/{player.notes[k]}
                                        &nbsp;
                                        <button onClick={() => this.addNote(k)}>+</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </Dialog>)
        } else {
            return (<div></div>);
        }
    }
}