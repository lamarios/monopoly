import React from 'react';

export default class Chance extends React.Component {

    render() {
        return (<div className={"chance board-card grid-area-"+this.props.position+" " + this.props.boardPos}>
            <div className="title">Chance</div>
            <div className="icon body">?</div>
        </div>);
    }
}
