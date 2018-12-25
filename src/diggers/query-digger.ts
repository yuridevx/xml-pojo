import {AbstractDigger} from './abstract-digger'
// import {ERROR_DATA_CORRUPT} from '../../../error-codes.constants'

export abstract class QueryDigger extends AbstractDigger {
  id: string

  constructor(protected selector: string) {
    super()
    this.id = `${this.lang()}(${this.selector})`
  }

  abstract lang(): string

  abstract query(target: Document): Element | null

  getOn(target: Document) {
    return this.safeQuery(target)
  }

  setOn(target: Document, value: any) {
    const element = this.safeQuery(target)

    if (element === value) {
      return
    }

    element.parentElement!.replaceChild(value, element)
  }


  notifySet(target: any, value: any) {
    if (target instanceof Document && value instanceof Element) {
      this.setOn(target, value)
    }
  }

  safeQuery(target: any) {
    const el = this.query(target)

    if (!el) {
      const errorStr = `Can't find ${this.selector}`
      console.error(errorStr, {
        target,
        selector: this.selector
      })
      throw new Error(errorStr)
    }

    return el
  }
}
