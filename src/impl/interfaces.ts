import {ICover2Metadata, ICover2Path} from '../interfaces'
import {AssociateMap} from './associate-map'
import {FieldProcessor} from './field-processor'

export interface ICover2Hierarchy {
  setAt(path: ICover2Path, value: any): void

  getAt(path: ICover2Path): any

  delegateHierarchy(path: ICover2Path): ICover2Hierarchy

  isRoot(): boolean
}

export interface ICover2Context {
  meta: ICover2Metadata,
  hierarchy: ICover2Hierarchy,
  processor: FieldProcessor,
  instance: any
  associates?: AssociateMap,
}
