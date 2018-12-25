import {ICover2Hierarchy} from './interfaces'
import {RootHierarchy} from './root-hierarchy'

export class AssociateMap {
  children: {
    [index: string]: AssociateMap
  } = {}

  protected hierarchy: RootHierarchy

  constructor(hierarchy: ICover2Hierarchy) {
    if (!hierarchy.isRoot()) {
      const errorStr = `Associate map have to be created with RootHierarchy`
      console.error(errorStr, {
        hierarchy
      })
      throw new Error(errorStr)
    }

    this.hierarchy = hierarchy as RootHierarchy
  }

  addChildAssociate(name: string, map: AssociateMap) {
    this.children[name] = map
  }

  setAssociateRoot(path: string[], root: any) {
    if (path.length === 0) {
      this.hierarchy.setRoot(root)
      return
    }

    const newPath = path.concat()
    const key = newPath.shift() as string

    this.children[key].setAssociateRoot(newPath, root)
  }

  sync() {
    Object.keys(this.children).forEach(key => {
      this.children[key].sync()
    })

    this.hierarchy.syncValues()
  }

  getAssociateRoot(path: string[]) {
    if (path.length === 0) {
      return this.hierarchy.getRoot()
    }

    const newPath = path.concat()
    const key = newPath.shift() as string

    return this.children[key].getAssociateRoot(newPath)
  }
}
