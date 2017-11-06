import React from 'react'

// import './StaticContentBlock.css';




class StaticContentBlock extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
           // mode: 'edit'
        }
    }

    render() {
        if (this.state.mode == 'edit') {
            return this.renderEdit();
        } else {
            return this.renderView();
        }
    }

    renderView() {
        // console.log("STATIC: " + JSON.stringify(this.props.blockSpec))
        // console.log("C: " + JSON.stringify(this.props.blockSpec.configuration))
        const content = this.props.blockSpec.configuration.contentBodyText
        return (
            <div className="static-content-block">{content}</div>
        )
    }
    renderEdit() {
        return (
            <div>Edit mode</div>
        )
    }
}

export default StaticContentBlock
