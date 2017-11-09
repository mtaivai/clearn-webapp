import React from 'react'
import PropTypes from 'prop-types'

import LayoutRepository from '../services/layout/LayoutRepository'
import ContentRepository from '../services/content/ContentRepository'

// import Todo from './Todo'

//import './ContentBlock.css';
//import MicroEvent from '../microevent.js';
//import ContentBlockBody from './ContentBlockBody'
//import ContentBlockHeader from './ContentBlockHeader'
//import ContentBlockFooter from './ContentBlockFooter'
import {Helmet} from 'react-helmet'

import Block from './Block'

import LayoutTemplate from './LayoutTemplate'
import DefaultLayoutTemplate from '../templates/DefaultLayoutTemplate'
import DashBoardLayoutTemplate from '../templates/DashBoardLayoutTemplate'

import './Layout.css'

class RenderContext {
    constructor(render, props) {
        this.render = render;
        this.props = props || {};
        this.zone = this.props.zone;
        // console.log("RenderContext " + RenderContext.counter + "; zone=" + this.zone);
        RenderContext.counter++;
    }
    getZone() {
        // console.log("RenderContext " + RenderContext.counter + "; getZone=" + this.zone);
        return this.zone;
    }
}
RenderContext.counter = 0;

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
//
// class LayoutZoneBlockGroupWrapper {
//
//     constructor(props) {
//         this.zoneWrapper = props.zoneWrapper;
//         this.groupId = props.groupId;
//     }
//     getGroupId() {
//         return this.groupId;
//     }
//
//     render(layoutTemplate) {
//         var result;
//         if (typeof(layoutTemplate.decorateBlockGroup) === 'function') {
//             // console.log("***LayoutZoneBlockWrapper.decorate=" + this.decorate);
//             result = this.decorate(this.renderBlock);
//         } else {
//             result = this.renderBlock();
//         }
//         this.rendered = true;
//         return result;
//     }
//     renderBlockGroup() {
//         console.error("Warning: LayoutZoneBlockGroupWrapper has unbound renderBlockGroup method");
//         return (null);
//     }
//
// }

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

        this.layoutOptions = {};
        if (props.zoneOptions) {
            const defaultOpts = props.zoneOptions["default"];
            if (defaultOpts) {
                for (let key in defaultOpts) {
                    if (defaultOpts.hasOwnProperty(key)) {
                        this.layoutOptions[key] = defaultOpts[key];
                    }
                }
            }
            const zoneOpts = props.zoneOptions[props.zoneId];
            if (zoneOpts) {
                for (let key in zoneOpts) {
                    if (zoneOpts.hasOwnProperty(key)) {
                        this.layoutOptions[key] = zoneOpts[key];
                    }
                }
            }

        }
    }

    getLayoutOptions() {
        return this.layoutOptions;
    }

    getZoneId() {
        return this.zoneId;
    }


    render() {

        if (!this.layoutTemplate) {
            console.error("Error: ZoneWrapper is not bound to a LayoutTemplate");
            return (null);
        }

        const zone = this;


        // const RenderContext = function(render) {
        //     this.getZone = function() {
        //         return zone;
        //     }
        //     this.render = render;
        // }

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

                        // const renderCtx = new RenderContext(
                        //     (ws) => (ws || blockWrappers).map((w) => w.render(layoutTemplate)),
                        //     {zone: zone});
                        //
                        // result.push(
                        //     this.decorateBlockGroup(
                        //         renderCtx, blockGroup, blockWrappers));
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

                // this.blockWrappers.forEach((blockWrapper) => {
                //     result.push(blockWrapper.render(layoutTemplate));
                // });
                // return result;
            }
        };

        // const renderBlocksWithCallbacks = () => {
        //     layoutTemplate.onBeginZone(this);
        //     try {
        //         return renderBlocks();
        //     } finally {
        //         layoutTemplate.onEndZone(this);
        //     }
        // };
        // console.log(`LayoutZoneWrapper.render(); zoneId = ${this.zoneId}`);

        // return (
        //     <div key={this.zoneId} className={`zone-wrapper zone-wrapper-${this.zoneId} container`}>
        //         <div className={`zone zone-${this.zoneId} row`}>
        //             {renderBlocks()}
        //         </div>
        //     </div>
        // );
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


class Layout extends React.Component {

    // zoneId: []
    // mappedZoneBlockComponents = {}

    constructor(props) {
        super(props);

        this.state = {
            layout: null,
            blockComponents: []

        }

        this.contentRepository = props.contentRepository;
        this.layoutRepository = props.layoutRepository;

        this.onLayoutConfigurationUpdated = this.onLayoutConfigurationUpdated.bind(this);
    }



