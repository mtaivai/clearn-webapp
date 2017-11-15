import React from 'react'
import PropTypes from 'prop-types'

import LayoutRepository from '../services/layout/LayoutRepository'
import ContentRepository from '../services/content/ContentRepository'

import {Helmet} from 'react-helmet'

import Block from './Block'

import StringUtils from '../util/StringUtils'

// import LayoutTemplate from './LayoutTemplate'
import LayoutZoneWrapper from './LayoutZoneWrapper';
import LayoutZoneBlockWrapper from './LayoutZoneBlockWrapper';

import './Layout.css'

class RenderContext {
    constructor(render, props) {
        this.render = render;
        this.props = props || {};
        this.zone = this.props.zone;
    }

    getZoneTemplate() {
        return this.zone && this.zone.getZoneTemplate();
    }
    getZone() {
        // console.log("RenderContext " + RenderContext.counter + "; getZone=" + this.zone);
        return this.zone;
    }
}


class Layout extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            layout: null,
            blockComponents: []

        };



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

    /**
     * Create a class instance based on the configuration:
     *
     * config = {
     *   type: "Default",
     *   properties: {
     *     ...
     *   }
     * }
     *
     * OR
     *
     * config = "Default"
     *
     */

    static createLayoutObject(config, nameMapper, require, getClass) {

        // TODO cache required classes!

        if (!config) {
            config = {type: "default"};
        }

        if (typeof(config) === 'string') {
            config = {type: config};
        }

        if (!config.type) {
            config.type = "default";
        }


        const className = nameMapper(config.type);

        const module = require(className);

        let clazz;
        if (getClass) {
            clazz = getClass(module, className);
        } else {
            clazz = module[className];
        }

        const obj = new clazz(config || {});

        // TODO following should be configurable:
        if (!obj.getName) {
            const name = "" + config.type;
            obj.getName = () => name;
        }

        if (!obj.getFullName) {
            obj.getFullName = () => obj.constructor.name;
        }
        return obj;
    }


    createLayoutTemplate() {
        return Layout.createLayoutObject(
            this.state.layout && this.state.layout['layoutTemplate'],
            (name) => StringUtils.toCamelCase(name, (n) => StringUtils.ensureSuffix(n, "LayoutTemplate")),
            (name) => require('../templates/' + name),
            (module, className) => module[className] || module.default
            );
    }


    createTheme() {
        return Layout.createLayoutObject(
            this.state.layout && this.state.layout['theme'],
            (name) => StringUtils.toCamelCase(name, (n) => StringUtils.ensureSuffix(n, "Theme")),
            (name) => require('../themes/' + name),
            (module, className) => module[className] || module.default
        );
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

    // requireModule(name, requireContextProvider, requireProviders) {
    //
    //     // requireProviders:
    //     // 1. array of functions
    //     // 2. single function
    //
    //     return requireContextProvider().resolve(name);
    //
    //     //
    //     // if (!Array.isArray(requireProviders)) {
    //     //     // convert single item to an array
    //     //     requireProviders = [requireProviders];
    //     // }
    //     //
    //     //
    //     // let module = undefined;
    //     //
    //     // for (let i = 0; i < requireProviders.length; i++) {
    //     //
    //     //     module = requireProviders[i](name);
    //     //
    //     //     if (module) {
    //     //         break;
    //     //     }
    //     //
    //     // }
    //     //
    //     // console.log("foundModule: " + module);
    //     // console.log("foundModule: " + module.default);
    //     // console.log("foundModule: " + module['HiddenLayoutTemplate']);
    //
    // }
    //
    //
    // // makeClassName(name, ...suffixes) {
    // //     let className = this.camelize(name);
    // //     for (let i = suffixes.length - 1; i >= 0; i--) {
    // //         if (!className.endsWith(suffixes[i])) {
    // //             className += suffixes[i];
    // //         }
    // //     }
    // //     return className;
    // // }

    render() {
        // TODO we should cache lots of stuff between renders?

        const layoutTemplate = this.createLayoutTemplate();

        if (!layoutTemplate) {
            console.log("Error: failed to create layout template");
            return (null);
        }
        if (layoutTemplate.shouldRender && !layoutTemplate.shouldRender()) {
            console.log(`LayoutTemplate '${layoutTemplate.getFullName()}.shouldRender() says 'false'`);
            return (null);
        }

        const theme = this.createTheme();
        if (!theme) {
            console.log("Error: failed to create Theme");
            return (null);
        }


        this.applyThemeOnDocument(theme);


        const layoutInfo =
            (layoutTemplate.getLayoutInfo && layoutTemplate.getLayoutInfo())
            || {zones: [], defaultZone: undefined };

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

        for (let zoneId in zoneWrappers) {
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


        let zoneOptions;

        if (layout) {
            const layoutTemplateConfig = layout["layoutTemplate"] || {};
            zoneOptions = layoutTemplateConfig["zoneOptions"] || {};
            // console.log("layout.layoutTemplate: " + JSON.stringify(layout.layoutTemplate));
            // console.log("zoneOptions: " + JSON.stringify(zoneOptions));
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

export {Layout, RenderContext};

export default Layout
