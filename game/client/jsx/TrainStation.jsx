import React from 'react';
import {gameService} from "./services/GameService";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faTimesCircle, faTrain} from "@fortawesome/free-solid-svg-icons";
import Mortgage from "./Mortgage";

export default class TrainStation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            opened: false,
            sendTo:'',
        };
    }
    sendStation = () => {
        if (this.state.sendTo.length > 0) {
            const station = this.props.station || gameService.getStation(this.props.position, this.props.game);
            gameService.sendDeed(station.title, 'trainStations', this.state.sendTo);
        }
    }

    render() {
        const station = this.props.station || gameService.getStation(this.props.position, this.props.game);
        const opened = this.state.opened;


        let canSend = false;
        let owner = false;
        if (opened) {
            const permissions = gameService.allowedToSendDeed(station, this.props.game);
            canSend = permissions.canSend;
            owner = permissions.owner;
        }

        const mortgageClass = station.mortgaged ? " mortgaged":"";

        return (<div className={"train-station board-card grid-area-"+this.props.position+" " + this.props.boardPos + " " + (opened ? "opened" : "")+mortgageClass}
                     onClick={() => this.setState({opened: true})}>
            {opened && <a className="close" onClick={(e) => {
                this.setState({opened: false});
                e.stopPropagation();
            }}><FontAwesomeIcon icon={faTimesCircle}/></a>}
            <div className="title">{station.title}</div>
            <div className="icon">
                <FontAwesomeIcon icon={faTrain}/>
            </div>
            {opened && <div className="body">
                {Object.keys(station.rent).map(k => <div key={k}>{k}:&nbsp;{station.rent[k]}</div>)}

                {opened && <Mortgage property={station} isOwner={owner}  game={this.props.game} type="trainStations"/>}

                <div>
                    <hr/>
                    Owned by: {gameService.getPlayerFromId(station.owner).name}
                </div>

                {opened && canSend && <div className='send-street'>
                    <hr/>
                    Send to:
                    <select value={this.state.sendTo} onChange={(e) => this.setState({sendTo: e.target.value})}>
                        <option value="">Select</option>
                        {this.props.game.players.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                    &nbsp;
                    <button onClick={this.sendStation}>Send !</button>
                </div>}

            </div>}
            <div className="price">${station.price}</div>
        </div>);
    }
}
