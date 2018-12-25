import {QueryDigger} from './query-digger'

export class XPathDigger extends QueryDigger {

  lang(): string {
    return 'xpath'
  }

  query(target: Document): Element {
    const xpath = target.evaluate(this.selector, target, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null)
    return <Element> xpath.singleNodeValue
  }
}
