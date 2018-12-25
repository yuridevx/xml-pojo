import {AbstractFormat} from './abstract-format'

export class IdentityFormat extends AbstractFormat {
  public readonly id = 'identity'

  parse(value: any) {
    return value
  }

  serialize(value: any): any {
    return value
  }

  ensureParsed(value: any): boolean {
    return true
  }
}
