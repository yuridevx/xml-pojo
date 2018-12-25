import {ICover2Context} from './interfaces'
import {RootHierarchy} from './root-hierarchy'

export class Cover2Handler {
  constructor(protected context: ICover2Context) {
  }

  get instance() {
    return this.context.instance
  }

  setRoot(root: any) {
    (<RootHierarchy>this.context.hierarchy).setRoot(root)
  }

  getRoot() {
    return (<RootHierarchy>this.context.hierarchy).getRoot()
  }

  setAssociateRoot(path: string [], root) {
    return this.context.associates!.setAssociateRoot(path, root)
  }

  getAssociateRoot(path: string []) {
    return this.context.associates!.getAssociateRoot(path)
  }

  sync() {
    if (this.context.associates) {
      this.context.associates.sync()
    } else {
      (<RootHierarchy>this.context.hierarchy).syncValues()
    }
  }
}
