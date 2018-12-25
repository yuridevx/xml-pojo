export abstract class AbstractDigger {
  readonly deepPart = 'digger'

  abstract id: string

  abstract getOn(target: any): any

  abstract setOn(target: any, value: any): void

  notifySet(target: any, value: any) {

  }
}
