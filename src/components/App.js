import React from 'react'
import Footer from './Footer'
import Header from './Header'

import ConnectedAssetList from '../containers/ConnectedAssetList'
import RenderCounter from "./RenderCounter";
import DevTools from '../containers/DevTools'
import {connect} from 'react-redux'

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
        return (
            <div className={"App"}>
                <Header></Header>
                <div className={"Main"}>
                    <div className={"container"}>
                        <ConnectedAssetList onAssetClick ={() => {}}/>
                    </div>
                </div>

                <Footer></Footer>
                {/*<DevTools/>*/}
            </div>
        );
    }
}

export default connect()(App);