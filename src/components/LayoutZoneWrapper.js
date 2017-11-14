import React from 'react'

import {RenderContext} from './Layout'
import StringUtils from '../util/StringUtils'
import ObjectUtils from '../util/ObjectUtils'
import Layout from './Layout'

class LayoutZoneWrapper {

    constructor(props) {
        this.zoneId = props.zoneId;
        this.blockWrappers = [];
        this.decorate = props.decorate;
        // this.decorateBlockGroup = props.decorateBlockGroup;
        this.rendered = false;
        this.getBlockGroup = props.getBlockGroup;
        // this.renderBlockGroups = props.renderBlockGroups;

        this.layoutTemplate = props.layoutTemplate;

        // this.layoutOptions = {};

        if (props.zoneOptions) {

            let defaultOpts = props.zoneOptions["default"];
            if (typeof(defaultOpts) === 'string') {
                defaultOpts = {type: defaultOpts};
            }

            let zoneOpts = props.zoneOptions[props.zoneId];
            if (typeof(zoneOpts) === 'string') {
                zoneOpts = {type: zoneOpts};
            }
            this.layoutOptions = Object.assign({}, defaultOpts, zoneOpts);

        } else {
            this.layoutOptions = {};
        }
        this._zoneTemplate = undefined;
    }

    getLayoutOptions() {
        return this.layoutOptions;
    }

    getZoneId() {
        return this.zoneId;
    }

    getZoneTemplate() {
        if (!this._zoneTemplate) {
            this._zoneTemplate = this._createZoneTemplate();
        }
        return this._zoneTemplate;
    }

    _createZoneTemplate() {
        // console.log("_createZoneTemplate: " + JSON.stringify(this.getLayoutOptions()));

        const opts = this.getLayoutOptions();


        return Layout.createLayoutObject(
            opts,
            (name) => StringUtils.toCamelCase(name, (n) => StringUtils.ensureSuffix(n, "ZoneTemplate")),
            (name) => require('../templates/' + name),
            (module, className) => module[className] || module.default
        );
    }


    render() {

        if (!this.layoutTemplate) {
            console.error("Error: ZoneWrapper is not bound to a LayoutTemplate");
            return (null);
        }

        const zone = this;

        const defaultRenderBlockGroups = (blockGroups) => {
            const result = [];
            blockGroups.forEach((g) => {
                result.push(g.render());
            });
            return result;
        };
        const renderBlockGroups = this.layoutTemplate.renderBlockGroups || defaultRenderBlockGroups;


        const renderBlocks = () => {

            // Create block groups
            if (this.layoutTemplate.decorateBlockGroup) {

                const blockGroups = {};
                let prevBlockGroup;
                this.blockWrappers.forEach((blockWrapper) => {

                    let blockGroup;
                    if (this.layoutTemplate.getBlockGroup) {
                        blockGroup = this.layoutTemplate.getBlockGroup(blockWrapper) || prevBlockGroup;
                    }
                    blockGroup = blockGroup || "default";

                    prevBlockGroup = blockGroup;

                    if (!blockGroups[blockGroup]) {
                        blockGroups[blockGroup] = [];
                    }
                    blockGroups[blockGroup].push(blockWrapper);
                });

                const result = [];

                const blockGroupRenderObjs = [];

                for (let blockGroup in blockGroups) {

                    // layoutTemplate.renderBlockGroups();
                    if (blockGroups.hasOwnProperty(blockGroup)) {

                        const blockWrappers = blockGroups[blockGroup];

                        blockGroupRenderObjs.push({
                            name: blockGroup,
                            blocks: blockWrappers,
                            render: () => {

                                const renderCtx = new RenderContext(
                                    (wrappers) => (wrappers || blockWrappers).map((w) => w.render()),
                                    {zone: zone});

                                return this.layoutTemplate.decorateBlockGroup(renderCtx, blockGroup, blockWrappers);

                            }
                        });

                    }
                }

                result.push(renderBlockGroups(blockGroupRenderObjs));

                return result;
            } else {


                return renderBlockGroups([{
                    name: "",
                    blocks: this.blockWrappers,
                    render: () => {
                        const result = [];
                        this.blockWrappers.forEach((blockWrapper) => {
                            result.push(blockWrapper.render());
                        });
                        return result;
                    }
                }]);
            }
        };


        const renderComponent = (layout) => (
            <div key={this.zoneId} className={`zone zone-${this.zoneId}`}>
                {renderBlocks(layout)}
            </div>
        );

        var result;
        if (typeof(this.decorate) === 'function') {
            result = this.decorate(this, renderComponent);
        } else {
            result = renderComponent();
        }
        this.rendered = true;
        return result;
    }

}

export default LayoutZoneWrapper
