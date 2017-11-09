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

    getBlockGroup(block) {
        const row = block.getLayoutOptions()["row"];
        return row ? "row-" + row : undefined;
    }

    decorateZone(renderContext, zone) {

        if (DefaultLayoutTemplate.getZoneLayoutType(zone) === DefaultLayoutTemplate.constants.LAYOUT_HIDDEN) {
            return (null);
        }

        const undecorated = renderContext.render(this);

        // Wrap in to .zone-wrapper.container:
        return (
            <div key={undecorated.key} className={`zone-wrapper zone-wrapper-${zone.getZoneId()} ${this.getZoneContainerClassName(zone.getZoneId())}`}>
                {undecorated}
            </div>
        );
    }



    // sortGroupBlocks(group, blocks) {
    //     return blocks;
    // }

    decorateBlockGroup(renderContext, group, blocks) {

        console.log("decorateBlockGroup " + group);


        let renderColumns;
        const zone = renderContext.getZone();

        const layoutType = DefaultLayoutTemplate.getZoneLayoutType(zone);

        if (layoutType === DefaultLayoutTemplate.constants.LAYOUT_HIDDEN) {
            return (null);
        }

        if (layoutType === DefaultLayoutTemplate.constants.LAYOUT_GRID) {


            // This is for grid layout:


            const layoutOptions = zone.getLayoutOptions();

            const blockCount = blocks.length;

            const maxColumnCount = 12;
            const maxColumnOffset = maxColumnCount - 1;

            let columns = layoutOptions.gridColumns;
            console.log("columns: " + columns);

            let columnCount;

            let fixedWidthGrid;
            if (Array.isArray(columns)) {
                // Predefined grid, array of column spans
                columnCount = columns.length;
                fixedWidthGrid = false;
            } else {
                columnCount = columns;
                fixedWidthGrid = true;
            }


            let defaultColumnOffsetType;
            let defaultColumnOffset = layoutOptions.defaultColumnOffset;
            if (typeof(defaultColumnOffset) !== 'undefined') {
                if (defaultColumnOffset | 0 == defaultColumnOffset) {
                    defaultColumnOffsetType = "#";
                } else {
                    defaultColumnOffsetType = defaultColumnOffset;
                    defaultColumnOffset = undefined;
                }
            }

            if (fixedWidthGrid) {

                const validColumnCounts = [1, 2, 3, 4, 6, 12];


                if (columnCount === 'auto') {
                    columnCount = undefined;
                }


                if (!columnCount || validColumnCounts.indexOf(columnCount) < 0) {

                    let greatestOffs = 0;
                    // Get next possible value
                    for (let i = 0; i < blockCount && greatestOffs < maxColumnOffset; i++) {
                        const layoutOptions = blocks[i].getLayoutOptions();
                        if (layoutOptions.columnOffset > greatestOffs) {
                            greatestOffs = layoutOptions.columnOffset;
                        }
                    }
                    let calculatedColumnCount = maxColumnCount;
                    for (let i = 0; i < validColumnCounts.length; i++) {
                        if (greatestOffs <= validColumnCounts[i]) {
                            calculatedColumnCount = validColumnCounts[i];
                            break;
                        }
                    }

                    if (columnCount != null && typeof(columnCount) !== 'undefined') {
                        console.error(`Warning: Invalid column count for zone '${zone.getZoneId()}': ${columnCount}; using calculated value ${calculatedColumnCount}. Valid column counts are: ${validColumnCounts} or 'auto'`);
                    }
                    columnCount = calculatedColumnCount;
                }
            }

            // ==== Insert blocks to columns:

            const columnBlocks = {}; // column index (i.e. offset) to array of container blocks
            let prevOffset = -1;

            for (let i = 0; i < blockCount; i++) {
                const layoutOptions = blocks[i].getLayoutOptions();

                // Fix column:
                // - If not specified, depends on 'defaultColumnOffset' zone layout option:
                //   - 'prev': add to same column with the previous block
                //   - 'last': add to last column
                //   - 'first': add to first column
                //   - (number) add to specified column
                // - If less than one, add to first column
                // - If greater than column count, add to last column
                let offs = layoutOptions.columnOffset || defaultColumnOffset;

                if (offs == null || typeof(offs) === 'undefined') {
                    switch (defaultColumnOffsetType) {
                        case 'last':
                            offs = columnCount - 1;
                            break;
                        case 'first':
                            offs = 0;
                            break;
                        case 'next':
                            offs = prevOffset + 1;
                            break;
                        case 'prev':
                        default:
                            offs = prevOffset < 0 ? 0 : prevOffset;
                    }
                } else if (offs < 0) {
                    offs = 0;
                } else if (offs > (columnCount - 1)) {
                    offs = columnCount - 1;
                }

                prevOffset = offs;

                if (columnBlocks[offs] == undefined) {
                    columnBlocks[offs] = [];
                }

                columnBlocks[offs].push(blocks[i]);


            }

            // ===== RENDER COLUMNS

            const columnSpans = [];
            if (fixedWidthGrid) {
                const columnSpan = (maxColumnCount / columnCount)|0;
                for (let i = 0; i < columnCount; i++) {
                    columnSpans.push(columnSpan);
                }
            } else {
                for (let i = 0; i < columnCount; i++) {
                    columnSpans.push(columns[i] || 1);
                }
            }

            renderColumns = () => {


                const cols = [];

                const renderColumnBlocks = (blocks) => {

                    return renderContext.render(blocks);
                };
                for (let i = 0; i < columnCount; i++) {
                    const blocks = columnBlocks[i];
                    const classNames = "block-wrapper Xblock-dropzone-wrapper col-md-" + columnSpans[i];

                    cols.push(
                        <div key={"col-" + i} className={classNames}>
                            {blocks && renderColumnBlocks(blocks)}
                        </div>
                    );
                }
                return cols;
            };
        } else {
            renderColumns = renderContext.render;
        }

        // Add ".row" wrapper
        return (
            <div key={"row-" + group} className={`row row-${group}`}>
                {renderColumns()}
            </div>
        );
    }




    decorateBlock(renderContext, blockSpec) {
        // console.log("DefaultLayoutTemplate.decorateBlock; opts=" + JSON.stringify(zone.getLayoutOptions()));

        const zone = renderContext.getZone();
        const layoutType = DefaultLayoutTemplate.getZoneLayoutType(zone);

        switch (layoutType) {
            case DefaultLayoutTemplate.constants.LAYOUT_HIDDEN:
                return (null);
            case DefaultLayoutTemplate.constants.LAYOUT_FLOW:
                return this.decorateBlockFlow(renderContext, blockSpec);
            case DefaultLayoutTemplate.constants.LAYOUT_GRID:
                return this.decorateBlockGrid(renderContext, blockSpec);
            default:
                console.error(`Warning: unsupported layoutType for zone ${zone.getZoneId()}: ${layoutType}`);
                return renderContext.render();
        }
    }

    decorateBlockFlow(renderContext, blockSpec) {

        const columnCount = 12;
        const maxColumnOffset = columnCount - 1;
        const defaultSpan = maxColumnOffset + 1;

        var span = defaultSpan;
        var offset = 0;

        if (blockSpec.layoutOptions) {
            span = blockSpec.layoutOptions.columnSpan || defaultSpan;
            offset = blockSpec.layoutOptions.columnOffset || 0;
        }


        if (span < 1) {
            span = 1;
        }
        else if (span > columnCount) {
            span = columnCount;
        }

        if (offset < 0) {
            offset = 0;
        } else if (offset > maxColumnOffset) {
            offset = maxColumnOffset;
        }


        //const span = 4;//blockSpec.layout.span;


        // Wrap inside a .block-wrapper element:

        const spanClass = `block-wrapper col-sm-${span} col-md-${span} col-md-offset-${offset}`;

        const undecorated = renderContext.render();
        return (
            <div key={undecorated.key} className={spanClass}>
                {undecorated}
            </div>
        );
    }
    decorateBlockGrid(renderContext, blockSpec) {
        // Return undecorated
       return renderContext.render();
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

DefaultLayoutTemplate.getZoneLayoutType = function(zone) {
    let val = zone.getLayoutOptions()["layoutType"] || DefaultLayoutTemplate.constants.LAYOUT_DEFAULT;
    if (val == "default") {
        val = DefaultLayoutTemplate.constants.LAYOUT_DEFAULT;
    }
    return val;
};

DefaultLayoutTemplate.constants = {
    LAYOUT_HIDDEN: "hidden",
    LAYOUT_FLOW: "flow",
    LAYOUT_GRID: "grid",
    LAYOUT_DEFAULT: "flow"
};


export default DefaultLayoutTemplate
