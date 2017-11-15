import React from 'react'

import './UnknownBlock.css';




class UnknownBlock extends React.Component {
    // constructor(props) {
    //     super(props);
    // }

    render() {
        return (
            <div className="UnknownBlock">Unknown block type: {this.props.blockSpec.type}</div>
        )
    }
}

export default UnknownBlock
