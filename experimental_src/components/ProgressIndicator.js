import React from 'react'

import './ProgessIndicator.css'
class ProgressIndicator extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            status: (props.status != null ? props.status : 'ready')
        }
    }


    render() {
        var statusName = this.props.status;

        return (
            <span className={"progress-indicator-icon progress-indicator-icon-" + statusName}
                title={statusName}>{statusName}</span>
        )
    }

}

export default ProgressIndicator;