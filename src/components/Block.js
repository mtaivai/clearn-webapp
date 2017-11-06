import React from 'react'
import PropTypes from 'prop-types'

import ContentBlock from './ContentBlock'
import StaticContentBlock from './StaticContentBlock'
import UnknownBlock from './UnknownBlock'

import BlockMenu from './BlockMenu'

import './Block.css'

class Block extends React.Component {

    // zoneId: []
    // mappedZoneBlockComponents = {}

    constructor(props) {
        super(props);

        this.state = {
            layout: null,
            blockComponent: null,
            menuVisible: false

        }
        this.blockSpec = props.blockSpec;

    }




    render() {
        return this.createWrappedBlockComponent();

    }

    createWrappedBlockComponent() {
        const blockSpec = this.props.blockSpec
        return this.wrapBlockComponent(this.createBlockComponent(blockSpec), blockSpec)
    }

    createBlockComponent(blockSpec) {

        const {...props} = this.props;

        props.blockSpec = blockSpec;

        const type = blockSpec.type;
        const blockId = blockSpec.id;
        // const configuration = blockSpec.configuration;

        if (type === 'ContentBlock') {
            return (
                <ContentBlock key={blockId} {...props}/>
            )
        } else if (type === 'StaticContentBlock') {

            return (
                <StaticContentBlock key={blockId} {...props}/>
            )
        } else {
            return (<UnknownBlock key={blockId} {...props}/>)
        }
    }

    wrapBlockComponent(component) {
        const blockSpec = this.props.blockSpec;
        return (
            <div className="block-wrapper">
                <div className="block-header-wrapper">
                    <div className="block-header">
                        <div className="block-title">
                            {blockSpec.title}
                        </div>

                        <BlockMenu blockSpec={blockSpec}/>
                    </div>
                </div>
                <div className="block-body-wrapper">
                    <div className="block-body">
                        {component}
                    </div>
                </div>
                <div className="block-footer-wrapper">
                    <div className="block-footer">
                        Block footer
                    </div>
                </div>
            </div>
        )
    }


}


Block.propTypes = {
    //layoutRepository: PropTypes.instanceOf(LayoutRepository).isRequired,
    //contentRepository: PropTypes.instanceOf(ContentRepository).isRequired
    // todos: PropTypes.arrayOf(
    //     PropTypes.shape({
    //         id: PropTypes.number.isRequired,
    //         completed: PropTypes.bool.isRequired,
    //         text: PropTypes.string.isRequired
    //     }).isRequired
    // ).isRequired,
    // onTodoClick: PropTypes.func.isRequired
}

export default Block