    fetchLayout() {

        //const blockComponents = []

        this.layoutRepository.getLayout("home")
            .then((layout) => {
                // console.log("Layout fetched: " + JSON.stringify(layout));
                this.setState({
                    layout: layout
                });
            }).catch((error) => {
                console.error("Failed to fetch layout: " + error);
            })

    }

    componentDidMount() {
        this.fetchLayout();
    }

    onLayoutConfigurationUpdated(updated, updatedBlock) {
        console.log("Layout.onLayoutConfigurationUpdated: " + updated + ", " + JSON.stringify(updatedBlock));
        //this.props.blockSpec = JSON.parse(JSON.stringify(blockSpec));
        //this.setState({foo: 123});
        this.forceUpdate();

    }

    getThemeOrLayoutTemplateConfig(config, classNameSuffix, getClass, getDefaultConfig) {

        // TODO cache required classes!

        if (!config) {
            config = getDefaultConfig ? getDefaultConfig() : {name: "Default", options: {}};
        }

        if (typeof(config) === 'string') {
            config = {name: config};
        }

        if (!config.options) {
            config.options = {};
        }

        if (!config.name) {
            config.name = "Default";
        }

        var className = null;
        if (!classNameSuffix || config.name.endsWith(classNameSuffix)) {
            className = config.name;
        } else {
            className = config.name + classNameSuffix;
        }

        const Class = getClass ? getClass(className) : require('./' + className).default;
        const obj = new Class(config.options || {});

        if (!obj.getName) {
            const name = "" + config.name;
            obj.getName = () => name;
        }

        if (!obj.getFullName) {
            obj.getFullName = () => className;
        }
        return obj;
    }

    createLayoutTemplate() {

        return this.getThemeOrLayoutTemplateConfig(
            this.state.layout && this.state.layout['layoutTemplate'],
            "LayoutTemplate",
            (className) => require('../templates/' + className).default);
    }

    createTheme() {
        // const Class = require('../themes/DefaultTheme').default;
        // const obj = new Class({});
        // return obj;
        return this.getThemeOrLayoutTemplateConfig(
            this.state.layout && this.state.layout['theme'],
            "Theme",
            (className) => require('../themes/' + className).default);
    }

    applyThemeOnDocument(theme) {
        document.body.setAttribute('theme', theme.getName());
        var bodyClass = document.body.className;
        const themeClassRegexp = new RegExp('(?:^|\\s)' + theme.getName() + 'Theme(?:$|\\s)');
        if (!bodyClass.match(themeClassRegexp)) {

            if (bodyClass.length > 0 && !bodyClass.endsWith(' ')) {
                bodyClass += ' ';
            }
            bodyClass += theme.getName() + 'Theme';
            document.body.className = bodyClass;

        }
    }

    render() {
        // TODO we should cache lots of stuff between renders!

        const layoutTemplate = this.createLayoutTemplate();
        const theme = this.createTheme();

        this.applyThemeOnDocument(theme);

        const layoutInfo = layoutTemplate.getLayoutInfo();
        // console.log("layoutTemplate: " + layoutTemplate.getName());
        // console.log("layoutInfo: " + JSON.stringify(layoutInfo));

        const zones = layoutInfo.zones;
        const defaultZone = layoutInfo.defaultZone;

        // TODO change zoneWrappers to array?
        const zoneWrappers = this.mapLayoutZones(zones, defaultZone);


        // Add span (distribute to rows and cols)

        if (!this.state.layout) {

            return (<div>Loading</div>);
        }

        for (var zoneId in zoneWrappers) {

            if (!zoneWrappers.hasOwnProperty(zoneId)) {
                continue;
            }

            const zoneWrapper = zoneWrappers[zoneId];

            // Bind LayoutTemplate to wrapper:
            zoneWrapper.layoutTemplate = layoutTemplate;


            if (typeof(layoutTemplate.decorateZone) === 'function') {


                zoneWrapper.decorate = (zone, render) => {
                    const renderContext = new RenderContext(render, {zone: zone});
                    return layoutTemplate.decorateZone(renderContext, zone);
                };
            }

            zoneWrapper.blockWrappers.forEach((blockWrapper) => {
                const blockSpec = blockWrapper.blockSpec;

                if (typeof(layoutTemplate.decorateBlock) === 'function') {
                    blockWrapper.decorate = (render) => {

                        const renderContext = new RenderContext(render, {zone: zoneWrapper});
                        return layoutTemplate.decorateBlock(renderContext, blockSpec, zoneWrapper);
                    };
                }

            });

        }

        const applyContributions = [];
        if (layoutTemplate.getHeadContributions) {
            const contributions = layoutTemplate.getHeadContributions();
            contributions.forEach((contrib) => {
                const key = contrib.key;
                if (!key) {
                    console.error(`Warning: no 'key' specified for head contribution element in layout template ${layoutTemplate.getName()}`);
                } else {
                    // TODO prevent duplicates!
                }
                applyContributions.push(contrib);
            });
        }

        var result = (
            <div
                className={`Layout Layout-${layoutTemplate.getName()} ${layoutTemplate.getFullName()} Theme-${theme.getName()} ${theme.getFullName()}`}
                theme={theme.getName()}>
                <div className={`Theme`}>
                    {theme.render && theme.render()}
                </div>
                <Helmet>
                    {applyContributions}
                </Helmet>
                {layoutTemplate.renderLayout(zoneWrappers)}
            </div>
        );

        for (var zoneId in zoneWrappers) {
            if (!zoneWrappers.hasOwnProperty(zoneId)) {
                continue;
            }
            const zoneWrapper = zoneWrappers[zoneId];
            if (!zoneWrapper.rendered) {
                console.error(`Warning: zone '${zoneId}' not rendered by layout template '${layoutTemplate.getName()}'`);
            }
            zoneWrapper.blockWrappers.forEach((blockWrapper) => {
                if (!blockWrapper.rendered) {
                    console.error(`Warning: Block '${blockWrapper.getBlockId()}' in zone '${zoneId}' not rendered by layout template '${layoutTemplate.getName()}'`);
                }
            });

        }

        return result;



    }

