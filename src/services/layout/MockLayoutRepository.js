
import LayoutRepository from './LayoutRepository'
import YAML from 'yamljs'
import test from './mockLayout.yml'

import ObjectUtils from '../../util/ObjectUtils'

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

        console.log("doUpdateBlock: " + JSON.stringify(updateRequests));

        const existing = this.layouts[layoutId];
        if (!existing) {
            throw new Error("No such layout exists: " + layoutId);
        }

        var block = null;
        for (var i = 0; i < existing.blocks.length; i++) {
            if (existing.blocks[i].id === blockId) {
                block = existing.blocks[i];
                break;
            }
        }
        if (!block) {
            throw new Error(`No such block exists in layout '${layoutId}': ${blockId}`);
        }

        var modified = false;
        updateRequests.forEach((req) => {

            const prevValue = ObjectUtils.getProperty(block, req.property);
            if (req.value !== prevValue) {
                console.log("SETVALUE1: " + req.property + " = " + req.value);
                console.log("block: " + JSON.stringify(block));
                ObjectUtils.setProperty(block, req.property, req.value);
                console.log("SETVALUE2: " + req.property + " = " + req.value);
                modified = true;
            }

        });

        return {
            updated: modified,
            updatedBlock: block
        }
    }




}



export default MockLayoutRepository

