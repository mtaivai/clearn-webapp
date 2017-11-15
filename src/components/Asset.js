
import React from 'react';

class Asset extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            asset: props.asset
        }
    }

    render() {
        const asset = this.state.asset;
        return (
            <div className={"Asset"} data-asset-id={asset.id} data-asset-type={asset.type}>

                <div className={"Asset-Meta"}>
                    <span className={"Asset-Type"}>
                        {asset.type}
                    </span>
                </div>
                <h3 className={"Asset-Title"}>
                    <a href={"#"}>
                        {asset.title}
                    </a>
                </h3>
                <div className={"Asset-Excerpt"}>
                    {asset.excerpt}
                </div>
                <div className={"Asset-Content"}>
                    {asset.content}
                </div>

            </div>
        )
    }
}

export default Asset;
