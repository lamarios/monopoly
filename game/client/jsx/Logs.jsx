import React from 'react';

export default class Logs extends React.Component {

    render() {
        return (<div className="logs">
            <h3>Logs</h3>
            <div className="text">
                {this.props.logs.map((l, index) => <p key={index}>{l}</p> )}
            </div>
        </div>)
    }
}
