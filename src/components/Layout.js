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

    render() {
        // console.log("LayoutZoneBlockWrapper.render(); blockId=" + this.blockSpec.id);
        var result;
        if (typeof(this.decorate) === 'function') {
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

class LayoutZoneWrapper {

    constructor(props) {
        this.zoneId = props.zoneId;
        this.blockWrappers = [];
        this.decorate = props.decorate;
        this.decorateBlockGroup = props.decorateBlockGroup;
        this.rendered = false;
    }

    render() {
        const renderBlocks = () => {
            const blockComponents = [];
            this.blockWrappers.forEach((blockWrapper) => {
                blockComponents.push(blockWrapper.render());
            });
            if (typeof(this.decorateBlockGroup) === 'function') {
                return this.decorateBlockGroup(() => blockComponents);
            } else {
                return blockComponents;
            }
        };
        // console.log(`LayoutZoneWrapper.render(); zoneId = ${this.zoneId}`);

        // return (
        //     <div key={this.zoneId} className={`zone-wrapper zone-wrapper-${this.zoneId} container`}>
        //         <div className={`zone zone-${this.zoneId} row`}>
        //             {renderBlocks()}
        //         </div>
        //     </div>
        // );
        const renderComponent = () => (
            <div key={this.zoneId} className={`zone zone-${this.zoneId}`}>
                {renderBlocks()}
            </div>
        );
        var result;
        if (typeof(this.decorate) === 'function') {
            result = this.decorate(renderComponent, this.zoneId);
        } else {
            result =  renderComponent();
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

    getLayoutTemplate() {

        return this.getThemeOrLayoutTemplateConfig(
            this.state.layout && this.state.layout['layoutTemplate'],
            "LayoutTemplate",
            (className) => require('../templates/' + className).default);
    }

    getTheme() {
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

        const layoutTemplate = this.getLayoutTemplate();
        const theme = this.getTheme();

        this.applyThemeOnDocument(theme);

        const layoutInfo = layoutTemplate.getLayoutInfo();
        // console.log("layoutTemplate: " + layoutTemplate.getName());
        // console.log("layoutInfo: " + JSON.stringify(layoutInfo));

        const zones = layoutInfo.zones;
        const defaultZone = layoutInfo.defaultZone;

        const zoneWrappers = this.mapLayoutZones(zones, defaultZone);



        // Add span (distribute to rows and cols)



        for (var zoneId in zoneWrappers) {

            const zoneWrapper = zoneWrappers[zoneId];

            if (typeof(layoutTemplate.decorateZone) === 'function') {

                zoneWrapper.decorate = (render, zoneId) => {
                    return layoutTemplate.decorateZone(render, zoneId);
                };
            }
            if (typeof(layoutTemplate.decorateBlockGroup) === 'function') {

                zoneWrapper.decorateBlockGroup = (render) => {
                    return layoutTemplate.decorateBlockGroup(render);
                };
            }

            zoneWrapper.blockWrappers.forEach((blockWrapper) => {
                //console.log(`Zone ${zone} block: ${block.blockSpec.id}`);
                const blockSpec = blockWrapper.blockSpec;

                // var span;
                // if (blockSpec.layoutOptions && blockSpec.layoutOptions.span) {
                //     span = blockSpec.layoutOptions.span;
                // } else {
                //     span = defaultSpan;
                // }
                // if (span < minSpan) {
                //     span = minSpan;
                // }
                // else if (span > maxSpan) {
                //     span = maxSpan;
                // }
                //
                // //const span = 4;//blockSpec.layout.span;
                //
                // const spanClass = `block-wrapper col-md-${span}`;
                //
                // blockWrapper.decorate = (render) => {
                //     return (
                //         <div key={blockSpec.id} className={spanClass}>
                //             {render()}
                //         </div>
                //     )
                // };

                if (typeof(layoutTemplate.decorateBlock) === 'function') {

                    blockWrapper.decorate = (render) => {
                        return layoutTemplate.decorateBlock(render, blockSpec);
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
            <div className={`Layout ${theme.getFullName()}`}
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

        zoneIds.forEach((zoneId) => {
            map[zoneId] = new LayoutZoneWrapper({zoneId: zoneId});
        })

        if (defaultZoneId && typeof(map[defaultZoneId]) === 'undefined') {
            map[defaultZoneId] = new LayoutZoneWrapper({zoneId: defaultZoneId});
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

            if (typeof(mappedZone) !== 'undefined') {

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
