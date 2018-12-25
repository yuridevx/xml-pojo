import {AbstractDigger} from './diggers/abstract-digger'
import {AbstractFormat} from './formats/abstract-format'

export interface ICover2Transform {
  get(value: any): any,

  set(current: any, toSet: any, setValue: (value: any) => void): any
}

export interface ICover2Metadata {
  fields: {
    [index: string]: ICover2Field
  }

  associates: {
    [index: string]: ICover2Associate
  }
}

export interface ICover2Field {
  path: ICover2Path
  mock?: any
  transform?: ICover2Transform

  type?: any
}

export interface ICover2Associate {
  type: any
}

export type ICover2Path = Array<[AbstractDigger, AbstractFormat]>

export type ICover2RawPath = Array<string | AbstractDigger | AbstractFormat>
