import {ICover2Hierarchy} from './interfaces'
import {ICover2Field} from '../interfaces'

export class FieldProcessor {

  constructor(protected hierarchy: ICover2Hierarchy) {
  }

  get(field: ICover2Field) {
    try {
      if (field.mock) {
        return field.mock
      }

      let value = this.hierarchy.getAt(field.path)

      if (field.transform) {
        value = field.transform.get(value)
      }

      return value
    } catch (e) {
      // TODO Mark error as xml-pojo related
      throw e
    }
  }

  set(field: ICover2Field, value: any) {
    try {
      if (field.mock) {
        field.mock = value
        return
      }

      const setValue = (transformedValue) => {
        this.hierarchy.setAt(field.path, transformedValue)
      }

      if (field.transform) {
        const current = this.get(field)
        field.transform.set(current, value, setValue)
      } else {
        setValue(value)
      }
    } catch (e) {
      // TODO Mark error as xml-pojo related
      throw e
    }
  }
}
