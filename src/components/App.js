import React from 'react'
import Footer from './Footer'
import Header from './Header'

import ConnectedAssetList from '../containers/ConnectedAssetList'
import DevTools from '../containers/DevTools'
import {connect} from 'react-redux'
import { Route } from 'react-router'
import { ConnectedRouter, routerReducer, routerMiddleware, push } from 'react-router-redux'

import MyEditor from './MyEditor'
import NIEditor from './NIEditor'

import './App.css';


const X = connect((state) => ({isWorking: state.assets.isWorking}))(
    ({isWorking}) => (<div>{isWorking ? 'Ladataan...' : ''}</div>)
);


class App extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        //this.store.dispatch(fetchAssets());
    }

    render() {
        const Editor1 = () => (<NIEditor/>);
        const Editor2 = () => (<MyEditor/>);
        const LinkPage = () => (<ConnectedAssetList onAssetClick ={() => {}}/>);
        const Other = () => (<div>Other</div>);

        return (

            <div className={"App"}>
                <Header/>
                <div className={"Main"}>
                    <div className={"container"}>
                        <Route exact path="/" component={Editor1}/>
                        <Route exact path="/editor2" component={Editor2}/>
                        <Route exact path="/link" component={LinkPage}/>
                        <Route exact path="/other" component={Other}/>

                    </div>
                </div>


                <Footer/>
                {/*<DevTools/>*/}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {routerLocation: state.router.location};
};

export default connect(mapStateToProps)(App);