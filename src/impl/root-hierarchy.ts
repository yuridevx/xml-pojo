import {AbstractDigger} from '../diggers/abstract-digger'
import {AbstractFormat} from '../formats/abstract-format'
import {ICover2Hierarchy} from './interfaces'
import {ICover2Path} from '../interfaces'
import {DelegateHierarchy} from './delegate-hierarchy'
import {IdentityFormat} from '../formats/identity-format'

interface IFormatItem {
  digger: AbstractDigger,
  format: AbstractFormat,
  digged: any,
  parsed: any,
  children: IDiggedCollection
}

interface IDiggedCollection {
  [index: string]: IFormatItem
}

export class RootHierarchy implements ICover2Hierarchy {
  private rootItem: IFormatItem

  getRoot() {
    return this.rootItem.parsed
  }

  setRoot(root: any) {

    if (this.rootItem) {
      const errorStr = `Root can be set only once`
      console.error(errorStr, this)
      throw new Error(errorStr)
    }

    this.rootItem = {
      digger: null as any, // TODO Fix typings
      format: new IdentityFormat(),
      digged: null,
      parsed: root,
      children: {}
    }
  }

  delegateHierarchy(path: ICover2Path): ICover2Hierarchy {
    return new DelegateHierarchy(this, path)
  }

  syncValues() {
    function _rCacheSync(item: IFormatItem) {
      const children = Object.keys(item.children)

      for (const child of children) {
        const childItem = item.children[child]

        _rCacheSync(childItem)

        childItem.digger.setOn(item.parsed, childItem.digged)
      }

      item.digged = item.format.serialize(item.parsed)
    }

    _rCacheSync(this.rootItem)
  }

  private forceGetItems(path: ICover2Path): IFormatItem[] {
    let formatItem: IFormatItem = this.rootItem
    let parentFormatItem: IFormatItem

    const items = [this.rootItem]

    for (const [digger, format] of path) {

      parentFormatItem = formatItem
      formatItem = parentFormatItem.children[digger.id]

      if (formatItem) {
        if (formatItem.format.id !== format.id) {
          const errorStr = `Wrong item format: got '${formatItem.format.id}', expected '${format.id}'`
          console.error(errorStr, {
            formatItem,
            format
          })
          throw new Error(errorStr)
        }
      } else {
        const digged = digger.getOn(parentFormatItem.parsed)
        const parsed = format.parse(digged)

        formatItem = {
          digger,
          format,
          digged,
          parsed,
          children: {}
        }

        parentFormatItem.children[digger.id] = formatItem

      }
      items.push(formatItem)
    }

    return items
  }

  setAt(path: ICover2Path, value: any) {
    const items = this.forceGetItems(path)

    let item = items.pop() as IFormatItem

    item.parsed = value

    while (items.length) {
      const parent = items.pop() as IFormatItem

      item.digger.notifySet(parent.parsed, item.parsed)

      item = parent
    }
  }

  getAt(path: ICover2Path) {
    const item = this.forceGetItems(path).pop() as IFormatItem

    return item.parsed
  }

  isRoot() {
    return true
  }
}
