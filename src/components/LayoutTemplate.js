import React from 'react'
import PropTypes from 'prop-types'


class ZoneLayoutTemplate {

}

class LayoutTemplate {

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
        // this.currentZone = undefined;
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

    getBlockGroup(block) {
        return "default";
    }


    // onBeginZone(zone) {
    //     console.log("onBeginZone: " + zone.getZoneId());
    //     this.currentZone = zone;
    // }
    // onEndZone(zone) {
    //     console.log("onEndZone: " + zone.getZoneId());
    //     this.currentZone = undefined;
    // }

    // sortGroupBlocks(group, blocks) {
    //     return blocks;
    // }

    renderZones(zones, filter) {
        const components = [];
        const info = this.getLayoutInfo();
        const zoneIds = info.zones;
        zoneIds.forEach((zoneId) => {
            const zone = zones[zoneId];
            if (typeof(filter) !== 'function' || filter(zoneId, zone)) {
                console.log("** THID:" + this);
                components.push(zone.render(this));
            }
        });
        return (
            <div className="zones">{components}</div>
        );
    }

    renderBlockGroups(blockGroups) {
        console.log("** renderBlockGroups()");
        const result = [];
        blockGroups.forEach((g) => {
            result.push(g.render(this));
        });
        return result;
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

        return this.renderZones(zones);

        // return (
        //     <div className="zones">
        //         {this.renderZones(zones)}
        //     </div>
        // );

        // return (
        //     <div className={`Layout-${this.getName()} Layout-${this.getFullName()} ${this.getFullName()}`}>
        //         {this.renderZones(zones)}
        //     </div>
        // )
        //
        // return (
        //     <div className={`Layout Layout-${this.getName()} ${this.getFullName()} Theme-${theme.getName()} ${theme.getFullName()}`}
        //          theme={theme.getName()}>
        //         <div className={`Theme`}>
        //             {theme.render && theme.render()}
        //         </div>
        //         <Helmet>
        //             {applyContributions}
        //         </Helmet>
        //         {this.renderZones(zones)}
        //     </div>
        // );
    }

}

export default LayoutTemplate
