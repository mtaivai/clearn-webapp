import React from 'react'

class LayoutZoneBlockWrapper {

    constructor(props) {
        this.renderBlock = props.renderBlock;
        this.blockSpec = props.blockSpec;
        this.decorate = props.decorate;
        this.rendered = false;
    }

    getBlockId() {
        return this.blockSpec.id;
    }
    getLayoutOptions() {
        return this.blockSpec.layoutOptions || {};
    }
    getLayoutTemplate() {
        return undefined;
    }

    render() {
        // console.log("LayoutZoneBlockWrapper.render(); blockId=" + this.blockSpec.id);
        var result;
        if (typeof(this.decorate) === 'function') {
            // console.log("***LayoutZoneBlockWrapper.decorate=" + this.decorate);
            result = this.decorate(this.renderBlock);
        } else {
            result = this.renderBlock();
        }
        this.rendered = true;
        return result;
    }

    renderBlock() {
        console.error("Warning: LayoutZoneBlockWrapper has unbound renderBlock method");
        return (null);
    }
}

export default LayoutZoneBlockWrapper

