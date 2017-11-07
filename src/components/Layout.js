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

import Block from './Block'

import ExampleLayout from './ExampleLayout'

import './Layout.css'

class LayoutZoneBlockWrapper {

    constructor(props) {
        this.renderBlock = props.renderBlock;
        this.blockSpec = props.blockSpec;
        this.decorate = props.decorate;
    }

    render() {
        console.log("LayoutZoneBlockWrapper.render(); blockId=" + this.blockSpec.id);
        if (this.decorate) {
            return this.decorate(this.renderBlock);
        } else {
            return this.renderBlock();
        }
    }

    renderBlock() {
        console.error("Warning: LayoutZoneBlockWrapper has unbound renderBlock method");
        return (null);
    }
}

class LayoutZoneWrapper {

    constructor(zoneId) {
        this.zoneId = zoneId;
        this.blockWrappers = []
    }

    render() {
        const that = this;
        const renderBlocks = function() {
            const blockComponents = [];
            that.blockWrappers.forEach((blockWrapper) => {
                blockComponents.push(blockWrapper.render());
            });
            return blockComponents;
        }
        console.log(`LayoutZoneWrapper.render(); zoneId = ${this.zoneId}`);

        return (
            <div className={`zone-wrapper zone-wrapper-${this.zoneId} container`}>
                <div className={`zone zone-${this.zoneId} row`}>
                    {renderBlocks()}
                </div>
            </div>
        );
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

    render() {
        const layout = new ExampleLayout();
        const layoutInfo = layout.getLayoutInfo();
        console.log("layout: " + typeof(layout));
        console.log("layoutInfo: " + JSON.stringify(layoutInfo));

        const zones = layoutInfo.zones;
        const defaultZone = layoutInfo.defaultZone;

        const zoneWrappers = this.mapLayoutZones(zones, defaultZone);

        // zoneWrappers.getZone = function(zoneId) {
        //     const z = zoneWrappers[zoneId];
        //     // Return empty LayoutZoneWrapper
        //     return z ? z : new LayoutZoneWrapper(zoneId);
        // };


        // {
        //    "main": [
        //       render: renderFunc
        //    ]
        // }
        //const zoneBlockObjects = {};

        // Add span (distribute to rows and cols)

        const minSpan = 1;
        const maxSpan = 12;
        const defaultSpan = 12;

        for (var zone in zoneWrappers) {

            const zoneWrapper = zoneWrappers[zone];

            zoneWrapper.blockWrappers.forEach((blockWrapper) => {
                //console.log(`Zone ${zone} block: ${block.blockSpec.id}`);
                const blockSpec = blockWrapper.blockSpec;

                var span;
                if (blockSpec.layoutOptions && blockSpec.layoutOptions.span) {
                    span = blockSpec.layoutOptions.span;
                } else {
                    span = defaultSpan;
                }
                if (span < minSpan) {
                    span = minSpan;
                }
                else if (span > maxSpan) {
                    span = maxSpan;
                }

                //const span = 4;//blockSpec.layout.span;

                const spanClass = `block-wrapper col-md-${span}`;

                blockWrapper.decorate = (render) => {
                    return (
                        <div key={blockSpec.id} className={spanClass}>
                            {render()}
                        </div>
                    )
                };

            });
            //const ids = zoneBlocks[zone].map((x) => { return x.blockSpec.id });
            //console.log("Zone " + zone + ": " + JSON.stringify(ids));

            // layout.span

        }


        return (
            <div className="Layout">
                Layout
                <div className="LayoutInner">
                    LayoutInner
                    {layout.renderLayout(zoneWrappers)}
                </div>
            </div>
        );

    }

    OLD_render() {
        // We need to know zones in advance to be able to define a "default drop target"

        const zoneBlocks = this.mapZoneBlocks(["header", "main", "footer"], "main");

        const zoneBlockComponents = {};

        // Add span (distribute to rows and cols)

        const minSpan = 1;
        const maxSpan = 12;
        const defaultSpan = 12;

        for (var zone in zoneBlocks) {

            const componentList = []
            zoneBlockComponents[zone] = componentList;

            zoneBlocks[zone].forEach((zoneBlock) => {
                //console.log(`Zone ${zone} block: ${block.blockSpec.id}`);
                const blockSpec = zoneBlock.blockSpec;

                var span;
                if (blockSpec.layoutOptions && blockSpec.layoutOptions.span) {
                    span = blockSpec.layoutOptions.span;
                } else {
                    span = defaultSpan;
                }
                if (span < minSpan) {
                    span = minSpan;
                }
                else if (span > maxSpan) {
                    span = maxSpan;
                }

                //const span = 4;//blockSpec.layout.span;

                const spanClass = `block-wrapper col-md-${span}`;


                componentList.push((<div key={blockSpec.id} className={spanClass}>{zoneBlock.component}</div>));
            });
            //const ids = zoneBlocks[zone].map((x) => { return x.blockSpec.id });
            //console.log("Zone " + zone + ": " + JSON.stringify(ids));

            // layout.span

        }

        return (
            <div className="Layout">
                <div className="LayoutInner">
                    {this.renderZone("header", zoneBlockComponents)}
                    {this.renderZone("main", zoneBlockComponents)}
                    {this.renderZone("footer", zoneBlockComponents)}
                </div>
            </div>
        );
    }

    OLD_renderZone(zoneId, zoneBlockComponents) {
        return (
            <div className={`zone-wrapper zone-wrapper-${zoneId} container`}>
                <div className={`zone zone-${zoneId} row`}>
                    {zoneBlockComponents[zoneId]}
                </div>
            </div>
        );
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
            map[zoneId] = new LayoutZoneWrapper(zoneId);
        })

