
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
    doGetLayout(layoutId) {
        throw new Error("doGetLayout() is not implemented for abstract LayoutRepository");
    }
}

export {Layout, LayoutBlock, LayoutRepository}
export default LayoutRepository

