import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faHome, faHotel, faTimesCircle} from "@fortawesome/free-solid-svg-icons";
import {gameService} from "./services/GameService";
import Mortgage from "./Mortgage";

export default class Street extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            opened: false,
        };
    }

    sendStreet = () => {
        if (this.state.sendTo.length > 0) {
            const street = this.props.street || gameService.getStreet(this.props.position, this.props.game);
            gameService.sendDeed(street.title, 'regular', this.state.sendTo);
        }
    }

    addHouse = () => {
        const street = this.props.street || gameService.getStreet(this.props.position, this.props.game);
        gameService.addHouse(street.title);
    }
    addHotel = () => {
        const street = this.props.street || gameService.getStreet(this.props.position, this.props.game);
        gameService.addHotel(street.title);
    }
    removeHouse = () => {
        const street = this.props.street || gameService.getStreet(this.props.position, this.props.game);
        gameService.removeHouse(street.title);
    }
    removeHotel = () => {
        const street = this.props.street || gameService.getStreet(this.props.position, this.props.game);
        gameService.removeHotel(street.title);
    }

    render() {

        const street = this.props.street || gameService.getStreet(this.props.position, this.props.game);

        const houses = [];
        if (street.houses > 0) {
            for (let i = 0; i < street.houses; i++) {
                houses.push(<div className="house" key={i}><FontAwesomeIcon icon={faHome}/></div>)
            }
        } else if (street.hotel > 0) {
            for (let i = 0; i < street.hotel; i++) {
                houses.push(<div className="hotel" key={i}><FontAwesomeIcon icon={faHotel}/></div>)
            }
        }
        const opened = this.state.opened;
        let canSend = false, owner = false, canBuyHouse = false;
        if (opened) {
            const permissions = gameService.allowedToSendDeed(street, this.props.game);
            canSend = permissions.canSend;
            owner = permissions.owner;
            canBuyHouse = gameService.canBuyHouse(street, this.props.game);
        }

        const mortgageClass = street.mortgaged ? " mortgaged":"";

        return (
            <div
                className={"street board-card grid-area-" + this.props.position + " " + this.props.boardPos + " " + (opened ? "opened" : "")+mortgageClass}
                onClick={() => this.setState({opened: true})}>
                {opened && <a className="close" onClick={(e) => {
                    this.setState({opened: false});
                    e.stopPropagation();
                }}><FontAwesomeIcon icon={faTimesCircle}/></a>}
                <div className="color" style={{backgroundColor: street.color}}>
                    {houses}
                </div>
                <div className="title">{street.title}</div>
                <div className="body">
                    {opened && Object.keys(street.rent).map(k => <div key={k}>{k}:&nbsp;{street.rent[k]}</div>)}
                    {opened && <div>
                        <hr/>
                        Cost:
                        {Object.keys(street.cost).map(k => <div key={k}>{k}:&nbsp;{street.cost[k]}</div>)}
                    </div>}

                    {opened && <Mortgage property={street} isOwner={owner} game={this.props.game} type="regular"/>}

                    {opened && canBuyHouse && <div className="housing">
                        <hr />
                        <div>
                            Houses: <button onClick={this.removeHouse}>-</button> {street.houses} /
                            4 <button onClick={this.addHouse}>+</button>
                        </div>
                        {(street.houses === 4 || street.hotel === 1) && <div>
                            Hotel: <button onClick={this.removeHotel}>-</button> {street.hotel} / 1 <button
                            onClick={this.addHotel}>+</button>
                        </div>}
                    </div>}

                    {opened && <div>
                        <hr/>
                        Owned by: {gameService.getPlayerFromId(street.owner).name}
                    </div>}

                    {opened && canSend && <div className='send-street'>
                        <hr/>
                        Send to:
                        <select value={this.state.sendTo} onChange={(e) => this.setState({sendTo: e.target.value})}>
                            <option value="">Select</option>
                            {this.props.game.players.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                        &nbsp;
                        <button onClick={this.sendStreet}>Send !</button>
                    </div>}

                </div>
                <div className="price">${street.price}</div>
            </div>
        )
    }
}
