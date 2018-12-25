import {RootHierarchy} from './root-hierarchy'
import {ICover2Path} from '../interfaces'
import {ICover2Hierarchy} from './interfaces'

export class DelegateHierarchy implements ICover2Hierarchy {
  isRoot(): boolean {
    return false
  }

  constructor(private parent: RootHierarchy, private path: ICover2Path) {
  }

  setAt(path: ICover2Path, value: any) {
    return this.parent.setAt(this.path.concat(path), value)
  }

  getAt(path: ICover2Path) {
    return this.parent.getAt(this.path.concat(path))
  }

  delegateHierarchy(path: ICover2Path): ICover2Hierarchy {
    return this.parent.delegateHierarchy(this.path.concat(path))
  }
}
