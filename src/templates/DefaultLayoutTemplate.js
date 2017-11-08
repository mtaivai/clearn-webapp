import React from 'react'
import PropTypes from 'prop-types'

import LayoutTemplate from '../components/LayoutTemplate'


import './DefaultLayoutTemplate.css'

class DefaultLayoutTemplate extends LayoutTemplate {

    constructor(options) {
        super(options);
        this.layoutInfo = {
            zones: ["header", "main", "sidebar", "footer"],
            defaultZone: "main"
        };
    }

    getZoneContainerClassName(zoneId) {
        return "container";
    }

    decorateZone(render, zoneId) {

        const undecorated = render();

        // Wrap in to .zone-wrapper.container:
        return (
            <div key={undecorated.key} className={`zone-wrapper zone-wrapper-${zoneId} ${this.getZoneContainerClassName(zoneId)}`}>
                {undecorated}
            </div>
        );
    }
    decorateBlockGroup(render) {

        // Add ".row" wrapper
        return (
            <div className={"row"}>
                {render()}
            </div>
        );
    }

    decorateBlock(render, blockSpec) {
        // console.log("DefaultLayoutTemplate.decorateBlock");

        const minSpan = 1;
        const maxSpan = 12;
        const defaultSpan = 12;

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


        // Wrap inside a .block-wrapper element:

        const spanClass = `block-wrapper col-sm-${span} col-md-${span}`;

        const undecorated = render();
        return (
            <div key={undecorated.key} className={spanClass}>
                {undecorated}
            </div>
        );
    }

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
