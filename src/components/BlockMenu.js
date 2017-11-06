import React from 'react'


import PropTypes from 'prop-types'

import './Block.css'

class BlockMenu extends React.Component {


    constructor(props) {
        super(props);

        this.state = {
            menuVisible: false

        }
        this.blockSpec = props.blockSpec;
        this.onClickMenu = this.onClickMenu.bind(this);

    }


    render() {
        return (
            <div className="block-menu">
                <a className="menu-title" onClick={this.onClickMenu}>Menu</a>
                {this.createMenuElement()}
            </div>
        )

    }
    createMenuElement() {
        if (this.state.menuVisible) {
            return (
                <ul ref={(ul) => {
                    this.menuElement = ul
                }}>
                    <li>Yksi</li>
                    <li>Kaksi</li>
                    <li>Kolme</li>
                </ul>
            )
        } else {
            return (null)
        }
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
