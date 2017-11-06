
import LayoutRepository from './LayoutRepository'
import YAML from 'yamljs'
import test from './mockLayout.yml'

class MockLayoutRepository extends LayoutRepository {

    constructor() {
        super();
        this.layouts = null;
    }

    _fetchLayouts() {
        if (this.layouts == null) {
            this.layouts = YAML.load(test);
        }
        return this.layouts;
    }

    doGetLayout(layoutId) {
        this._fetchLayouts();

        for (var key in this.layouts) {
            this.layouts[key].id = key;
        }
        return this.layouts[layoutId]

    }

    doUpdateLayout(layoutId, updateRequests) {
        this._fetchLayouts();

        const existing = this.layouts[layoutId];
        if (!existing) {
            throw new Error("No such layout exists: " + layoutId);
        }


        updateRequests.forEach((req) => {
            this._assign(existing, req.property, req.value);
        });

        return existing;
    }

    doUpdateBlock(layoutId, blockId, updateRequests) {
        this._fetchLayouts();

        const existing = this.layouts[layoutId];
        if (!existing) {
            throw new Error("No such layout exists: " + layoutId);
        }

        var block = null;
        for (var i = 0; i < existing.blocks.length; i++) {
            if (existing.blocks[i].id == blockId) {
                block = existing.blocks[i];
                break;
            }
        }
        if (!block) {
            throw new Error(`No such block exists in layout '${layoutId}': ${blockId}`);
        }

        updateRequests.forEach((req) => {

            this._assign(block, req.property, req.value);
        });

        return block;

    }


    _assign(obj, prop, value) {
        if (typeof prop === "string")
            prop = prop.split(".");

        if (prop.length > 1) {
            var e = prop.shift();
            this._assign(obj[e] =
                    Object.prototype.toString.call(obj[e]) === "[object Object]"
                        ? obj[e]
                        : {},
                prop,
                value);
        } else
            obj[prop[0]] = value;
    }
}

export default MockLayoutRepository

