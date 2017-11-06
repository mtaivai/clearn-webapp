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

import './Layout.css'

class Layout extends React.Component {

    // zoneId: []
    // mappedZoneBlockComponents = {}

    constructor(props) {
        super(props);

        this.state = {
            layout: null,
            blockComponents: []

        }

        this.contentRepository = props.contentRepository
        this.layoutRepository = props.layoutRepository;
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

    render() {
        // We need to know zones in advance to be able to define a "default drop target"

        const zoneBlocks = this.mapZoneBlocks(["header", "test", "footer"], "test");

        return (
            <div>
                <div className="zone-wrapper zone-wrapper-header">
                    <div className="zone zone-header">
                        {zoneBlocks["header"]}
                    </div>
                </div>

                <div className="zone-wrapper zone-wrapper-main">
                    <div className="zone zone-main">
                        {zoneBlocks["test"]}
                    </div>
                </div>

                <div className="zone-wrapper zone-wrapper-footer">
                    <div className="zone zone-footer">
                        {zoneBlocks["footer"]}
                    </div>
                </div>
            </div>
        );

    }


    mapZoneBlocks(zoneIds, defaultZoneId) {

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
            const layoutSpec = blockSpec.layout;
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
                blockProps.blockSpec = blockSpec;
                const component = (<Block key={blockSpec.id} {...blockProps}/>);//this.wrapBlockComponent(this.createBlockComponent(blockSpec))
                map[mappedZone].push(component);
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
