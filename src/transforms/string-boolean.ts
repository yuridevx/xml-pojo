import {ICover2Transform} from '../interfaces'

export class StringBoolean implements ICover2Transform {

  get(value: string): any {
    return value === 'TRUE'
  }

  set(current: any, toSet: any, setValue: (value: any) => void): any {
    setValue(String(toSet).toUpperCase())
  }
}
