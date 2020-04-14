import React from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTreasureChest} from "@fortawesome/pro-solid-svg-icons";
import {faCar} from "@fortawesome/free-solid-svg-icons";

export default class Community extends React.Component {

    render() {
        return (<div className={"community board-card " + this.props.boardPos}>
            <div className="title">Community</div>
            <div className="icon">
                <FontAwesomeIcon icon={faTreasureChest}/>
            </div>
        </div>);
    }
}
