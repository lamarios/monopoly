import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

import {library} from '@fortawesome/fontawesome-svg-core';
import {faHatCowboySide, faDog, faCar, faCat, faShip, faDollarSign, faFrog} from '@fortawesome/free-solid-svg-icons';

library.add(faHatCowboySide, faDog, faCar, faCat, faShip,  faDollarSign, faFrog);

export default class Token extends React.Component {

    render() {
        return (<div className={"token "+(this.props.selected?"selected":"")}>
            <FontAwesomeIcon icon={this.props.token}/>
        </div>);
    }
}