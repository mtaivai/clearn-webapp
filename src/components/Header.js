
import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';

import {Nav, NavBar, NavBarCollapse, NavLink} from './nav';

import { ConnectedRouter, routerReducer, routerMiddleware, push} from 'react-router-redux';
//
// class MyNavLink extends React.Component {
//     constructor(props) {
//         super(props);
//     }
//     render() {
//         console.log("MyNavLink.render()");
//         const location = this.props.location;
//         console.log("Location: " + JSON.stringify(location));
//
//         return (
//             <li className={"nav-item" + (this.props.active ? ' active' : '')}>
//                 <Link className={"nav-link"} to={this.props.to}>Link</Link>
//                 <NavLink to={this.props.to}>NavLink</NavLink>
//             </li>
//         );
//     }
// }
//
//

// const ConnectedNavLink = connect(
//     (state) => ({location: state.router.location})
// )(NavLink);



const Header = ({dispatch}) => {

    const NavBarSearch = ({...rest}) => {
        return (
            <form className="form-inline mt-2 mt-md-0">
                <input className="form-control mr-sm-2" type="text" placeholder="Search" aria-label="Search"/>
                <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
            </form>
        );
    };

    return (
        <div className={"Header"}>
            <NavBar>
                <NavLink to={"/"} exact replace className={"navbar-brand"}>Celkie</NavLink>
                {/*<a href={"//localhost:3000/"} className={"navbar-brand"}>Fixed navbar</a>*/}

                <NavBarCollapse id="navbarCollapse">
                    <Nav>
                        <NavLink to={"/"} exact replace>Home</NavLink>
                        <NavLink to={"/link"} replace>Link</NavLink>
                        <NavLink to={"/other"} replace>Other</NavLink>
                        <NavLink to={"#"} disabled>Disabled</NavLink>
                    </Nav>
                    <NavBarSearch/>
                </NavBarCollapse>
            </NavBar>
        </div>
    )
};

export default connect()(Header);