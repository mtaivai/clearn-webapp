
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

    /** Layout properties such as "targetZone", "span", etc. */
    layout;

    /** Type-specific configuration properties */
    configuration;

    constructor(id, type, layout, configuration) {
        this.id = id;
        this.type = type;
        this.layout = layout;
        this.configuration = configuration;
    }

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

    updateLayout(layoutId, updateRequests) {
        return new Promise((resolve, reject) => {

            try {
                var l = this.doUpdateLayout(layoutId, updateRequests);
                resolve(l);
            } catch (e) {
                reject(`Failed to update layout with id ${layoutId}: ` + e);
            }
        });

    }

    updateBlock(layoutId, blockId, updateRequests) {
        return new Promise((resolve, reject) => {

            try {
                var l = this.doUpdateBlock(layoutId, blockId, updateRequests);
                resolve(l);
            } catch (e) {
                reject(`Failed to update block with id ${layoutId}: ` + e);
            }
        });

    }


    doUpdateLayout(layoutId, updateRequests) {
        throw new Error("doUpdateLayout() is not implemented for abstract LayoutRepository");
    }
    doUpdateBlock(layoutId, blockId, updateRequests) {
        throw new Error("doUpdateBlock() is not implemented for abstract LayoutRepository");
    }

    doGetLayout(layoutId) {
        throw new Error("doGetLayout() is not implemented for abstract LayoutRepository");
    }
}

export {Layout, LayoutBlock, LayoutRepository}
export default LayoutRepository

