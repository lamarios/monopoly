import React from 'react';

export default class Note extends React.Component {
    render() {
        const value = this.props.value;
        return (<div className={"note v" + value}>
            ${value}
        </div>)
    }
}