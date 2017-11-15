//import React from 'react'
import {connect} from 'react-redux'
import { bindActionCreators } from 'redux'

import AssetList from '../components/AssetList'

import * as assetActions from "../actions"


const mapStateToProps = (state) => {
    return {assetItems: state.assets.items};
};

function mapDispatchToProps(dispatch) {
    return {
        assetActions: bindActionCreators(assetActions, dispatch)
    }
}

const ConnectedAssetList = connect(
    mapStateToProps, mapDispatchToProps)(AssetList);

export default ConnectedAssetList;

