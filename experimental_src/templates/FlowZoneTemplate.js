import React from 'react'

import {TieredLayoutConfiguration} from "../components/LayoutTemplate";

class FlowZoneTemplate {


    decorateBlockGroup(renderContext, group, blocks) {

        // Add ".row" wrapper
        return (
            <div key={"row-" + group} className={`row row-${group}`}>
                {renderContext.render()}
            </div>
        );
    }





    decorateBlock(renderContext, blockSpec) {

        const columnCount = 12;
        const maxColumnOffset = columnCount - 1;
        // const defaultSpan = maxColumnOffset + 1;

        const span = new TieredLayoutConfiguration(blockSpec.layoutOptions.columnSpan, () =>
            maxColumnOffset + 1
        ).expandDefault();

        const offset = new TieredLayoutConfiguration(blockSpec.layoutOptions.columnOffset).expandDefault();

        let wrapperClass = `block-wrapper`;

        // Sanitize and add span classes
        span.forEach((spanTier, spanValue) => {

            if (spanValue < 1) {
                spanValue = 1;
            } else if (spanValue > columnCount) {
                spanValue = columnCount;
            }
            wrapperClass += ` col-${spanTier}-${spanValue}`;
        });


        // Sanitize and add offset classes
        let offsetClasses = "";
        let anyOffsetNonZero = false;
        offset.forEach((offsetTier, offsetValue) => {

            if (offsetValue < 0) {
                offsetValue = 0;
            } else if (offsetValue > maxColumnOffset) {
                offsetValue = maxColumnOffset;
            }
            if (offsetValue > 0) {
                anyOffsetNonZero = true;
            }
            offsetClasses += ` col-${offsetTier}-offset-${offsetValue}`;
        });

        if (anyOffsetNonZero) {
            wrapperClass += offsetClasses;
        }


        let hiddenClasses = "";
        let defaultHidden = false;
        let visible = new TieredLayoutConfiguration(blockSpec.layoutOptions.visible);

        const defaultVisible = visible.default;
        if (typeof(defaultVisible) !== 'undefined' && !defaultVisible) {
            hiddenClasses += " hidden";
            defaultHidden = true;
        }

        visible = visible.expandDefault();

        visible.forEach((tier, value) => {
            if (defaultHidden) {
                if (value) {
                    hiddenClasses += ` visible-${tier}-block`;
                }
            } else {
                if (!value) {
                    hiddenClasses += ` hidden-${tier}`;
                }
            }
        });

        wrapperClass += hiddenClasses;

        const undecorated = renderContext.render();
        return (
            <div key={undecorated.key} className={wrapperClass}>
                {undecorated}
            </div>
        );
    }

}

export default FlowZoneTemplate
