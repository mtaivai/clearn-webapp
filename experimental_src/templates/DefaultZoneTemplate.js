
import ZoneTemplate from '../components/LayoutTemplate'

class DefaultZoneTemplate extends ZoneTemplate {

    decorateBlockGroup(renderContext, group, blocks) {
        return renderContext.render();
    }


    decorateBlock(renderContext, blockSpec) {
        return renderContext.render();
    }
}

export default DefaultZoneTemplate;