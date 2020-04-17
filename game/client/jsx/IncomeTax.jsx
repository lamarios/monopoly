import React from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMoneyBillWaveAlt} from "@fortawesome/free-solid-svg-icons";

export default class IncomeTax extends React.Component{

    render() {
        return (<div className={"super-tax board-card grid-area-"+this.props.position+" " + this.props.boardPos}>
            <div className="title">Income Tax</div>
            <div className="icon">
                <FontAwesomeIcon icon={faMoneyBillWaveAlt} />
            </div>
            <div className="price">Pay $200</div>
        </div>);
    }
}
