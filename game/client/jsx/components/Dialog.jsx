import React from 'react';

export default class Dialog extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (<div className="dialog overlay" onClick={this.props.dismiss}>
                <div className="content" onClick={(e) => e.stopPropagation()}>
                    {this.props.children}

                    <div className="actions">
                        {this.props.actions && this.props.actions.map(a => <div key={a.name} className="action" onClick={a.click}>{a.name}</div>)}
                    </div>
                </div>
            </div>
        );
    }

}
