import {AbstractFormat} from './abstract-format'

export class JsonFormat extends AbstractFormat {
  public readonly id = 'json'

  parse(value: any) {
    const type = typeof value

    if (type === 'string') {
      return JSON.parse(value)
    } else if (type === 'object') {
      return value
    }

    const errorStr = `Unsupported input to format '${this.id}'`
    console.error(errorStr, {
      value
    })
    throw new Error(errorStr)
  }

  serialize(value: any): any {
    return JSON.stringify(value)
  }

  ensureParsed(value: any): boolean {
    return typeof value === 'object'
  }
}
