import React from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAngry} from "@fortawesome/free-solid-svg-icons";

export default class Jail extends React.Component{

    render() {
        return (<div className={"jail corner-card " + this.props.boardPos}>
            <div className="cell">
                <FontAwesomeIcon icon={faAngry} />
            </div>
        </div>);
    }
}
