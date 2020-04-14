import React from 'react';

export default class Chance extends React.Component {

    render() {
        return (<div className={"chance board-card " + this.props.boardPos}>
            <div className="title">Chance</div>
            <div className="icon">?</div>
        </div>);
    }
}
