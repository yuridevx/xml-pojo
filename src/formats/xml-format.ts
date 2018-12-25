import {xmlEntities, parser, serializer} from '../utils/xml-utils'
import {AbstractFormat} from './abstract-format'

export class XmlFormat extends AbstractFormat {
  public readonly id: string

  constructor(private escaped: boolean) {
    super()
    this.id = 'xml' + (escaped ? '-escaped' : '-plain')
  }

  // TODO Rewrite as a strict in -> out
  parse(value: any) {
    let candidate = value
    const type = typeof candidate

    if (type === 'string') {

      if (this.escaped) {
        candidate = xmlEntities.decode(candidate)
      }

      return parser.parseFromString(candidate, 'application/xml')
    } else if (type === 'object' && type !== null) {

      if (candidate instanceof Element) {
        candidate = candidate.innerHTML

        if (this.escaped) {
          candidate = xmlEntities.decode(candidate)
        }

        return parser.parseFromString(candidate, 'application/xml')
      }

      return value
    }

    const errStr = `Unsupported input to format '${this.id}'`
    console.error(errStr, {
      candidate
    })
    throw new Error(errStr)
  }

  serialize(value): any {
    let raw = serializer.serializeToString(value)

    if (this.escaped) {
      raw = xmlEntities.encode(raw)
    }

    return raw
  }

  ensureParsed(value): boolean {
    return !!(value && value.ownerDocument)
  }
}
