import {ICover2Transform} from '../interfaces'

export class ElementTextContent implements ICover2Transform {
  get(value: Element): any {
    return value.textContent
  }

  set(current: Element, toSet: any, setValue: (value: any) => void): any {
    current.textContent = toSet
  }
}