        if (defaultZoneId && typeof(map[defaultZoneId]) === 'undefined') {
            map[defaultZoneId] = new LayoutZoneWrapper(defaultZoneId);
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
                mappedZone = null;
            }

            // console.log(`Mapping ${blockSpec.id} from ${targetZone} to ${mappedZone}`);

            if (typeof(mappedZone) !== 'undefined') {

                const blockWrapper = new LayoutZoneBlockWrapper({
                    blockSpec: blockSpec,
                    renderBlock: () => {
                        console.log("renderBlock: " + blockSpec.id);
                        const {...blockProps} = this.props;
                        blockProps.onLayoutConfigurationUpdated = this.onLayoutConfigurationUpdated;
                        blockProps.blockSpec = blockSpec;
                        return (<Block key={blockSpec.id} {...blockProps}/>);//this.wrapBlockComponent(this.createBlockComponent(blockSpec))
                    }
                });
                map[mappedZone].blockWrappers.push(blockWrapper);

                // const {...blockProps} = this.props;
                // blockProps.onLayoutConfigurationUpdated = this.onLayoutConfigurationUpdated;
                // blockProps.blockSpec = blockSpec;
                // const component = (<Block key={blockSpec.id} {...blockProps}/>);//this.wrapBlockComponent(this.createBlockComponent(blockSpec))
                // map[mappedZone].push({blockSpec: blockSpec, component: component});
            }


        })
        return map
    }

    /**
     * Map of
     * {
     *  zoneId: [{blockSpec: {}, component: {}}]
     * }
     * @param zoneIds
     * @param defaultZoneId
     * @returns {{}}
     */
    OLD_mapZoneBlocks(zoneIds, defaultZoneId) {

        //var components = this.mappedZoneBlockComponents[zoneId];
        //
        // if (components) {
        //     // Already mapped
        //     return components;
        // }

        const layout = this.state.layout;
        if (!layout) {
            // Layout not yet ready
            return {};
        }

        // components = []

        var map = {}
        zoneIds.forEach((zoneId) => {
            map[zoneId] = []
        })

        if (defaultZoneId && typeof(map[defaultZoneId]) === 'undefined') {
            map[defaultZoneId] = []
        }


        layout.blocks.forEach((blockSpec) => {
            const layoutSpec = blockSpec.layoutOptions;
            const targetZone = layoutSpec ? layoutSpec.targetZone : null;

            var mappedZone
            if (typeof(map[targetZone]) !== 'undefined') {
                // Known zone
                mappedZone = targetZone
            } else if (defaultZoneId) {
                // Unknown zone, map to default
                mappedZone = defaultZoneId
            } else {
                // Unknown zone; no default defined
                mappedZone = null;
            }

            // console.log(`Mapping ${blockSpec.id} from ${targetZone} to ${mappedZone}`);

            if (typeof(mappedZone) !== 'undefined') {
                const {...blockProps} = this.props;
                blockProps.onLayoutConfigurationUpdated = this.onLayoutConfigurationUpdated;
                blockProps.blockSpec = blockSpec;
                const component = (<Block key={blockSpec.id} {...blockProps}/>);//this.wrapBlockComponent(this.createBlockComponent(blockSpec))
                map[mappedZone].push({blockSpec: blockSpec, component: component});
            }


        })
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
