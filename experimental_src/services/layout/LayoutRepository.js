
/**
 *
 * Layout defines a page.
 */
class Layout {
    /** Unique identifier of the layout */
    id;

    /** An array of LayoutBlock blocks */
    blocks;

    title;


    constructor(id, blocks) {
        this.id = id;
        this.blocks = blocks;
        this.title = this.id;

    }
}

/**
 * LayoutBlock defines a single block in layout.
 */
class LayoutBlock {
    /** Type of the block, e.g. "ContentBlock" */
    type;

    /** Unique identifier of the block */
    id;

    /** Title */
    title;

    /** Layout properties such as "targetZone", "span", etc. */
    layoutOptions;

    /** Type-specific configuration properties */
    configuration;


}

class LayoutRepository {

    getEmptyLayout() {
        return new Layout(null, "EmptyLayout");
    }

    getLayout(layoutId)  {
        return new Promise((resolve, reject) => {
            if (layoutId == null) {
                resolve(this.getEmptyLayout());
            } else {
                try {
                    var l = this.doGetLayout(layoutId);
                    resolve(l);
                } catch (e) {
                    reject(`Failed to get layout with id ${layoutId}: ` + e);
                }
            }
        });
    }

    // updateLayout(layoutId, updateRequests) {
    //     return new Promise((resolve, reject) => {
    //
    //         try {
    //             var l = this.doUpdateLayout(layoutId, RepositoryUtils.toUpdateRequests(updateRequests));
    //             resolve(l);
    //         } catch (e) {
    //             reject(`Failed to update layout with id ${layoutId}: ` + e);
    //         }
    //     });
    //
    // }

    /**
     * Request update of a layout block configuration.
     *
     * <p>The updateRequests parameter is either an array of property update requests, or a block configuration
     * object. If latter, update request objects are generated from all its properties. </p>
     *
     * <p>An example of property update request object:</p>
     * <pre>
     * [
     *   {
     *     property: "title",
     *     value: "New Title"
     *   },
     *   {
     *     property: "layout.span",
     *     value: 6
     *   }
     * ]
     * </pre>
     *
     * @param layoutId layout id
     * @param blockId id of the block in the layout
     * @param updateRequests an array of update requests (see above), or a block configuration object
     * @returns {Promise} with following parameters: updated: boolean, updatedBlock: object
     */
    updateBlock(layoutId, blockId, updateRequests) {
        return new Promise((resolve, reject) => {

            try {
                const result = this.doUpdateBlock(layoutId, blockId, RepositoryUtils.toUpdateRequests(updateRequests));
                if (result.error) {
                    reject(result.error);
                } else {
                    resolve(result.updated, result.updatedBlock);
                }

            } catch (e) {
                reject(`Failed to update block with id ${layoutId}: ` + e, e);
            }
        });

    }




    doUpdateLayout(layoutId, updateRequests) {
        throw new Error("doUpdateLayout() is not implemented for abstract LayoutRepository");
    }


    /**
     * Return object:
     * {
     *     updated: boolean,        // was updated ?
     *     updatedBlock: object,    // new block configuration (after update)
     *     error: object            // error message (in case of error)
     * }
     * @param layoutId
     * @param blockId
     * @param updateRequests
     */
    doUpdateBlock(layoutId, blockId, updateRequests) {
        throw new Error("doUpdateBlock() is not implemented for abstract LayoutRepository");
    }

    doGetLayout(layoutId) {
        throw new Error("doGetLayout() is not implemented for abstract LayoutRepository");
    }
}

function RepositoryUtils() {}



RepositoryUtils.toUpdateRequests = function (obj, previous) {
    if (Array.isArray(obj)) {
        return obj;
    }
    var _toUpdateRequests = function (state) {
        const obj = state.obj;
        const prefix = state.prefix;
        const updateRequests = state.updateRequests;

        if (typeof(obj) === 'object') {
            for (let key in obj) {
                if (!obj.hasOwnProperty(key)) {
                    continue;
                }
                const val = obj[key];
                if (typeof(val) === 'object') {
                    if (Array.isArray(val)) {
                        // console.log(" array " + val.length);
                        for (let i = 0; i < val.length; i++) {
                            _toUpdateRequests({
                                obj: val[i],
                                prefix: key + "[" + i + "]",
                                updateRequests: updateRequests
                            });
                        }
                    } else {
                        _toUpdateRequests({
                            obj: val,
                            prefix: key + ".",
                            updateRequests: updateRequests
                        });
                    }
                } else {
                    var prop;
                    if (prefix && prefix.length > 0) {
                        if (prefix.endsWith(".")) {
                            prop = prefix + key;
                        } else {
                            prop = prefix + "." + key;
                        }
                    } else {
                        prop = key;
                    }
                    updateRequests.push({
                        property: prop,
                        value: val
                    });
                }
            }
        } else {
            updateRequests.push({
                property: prefix,
                value: obj
            });
        }
    };

    // Create update requests
    const updateRequests = [];
    _toUpdateRequests({obj: obj, previous: previous, updateRequests: updateRequests});
    return updateRequests;

}


export {Layout, LayoutBlock, LayoutRepository}
export default LayoutRepository

