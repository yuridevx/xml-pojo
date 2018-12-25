export abstract class AbstractFormat {
  public readonly deepPart = 'format'

  abstract id: string

  abstract parse(value: any): any

  abstract serialize(value: any): any

  abstract ensureParsed(value): boolean
}
