import React from 'react'
//import PropTypes from 'prop-types'

import {ZoneTemplate, LayoutTemplate} from '../components/LayoutTemplate'


import './DefaultLayoutTemplate.css'




class DefaultLayoutTemplate extends LayoutTemplate {

    constructor(options) {
        super(options);
        this.layoutInfo = {
            zones: ["header", "main", "sidebar", "footer"],
            defaultZone: "main"
        };

    }

    // DefaultLayoutTemplate.getZoneLayoutType = function(zone) {
    //     let val = zone.getLayoutOptions()["layoutType"] || DefaultLayoutTemplate.constants.LAYOUT_DEFAULT;
    //     if (val === "default") {
    //         val = DefaultLayoutTemplate.constants.LAYOUT_DEFAULT;
    //     }
    //     return val;
    // };
    //
    // DefaultLayoutTemplate.constants = {
    //     LAYOUT_HIDDEN: "hidden",
    //     LAYOUT_FLOW: "flow",
    //     LAYOUT_GRID: "grid",
    //     LAYOUT_DEFAULT: "flow"
    // };


    // getZoneTemplate(zone) {
    //
    //     console.log("LOPT:" + JSON.stringify(zone.getLayoutOptions()));
    //
    //     // // TODO load dynamically!
    //     // return new FlowZoneTemplate();
    //     return ZoneTemplate.createZoneTemplate({type: "grid"});
    // }

    getZoneContainerClassName(zoneId) {
        return "container";
    }

    getBlockGroup(block) {
        const row = block.getLayoutOptions()["row"];
        return row ? "row-" + row : undefined;
    }



    decorateZone(renderContext, zone) {

        // if (DefaultLayoutTemplate.getZoneLayoutType(zone) === DefaultLayoutTemplate.constants.LAYOUT_HIDDEN) {
        //     return (null);
        // }

        const undecorated = renderContext.render(this);

        // Wrap in to .zone-wrapper.container:
        return (
            <div key={undecorated.key} className={`zone-wrapper zone-wrapper-${zone.getZoneId()} ${this.getZoneContainerClassName(zone.getZoneId())}`}>
                {undecorated}
            </div>
        );
    }


    decorateBlockGroup(renderContext, group, blocks) {
        return renderContext.getZoneTemplate().decorateBlockGroup(renderContext, group, blocks);
    }




    decorateBlock(renderContext, blockSpec) {
        return renderContext.getZoneTemplate().decorateBlock(renderContext, blockSpec);
    }

    // initRenderContext(renderContext) {
    //     renderContext.tieredLayoutSupport = new TieredLayoutSupport('md');
    // }



    getHeadContributions() {
        /*
            <!-- Latest compiled and minified CSS -->
    <!--<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">-->

    <!-- Optional theme -->
    <!---->

         */

        return [
            (<link key="bootstrap" rel="stylesheet"
                   href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"
                   integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u"
                   crossorigin="anonymous"/>),
            (<link key="bootstrap-theme" rel="stylesheet"
                   href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css"
                   integrity="sha384-rHyoN1iRsVXV4nD0JutlnGaslCJuC7uwjduW9SVrLvRYooPp2bWYgmgJQIXwl/Sp"
                   crossorigin="anonymous"/>)
        ];
    }

}




export default DefaultLayoutTemplate