    mapLayoutZones(zoneIds, defaultZoneId) {

        //var components = this.mappedZoneBlockComponents[zoneId];
        //
        // if (components) {
        //     // Already mapped
        //     return components;
        // }

        const layout = this.state.layout;

        // components = []

        const map = {};


        var zoneOptions;

        if (layout) {
            const layoutTemplateConfig = layout["layoutTemplate"] || {};
            const layoutTemplateOptions = layoutTemplateConfig["options"] || {};
            zoneOptions = layoutTemplateOptions["zoneOptions"] || {};
        } else {
            zoneOptions = {};
        }

        zoneIds.forEach((zoneId) => {
            map[zoneId] = new LayoutZoneWrapper({zoneId: zoneId, zoneOptions: zoneOptions});
        });

        if (defaultZoneId && typeof(map[defaultZoneId]) === 'undefined') {
            map[defaultZoneId] = new LayoutZoneWrapper({zoneId: defaultZoneId, zoneOptions: zoneOptions});
        }

        if (!layout) {
            // Layout not yet ready; return empty zones for now
            return map;
        }


        layout.blocks.forEach((blockSpec) => {
            const layoutSpec = blockSpec.layoutOptions;
            const targetZone = layoutSpec ? layoutSpec.targetZone : null;

            var mappedZone;
            if (typeof(map[targetZone]) !== 'undefined') {
                // Known zone
                mappedZone = targetZone
            } else if (defaultZoneId) {
                // Unknown zone, map to default
                mappedZone = defaultZoneId
            } else {
                // Unknown zone; no default defined
                console.error(`No such zone: '${targetZone}' and no default zone defined`);
                mappedZone = undefined;
            }

            // console.log(`Mapping ${blockSpec.id} from ${targetZone} to ${mappedZone}`);

            if (mappedZone) {

                const blockWrapper = new LayoutZoneBlockWrapper({
                    blockSpec: blockSpec,
                    renderBlock: () => {
                        // console.log("renderBlock: " + blockSpec.id);
                        const {...blockProps} = this.props;
                        blockProps.onLayoutConfigurationUpdated = this.onLayoutConfigurationUpdated;
                        blockProps.blockSpec = blockSpec;
                        return (<Block key={blockSpec.id} {...blockProps}/>);
                    }
                });
                map[mappedZone].blockWrappers.push(blockWrapper);

            }
        });
        return map
    }



}


Layout.propTypes = {
    layoutRepository: PropTypes.instanceOf(LayoutRepository).isRequired,
    contentRepository: PropTypes.instanceOf(ContentRepository).isRequired,
    layoutId: PropTypes.string.isRequired
    // todos: PropTypes.arrayOf(
    //     PropTypes.shape({
    //         id: PropTypes.number.isRequired,
    //         completed: PropTypes.bool.isRequired,
    //         text: PropTypes.string.isRequired
    //     }).isRequired
    // ).isRequired,
    // onTodoClick: PropTypes.func.isRequired
}

export default Layout
