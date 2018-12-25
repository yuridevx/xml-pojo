import {ICover2Transform} from '../interfaces'

export class ElementBoolean implements ICover2Transform {
  get(value: Element): any {
    if (!value) {
      return void 0
    }

    return value.innerHTML === '1'
  }


  set(current: Element, toSet: any, setValue: (value: any) => void): any {
    current.innerHTML = toSet ? '1' : '0'
  }
}
