
import LayoutRepository from './LayoutRepository'
import YAML from 'yamljs'
import test from './mockLayout.yml'

class MockLayoutRepository extends LayoutRepository {

    doGetLayout(layoutId) {
        const layouts = YAML.load(test)
        return layouts[layoutId]

    }
}

export default MockLayoutRepository

