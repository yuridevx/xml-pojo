import {AbstractDigger} from './abstract-digger'

// import {ERROR_DATA_CORRUPT} from '../../../error-codes.constants'

export class ClickDigger extends AbstractDigger {
  id: string

  constructor(protected objectType: string, protected name: string) {
    super()
    this.id = `click-${this.objectType}(${name})`
  }

  getOn(target: any) {
    const index = this.findNameIndex(target)

    return target[index]
  }

  setOn(target: any, value: any) {
    target[this.findNameIndex(target)] = value
  }

  protected findNameIndex(target: Array<any>) {
    const index = target.findIndex(obj => {
      return (obj.Name === this.name) && (obj['@objectType'] === this.objectType)
    })

    if (index < 0) {
      console.error('`There should be an object with Name === ${this.name} and @objectType === ${this.objectType}`', {
        name: this.name,
        objectType: this.objectType,
        target
      })
      throw new Error(`There should be an object with Name === ${this.name} and @objectType === ${this.objectType}`)
    }

    return index
  }
}
