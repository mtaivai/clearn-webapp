import React from 'react'


import PropTypes from 'prop-types'
import { Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';
import './Block.css'

class BlockMenu extends React.Component {


    constructor(props) {
        super(props);

        this.state = {
            menuVisible: false

        }
        this.blockSpec = props.blockSpec;
        this.onClickMenu = this.onClickMenu.bind(this);
        this.handleSelect = this.handleSelect.bind(this);

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
                <Nav bsStyle="tabs" activeKey={this.props.mode} onSelect={this.handleSelect}>

                    {/*
                    <NavItem eventKey="view" title="View">View</NavItem>
                    <NavItem eventKey="edit" title="Edit">Edit</NavItem>
                    */}
                    <NavDropdown eventKey="actions" title="Actions" id={`block-${this.blockSpec.id}-actions-dd`}>
                        <MenuItem eventKey="edit" disabled={this.props.mode == 'edit'}>Edit</MenuItem>
                        {/*

                        <MenuItem eventKey="4.2">Another action</MenuItem>
                        <MenuItem eventKey="4.3">Something else here</MenuItem>
                        <MenuItem divider />
                        <MenuItem eventKey="4.4">Separated link</MenuItem>
                        */}
                    </NavDropdown>
                </Nav>
            </div>
        )
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
}

export default BlockMenu
