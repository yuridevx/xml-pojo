import {ICover2Transform} from '../interfaces'

export class ElementString implements ICover2Transform {
  get(value: Element): any {
    return value.innerHTML
  }


  set(current: Element, toSet: any, setValue: (value: any) => void): any {
    current.innerHTML = toSet
  }
}
