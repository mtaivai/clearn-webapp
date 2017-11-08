import React from 'react'
import PropTypes from 'prop-types'
import MicroEvent from '../microevent.js';
import {Button, ButtonToolbar} from 'react-bootstrap'

import ContentBlock from './ContentBlock'
import StaticContentBlock from './StaticContentBlock'
import UnknownBlock from './UnknownBlock'

import BlockMenu from './BlockMenu'

import './Block.css'




class BlockEvents extends MicroEvent {

    // constructor() {
    //     super();
    // }
    // triggerBlockEvent(e) {
    //     // if (typeof(contentState) === 'string') {
    //     //     contentState = new ContentState(contentState, new Date());
    //     // }
    //     // var ev = {content: this.content, contentState: contentState};
    //     this.trigger ("block-event", e);
    // }
}

class Block extends React.Component {

    // zoneId: []
    // mappedZoneBlockComponents = {}

    constructor(props) {
        super(props);

        this.state = {
            layout: null,
            //blockComponent: null,
            mode: "view"

        }

        //this.updateLayout = props.onLayoutConfigurationUpdated;

        // this.blockSpec = props.blockSpec;
        this.setMode = this.setMode.bind(this);
        this.onDoneEdit = this.onDoneEdit.bind(this);
        this.onCancelEdit = this.onCancelEdit.bind(this);
        this.updateBlockSpec = this.updateBlockSpec.bind(this);

        this.events = new BlockEvents();
    }

    getMode() {
        return this.state.mode;
    }

    setMode(newMode) {
        console.log("setMode: " + newMode);
        if (newMode === this.state.mode) {
            console.log("Mode not changed");
        } else {
            var validMode = false;

            switch (newMode) {
                case 'view':
                case 'edit':
                    validMode = true;
                    break;
                default:
                    validMode = false;

            }
            if (!validMode) {
                console.error("Invalid mode requested: " + newMode);
            } else {
                this.setState({
                   mode: newMode
                });
            }
        }
    }



    render() {
        return this.createWrappedBlockComponent();

    }

    createWrappedBlockComponent() {
        const blockSpec = this.props.blockSpec;
        this.blockComponent = this.createBlockComponent(blockSpec);
        return this.wrapBlockComponent(this.blockComponent, blockSpec);
    }

    createBlockComponent(blockSpec) {

        const {...props} = this.props;

        props.blockSpec = blockSpec;
        props.mode = this.state.mode;
        props.blockEvents = this.events;

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



    updateBlockSpec(blockSpec) {
        console.log("Block.updateBlockSpec: " + JSON.stringify(blockSpec));

        this.props.layoutRepository.updateBlock(this.props.layoutId, this.props.blockSpec.id, blockSpec)
            .then((updated, updatedBlock) => {
                //this.forceUpdate();
                console.log("Updated: " + updated);
                // Notify (parent) listener:
                if (updated) {
                    if (this.props.onLayoutConfigurationUpdated) {
                        this.props.onLayoutConfigurationUpdated(updated, updatedBlock);
                    }
                }
            }).catch((msg, e) => {
                console.error(msg, e);
        });


    }


    wrapBlockComponent(component) {
        const blockSpec = this.props.blockSpec;

        var cssClass = "Block";

        const mode = this.getMode();
        if (mode === 'edit') {
            cssClass += " edit";
        }

        return (
            <div className={cssClass}>
                <div className="block-header-wrapper">
                    <div className="block-header">
                        <div className="block-title">
                            {blockSpec.title}
                        </div>

                        <BlockMenu
                            blockSpec={blockSpec}
                            mode={this.state.mode}
                            setMode={this.setMode}
                            updateBlockSpec={this.updateBlockSpec}/>
                    </div>
                </div>
                <div className="block-body-wrapper">
                    {this.createBlockToolbar()}

                    <div className="block-body">
                        {component}
                    </div>
                </div>
                <div className="block-footer-wrapper">
                    <div className="block-footer">
                        {/*<span>Mode: {this.state.mode}</span>*/}

                    </div>
                </div>
            </div>
        )
    }

    createBlockToolbar() {
        if (this.state.mode === 'edit') {
            return (
                <div className="block-body-main-toolbar">
                    <span className="toolbar-status">Edit mode</span>
                    <ButtonToolbar>
                        <Button bsSize="xsmall" bsStyle="primary" onClick={this.onDoneEdit}>Done</Button>
                        <Button bsSize="xsmall" bsStyle="link" onClick={this.onCancelEdit}>Cancel</Button>
                    </ButtonToolbar>
                </div>
            )
        } else {
            return (null);
        }
    }

    onDoneEdit(ev) {
        this.events.trigger("edit-mode", "save");
        this.setMode("view");

    }

    onCancelEdit(ev) {
        this.events.trigger("edit-mode", "cancel");
        this.setMode("view");

    }


}


Block.propTypes = {
    layoutId: PropTypes.string.isRequired,
    blockSpec: PropTypes.object.isRequired,

    onLayoutConfigurationUpdated: PropTypes.func
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
