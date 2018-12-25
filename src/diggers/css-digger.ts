import {QueryDigger} from './query-digger'

export class CssDigger extends QueryDigger {

  lang(): string {
    return 'css'
  }

  query(target: Document): Element | null {
    return target.querySelector(this.selector)
  }
}
