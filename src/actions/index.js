

import repositories from '../repository'
import { createAction, createActions, handleActions, combineActions } from 'redux-actions'

const assetsMeta = (...args) => {
    return {
        arguments: args
        //dispatchActionOnRequest: true,
        //dispatchAllPhases: true,
        //dispatchMainActionOnRequest: false,
        };
};

//export function fetchAssets() {}

const _updateAsset = createAction('UPDATE_ASSETS', repositories.assets.update, assetsMeta);

export function updateAsset(assetId) {
    return _updateAsset(assetId);
}


export const fetchAssets = createAction('FETCH_ASSETS', repositories.assets.fetch, assetsMeta);

