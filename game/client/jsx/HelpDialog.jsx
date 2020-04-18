import React from 'react';
import Dialog from "./components/Dialog";

export default class HelpDialog extends React.Component {

    render() {
        return (<Dialog dismiss={this.props.dismiss} actions={[{name: 'Close', click: this.props.dismiss}]}>
            <h1>Monopoly</h1>
            <p>Welcome to an online Monopoly game !</p>
            <p>This game is meant to be played the same way as the board game meaning that if you roll the dice, you
                need to move your token. If you pass through the GO, the person in charge of the bank needs to send you
                the $200. That also means you can have your own house rules and deals.</p>
            <p>
                You can make change with other players etc... If you buy a deed, the person in charge of the bank needs
                to give it to you and you need to send the money to the bank yourself.
            </p>

            <p>Every action needs to be done by a player and is logged in the "Logs" panel so you don't miss anything</p>
        </Dialog>);
    }
}
