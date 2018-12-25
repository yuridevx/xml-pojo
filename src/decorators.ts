import {ICover2RawPath, ICover2Transform} from './interfaces'
import {getFieldType, normalizeCoverPath} from './utils'
import {CssDigger} from './diggers/css-digger'
import {XPathDigger} from './diggers/xpath-digger'
import {XmlFormat} from './formats/xml-format'
import {JsonFormat} from './formats/json-format'
import {ClickDigger} from './diggers/click-digger'
import {cover2Meta} from './metadata'

export function Field(...args: ICover2RawPath) {
  return function (prototype: any, propertyKey: string) {
    const type = getFieldType(prototype, propertyKey)

    if (args.length == 0) {
      args = [propertyKey]
    }

    const path = normalizeCoverPath(args)

    cover2Meta.setDeep(prototype, ['fields', propertyKey, 'path'], path)
    cover2Meta.setDeep(prototype, ['fields', propertyKey, 'type'], type)
  }
}

export function Root() {
  return function (prototype: any, propertyKey: string) {
    const type = getFieldType(prototype, propertyKey)

    cover2Meta.setDeep(prototype, ['fields', propertyKey, 'path'], [])
    cover2Meta.setDeep(prototype, ['fields', propertyKey, 'type'], type)
  }
}


export function Associate() {
  return function (prototype: any, propertyKey: string) {
    const type = getFieldType(prototype, propertyKey)

    cover2Meta.setDeep(prototype, ['associates', propertyKey, 'type'], type)
  }
}

export function Transform(transform: ICover2Transform) {
  return function (prototype: any, propertyKey: string) {
    cover2Meta.setDeep(prototype, ['fields', propertyKey, 'transform'], transform)
  }
}

export function Mock(value: any) {
  return function (prototype: any, fieldName: string) {
    cover2Meta.setDeep(prototype, ['fields', fieldName, 'mock'], value)
  }
}

export function css(selector: string) {
  return new CssDigger(selector)
}

export function xpath(selector: string) {
  return new XPathDigger(selector)
}

export function xml(encoded: boolean = false) {
  return new XmlFormat(encoded)
}

export function json() {
  return new JsonFormat()
}

export function click(objectType: string, name: string) {
  return new ClickDigger(objectType, name)
}
