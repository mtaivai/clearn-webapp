
import {ZoneTemplate} from '../components/LayoutTemplate'


class HiddenZoneTemplate extends ZoneTemplate {


    decorateBlockGroup(renderContext, group, blocks) {
        return (null);
    }


    decorateBlock(renderContext, blockSpec) {
        return (null);
    }
}

export default HiddenZoneTemplate;
