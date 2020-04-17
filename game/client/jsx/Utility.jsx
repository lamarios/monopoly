import React from 'react';
import {gameService} from "./services/GameService";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFaucet, faTimesCircle} from "@fortawesome/free-solid-svg-icons";
import {faLightbulbOn} from "@fortawesome/pro-solid-svg-icons";

export default class Utility extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            opened: false,
            sendTo: '',
        };
    }

    sendUtility = () => {
        if (this.state.sendTo.length > 0) {
            const utility = this.props.utility || gameService.getUtility(this.props.position, this.props.game);
            gameService.sendDeed(utility.title, 'utilities', this.state.sendTo);
        }
    }

    render() {
        const utility = this.props.utility || gameService.getUtility(this.props.position, this.props.game);
        const opened = this.state.opened;

        let canSend = false;
        if (opened) {
            const permissions = gameService.allowedToSendDeed(utility, this.props.game);
            canSend = permissions.canSend;
        }

        return (
            <div className={"utility grid-area-"+this.props.position+" board-card " + this.props.boardPos + " " + (opened ? "opened" : "")}
                 onClick={() => this.setState({opened: true})}>

                {opened && <a className="close" onClick={(e) => {
                    this.setState({opened: false});
                    e.stopPropagation();
                }}><FontAwesomeIcon icon={faTimesCircle}/></a>}

                <div className="title">{utility.title}</div>
                <div className="icon body">

                    {utility.type === 'water' && <FontAwesomeIcon icon={faFaucet}/>}
                    {utility.type === 'electricity' && <FontAwesomeIcon icon={faLightbulbOn}/>}
                </div>
                {opened && <div className="body">
                    {utility.description}


                    <div>
                        <hr/>
                        Owned by: {gameService.getPlayerFromId(utility.owner).name}
                    </div>

                    {opened && canSend && <div className='send-street'>
                        <hr/>
                        Send to:
                        <select value={this.state.sendTo} onChange={(e) => this.setState({sendTo: e.target.value})}>
                            <option value="">Select</option>
                            {this.props.game.players.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                        &nbsp;
                        <button onClick={this.sendUtility}>Send !</button>
                    </div>}

                </div>}
                <div className="price">{utility.price}</div>
            </div>);
    }
}
