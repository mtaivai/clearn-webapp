import React from 'react'
import PropTypes from 'prop-types'

import LayoutTemplate from '../components/LayoutTemplate'
import DefaultLayoutTemplate from './DefaultLayoutTemplate'


import './DashBoardLayoutTemplate.css'

class DashBoardLayoutTemplate extends DefaultLayoutTemplate {

    constructor(options) {
        super(options);
        this.layoutInfo = {
            zones: ["header", "main", "sidebar", "footer"],
            defaultZone: "main"
        };

        this.showFooter = options.showFooter;
        this.showSidebar = options.showSidebar;

        // this.decorateBlockGroup = undefined;
        // this.decorateZone = undefined;
        // this.decorateBlockGroup = undefined;

    }

    // getZoneContainerClassName(zoneId) {
    //     switch (zoneId) {
    //         case "header":
    //             return "container-fluid";
    //             break;
    //         default:
    //             return "";
    //     }
    // }

    renderFooter(zones) {
        if (!this.showFooter) {
            return (null);
        }
        return (
            <footer className="footer">
                <div className={"container-fluid"}>
                    <div className={"row"}>
                        <div className="col-md-10 col-md-offset-2">
                            {zones["footer"].render(this)}
                        </div>
                    </div>
                </div>

            </footer>
        );
    }


    renderZones(zones) {

        const renderMain = () => {
            if (this.showSidebar) {
                return (
                    <div className="container-fluid main">
                        <div className="row">
                            <nav className="col-xs-3 col-sm-3 col-md-2 hidden-xs-down bg-faded zone-wrapper-sidebar">
                                {zones["sidebar"].render(this)}
                            </nav>
                            <main className="col-xs-9 col-sm-9 col-xs-offset-3 col-sm-offset-3 col-md-10 col-md-offset-2 pt-3">
                                {zones["main"].render(this)}
                            </main>
                        </div>

                    </div>
                );

            } else {
                return (
                    <div className="container main">
                        <main>
                            {zones["main"].render(this)}
                        </main>
                    </div>
                );
            }

        }

        return (
          <div className={"zones"}>

              <nav className="zone-wrapper-header navbar navbar-toggleable-md navbar-inverse fixed-top bg-inverse">
                  {zones["header"].render()}
              </nav>

              {renderMain()}

              {this.renderFooter(zones)}


          </div>
        );
    }

    decorateZone(renderContext, zone) {
        const zoneId = zone.getZoneId();
        console.log("DZ: " + zoneId);
        switch (zoneId) {
            case 'header':
            case 'footer':
            case 'main':
            case 'sidebar':
                // Don't decorate; we have custom rendering for these
                return renderContext.render();
            default:
                return super.decorateZone(renderContext, zone);
        }

        //return super.decorateZone(renderContext, zoneId);

        // const undecorated = render();
        //
        // // Wrap in to .zone-wrapper.container:
        // return (
        //     <div key={undecorated.key} className={`zone-wrapper zone-wrapper-${zoneId} ${this.getZoneContainerClassName(zoneId)}`}>
        //         {undecorated}
        //     </div>
        // );
    }
    // decorateBlockGroup(render) {
    //
    //     // Add ".row" wrapper
    //     return (
    //         <div className={"row"}>
    //             {render()}
    //         </div>
    //     );
    // }


}

export default DashBoardLayoutTemplate
