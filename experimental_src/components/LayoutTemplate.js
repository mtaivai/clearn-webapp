import React from 'react'
// import PropTypes from 'prop-types'


// class ZoneLayoutTemplate {
//
// }

import Layout from '../components/Layout'
import StringUtils from '../util/StringUtils'

class ZoneTemplate {

    static createZoneTemplate(config) {
        return Layout.createLayoutObject(
            config,
            (name) => StringUtils.toCamelCase(name, (n) => StringUtils.ensureSuffix(n, "ZoneTemplate")),
            (name) => require('../templates/' + name),
            (module, className) => module[className] || module.default
        );
    }


}

class TieredLayoutConfiguration {

    static defaultTiers = ['xs', 'sm', 'md', 'lg'];

    constructor(obj, initDefault) {
        if (obj === null || typeof(obj) === 'undefined') {
            if (typeof(initDefault) === 'undefined') {
                obj = {};
            } else if (typeof(initDefault) === 'function') {
                obj = initDefault({}, 'default');
            } else {
                obj = initDefault;
            }
        }

        if (typeof(obj) === 'object' && !Array.isArray(obj)) {
            console.log("is object: " + JSON.stringify(obj));
            Object.assign(this, obj);
        } else if (obj) {
            console.log("is NOT obj: " + JSON.stringify(obj));
            this['default'] = obj;
        }

    }

    forEach(fn) {
        for (let tier in this) {
            if (!this.hasOwnProperty(tier)) {
                continue;
            }
            fn(tier, this[tier]);
        }
    }
    expandDefault(tiers) {

        const expanded = new TieredLayoutConfiguration(this);

        const def = this['default'];
        tiers = tiers || TieredLayoutConfiguration.defaultTiers;
        if (typeof(def) !== "undefined") {

            tiers.forEach((t) => {
                if (typeof(expanded[t]) === 'undefined') {
                    expanded[t] = def;
                }
            });

        }
        delete expanded['default'];


        return expanded;
    }

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
        // console.log("LayoutTemplate options=" + JSON.stringify(options));
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
                components.push(zone.render(this));
            }
        });
        return (
            <div className="zones">{components}</div>
        );
    }

    renderBlockGroups(blockGroups) {
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
export {ZoneTemplate, TieredLayoutConfiguration, LayoutTemplate}
export default LayoutTemplate
