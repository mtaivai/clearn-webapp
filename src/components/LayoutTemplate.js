import React from 'react'
import PropTypes from 'prop-types'



class LayoutTemplate {
    // header
    // main
    // sidebar
    // footer
    constructor(options) {
        this.layoutInfo = {
            zones: [],
            defaultZone: undefined
        };
        const {...opts} = options;
        this.options = opts;

        var name = this.constructor.name;
        this.fullName = name;
        if (name.endsWith("LayoutTemplate")) {
            name = name.substring(0, name.length - "LayoutTemplate".length);
        }
        this.name = name;
    }

    getName() {
        return this.name;
    }
    getFullName() {
        return this.fullName;
    }

    getLayoutInfo() {
        return this.layoutInfo;
    }

    renderZones(zones, filter) {
        const components = [];
        const info = this.getLayoutInfo();
        const zoneIds = info.zones;
        zoneIds.forEach((zoneId) => {
            const zone = zones[zoneId];
            if (typeof(filter) !== 'function' || filter(zoneId, zone)) {
                components.push(zone.render());
            }

        });
        return components;
    }

    renderLayout(zones) {

        // console.log("LayoutTemplate.renderLayouts: template: " + this.getName());

        // const info = this.getLayoutInfo();
        // const zoneIds = info.zones;

        // const renderAllZones = (zones) => {
        //     const components = [];
        //     zoneIds.forEach((zoneId) => {
        //         components.push(zones[zoneId].render());
        //     });
        //     return components;
        // };

        return (
            <div className={`Layout-${this.getName()} Layout-${this.getFullName()} ${this.getFullName()}`}>
                {this.renderZones(zones)}
            </div>
        )
    }
}

export default LayoutTemplate
