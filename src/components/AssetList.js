import React from 'react'
import PropTypes from 'prop-types'
import Asset from './Asset'

//import {fetchAssets, updateAsset} from "../actions";



const AssetList = ({ assetItems, onAssetClick, assetActions }) => {
    const items = assetItems || [];
    return (
        <div>
            <button onClick={() => {assetActions.fetchAssets()}}>
                Hae
            </button>
            <button onClick={() => {assetActions.updateAsset(0)}}>
                Muokkaa 0
            </button>

            <ul className={"AssetList"}>
                {items.map((asset, index) => (
                    <li className="AssetList-Item" key={index}>
                        <Asset asset={asset} onClick={() => onAssetClick(index)} />
                    </li>
                ))}
            </ul>
        </div>
    );
};


AssetList.propTypes = {
    assetActions: PropTypes.shape({
        fetchAssets: PropTypes.func.isRequired
    })
    // assets: PropTypes.arrayOf(
    //     PropTypes.shape({
    //         id: PropTypes.number.isRequired,
    //         //completed: PropTypes.bool.isRequired,
    //         text: PropTypes.string.isRequired
    //     }).isRequired
    // ).isRequired
    // ,
    // onAssetClick: PropTypes.func.isRequired
}

export default AssetList
