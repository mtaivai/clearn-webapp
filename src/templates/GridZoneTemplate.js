import React from 'react'

import {TieredLayoutConfiguration} from "../components/LayoutTemplate";

// TODO this is already deprecated; use the 'flow' template instead!
class GridZoneTemplate {

    decorateBlockGroup(renderContext, group, blocks) {


        let renderColumns;
        const zone = renderContext.getZone();


        const layoutOptions = zone.getLayoutOptions();

        const blockCount = blocks.length;

        const maxColumnCount = 12;
        const maxColumnOffset = maxColumnCount - 1;

        let tierColumns = new TieredLayoutConfiguration(layoutOptions.gridColumns).expandDefault();

        console.log("columns of zone " + zone.getZoneId() + ": " + JSON.stringify(tierColumns));

        // if (typeof(columns) === 'object') {
        //   // Map deviceSize to 'columns'
        //
        // }

        //
        // xs: 1   col-xs-12    hidden-xs   hidden-xs   hidden-xs
        // md: 3   col-md-4     col-md-4    col-md-4    hidden-md
        // lg: 4   col-lg-3     col-lg-3    col-lg-3    col-lg-3

        tierColumns.forEach((tier, columns) => {

        });
        let columns = tierColumns['md'];

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
            if (defaultColumnOffset | 0 === defaultColumnOffset) {
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

            if (columnBlocks[offs] === undefined) {
                columnBlocks[offs] = [];
            }

            columnBlocks[offs].push(blocks[i]);


        }

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


        // ******* FOR SHARED *******

        // Add ".row" wrapper
        return (
            <div key={"row-" + group} className={`row row-${group}`}>
                {renderColumns()}
            </div>
        );
    }



    decorateBlock(renderContext, blockSpec) {
        // Return undecorated
        return renderContext.render();
    }

}

export default GridZoneTemplate