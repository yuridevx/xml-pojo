import {getProp, setProp} from './props'

export class MetadataAccessor<T extends object> {
  constructor(protected metadataKey: string) {

  }

  set(object: any, data: T) {
    const meta = this.getOrCreateContainer(object)

    meta[this.metadataKey] = data
  }

  get(object: any): T {
    const meta = this.getOrCreateContainer(object)

    if (!meta.hasOwnProperty(this.metadataKey)) {
      console.error('There is no such metadata', {
        meta,
        metadataKey: this.metadataKey
      })
      throw new Error(`There is no such metadata`)
    }

    return meta[this.metadataKey]
  }

  has(object: any) {
    return Boolean(object && object['__metadata__'] && object['__metadata__'][this.metadataKey])
  }

  hasInProto(object: any) {
    return Boolean(object && object.prototype && this.has(object.prototype))
  }

  setDeep(object: any, path: Array<string>, data: any) {
    const meta = this.getOrCreateContainer(object)

    setProp(meta, [this.metadataKey].concat(path), data)
  }

  getDeep(object: any, path: any) {
    const meta = this.get(object)

    return getProp(meta, [this.metadataKey].concat(path))
  }

  protected getOrCreateContainer(object: any) {
    let metadata

    if (!('__metadata__' in object)) {
      metadata = {}

      Object.defineProperty(object, '__metadata__', {
        value: metadata,
        writable: false,
        enumerable: false,
        configurable: true
      })

    } else {
      metadata = object['__metadata__']
    }

    return metadata
  }

}
