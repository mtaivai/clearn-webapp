import React from 'react'


// import PropTypes from 'prop-types'
import {  Nav, NavDropdown, MenuItem } from 'react-bootstrap';
import ReactModal from 'react-modal'

import BlockSettingsForm from './BlockSettingsForm'
import './Block.scss'

class BlockMenu extends React.Component {


    constructor(props) {
        super(props);

        this.state = {
            // menuVisible: false
            showModal: ''

        }

        this.blockSpec = props.blockSpec;

        this.updateBlockSpec = props.updateBlockSpec;

        this.onClickMenu = this.onClickMenu.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.handleApplyConfiguration = this.handleApplyConfiguration.bind(this);
    }

    handleSelect(eventKey) {
        //event.preventDefault();
        // alert(`selected ${eventKey}`);

        switch (eventKey) {
            case 'view':
                this.props.setMode('view');
                break;
            case 'edit':
                this.props.setMode('edit');
                break;
            case 'configuration':
                this.setState({
                    showModal: 'configuration'
                });
                break;
            default:
                console.error("Unknown eventKey: " + eventKey);
        }
    }

    // render() {
    //     return (
    //         <div className="block-menu">
    //             <a className="menu-title" onClick={this.onClickMenu}>Menu</a>
    //             {this.createMenuElement()}
    //         </div>
    //     )
    //
    // }
    render() {

        return (
            <div className="block-menu">
                <Nav bsStyle="" activeKey={this.props.mode} onSelect={this.handleSelect}>

                    {/*
                    <NavItem eventKey="view" title="View">View</NavItem>
                    <NavItem eventKey="edit" title="Edit">Edit</NavItem>
                    */}
                    <NavDropdown eventKey="actions" title="Actions" id={`block-${this.blockSpec.id}-actions-dd`}>
                        <MenuItem eventKey="configuration" >Configuration</MenuItem>
                        <MenuItem divider />
                        <MenuItem eventKey="edit" disabled={this.props.mode === 'edit'}>Edit</MenuItem>

                        {/*

                        <MenuItem eventKey="4.2">Another action</MenuItem>
                        <MenuItem eventKey="4.3">Something else here</MenuItem>
                        <MenuItem divider />
                        <MenuItem eventKey="4.4">Separated link</MenuItem>
                        */}
                    </NavDropdown>
                </Nav>
                {this.renderModal()}
            </div>
        )

    }

    renderModal() {
        if (this.state.showModal === 'configuration') {
            return this.renderConfigurationModal();
        } else {
            return (null);
        }
    }

    renderConfigurationModal() {
        const blockSpec = this.props.blockSpec;

        var getBlockSpec = function() {
            console.error("getBlockSpec is not bound");
            return blockSpec;
        }

        return (
            <ReactModal
                isOpen={true}
                contentLabel="Configuration">

                <button onClick={(e) => {this.handleApplyConfiguration(getBlockSpec())}}>Jep</button>

                <BlockSettingsForm
                    blockSpec = {blockSpec}
                    getBlockSpec={(fn) => {getBlockSpec = fn}}/>

                {/*
                <button onClick={(e) => {console.log("settings: " + JSON.stringify(getBlockSpec()))}}>Apply</button>
                */}
            </ReactModal>
        )
    }

    handleApplyConfiguration(blockSpec) {

        if (this.updateBlockSpec) {
            this.updateBlockSpec(blockSpec);
        }

        this.setState({
            showModal: false
        });
    }

    onClickMenu() {

        this.setState({
            menuVisible: !this.state.menuVisible
        })
        // this.menuElement.style.display = "block";

    }


}


BlockMenu.propTypes = {
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
};

export default BlockMenu
