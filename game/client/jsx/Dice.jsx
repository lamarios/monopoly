import React from 'react';
import Board from "./Board";

import {gameService} from "./services/GameService";

export default class Dice extends React.Component {

    constructor(props) {
        super(props)
        this.state = {};
    }

    render() {
        const value = this.props.diceValue;
        const style= {
            animationDelay:"0."+value+"s",
            animationDuration : (Math.random()+1)+"s"
        }
        return (<div className={"dice "+(this.props.rolling?"rolling":"")} style={style}>
            {(value === 4 || value === 5 || value === 6) && <div className="dot top-left"></div>}
            {(value === 2 || value === 3 || value === 4 || value === 5 || value === 6) &&
            <div className="dot top-right"></div>}
            {(value === 6) && <div className="dot middle-left"></div>}
            {(value === 1 || value === 3 || value === 5) && <div className="dot middle-center"></div>}
            {(value === 6) && <div className="dot middle-right"></div>}
            {(value === 2 || value === 3 || value === 4 || value === 5 || value === 6) &&
            <div className="dot bottom-left"></div>}
            {(value === 4 || value === 5 || value === 6) && <div className="dot bottom-right"></div>}
        </div>);
    }

}
