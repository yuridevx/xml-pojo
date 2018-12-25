import {css, Field, xml, xpath} from '../src/decorators'
import {Cover2Compiler} from '../src/impl/cover2compiler'
import {Cover2Handler} from '../src/impl/cover2handler'

const nestedXML = `<?xml version="1.0" encoding="utf-8" ?>
<main>

  <nested1Escaped select="true">
    &lt;mainNested&gt;
    &lt;inside1&gt;inside1&lt;/inside1&gt;
    &lt;inside2&gt;inside2&lt;/inside2&gt;
    &lt;insideNestedEscape&gt;
    &amp;lt;insideNested&amp;gt;
    &amp;lt;hi&amp;gt;Holla&amp;lt;/hi&amp;gt;
    &amp;lt;by&amp;gt;ByBy&amp;lt;/by&amp;gt;
    &amp;lt;/insideNested&amp;gt;
    &lt;/insideNestedEscape&gt;
    &lt;/mainNested&gt;
  </nested1Escaped>
</main>
`

describe('Cover2 xml', () => {
  let obj: XmlDeepTest
  let root: any
  let handler: Cover2Handler

  beforeEach(() => {
    root = {
      xml: nestedXML
    }

    const compiler = new Cover2Compiler()

    handler = compiler.compileClass(XmlDeepTest)
    obj = handler.instance
    handler.setRoot(root)
  })

  it('should wire elements fields', () => {
    expect(obj.immediateHi.innerHTML).toBe('Holla')
    expect(obj.immediateBy.innerHTML).toBe('ByBy')
  })

  it('should replace element in document', () => {
    const oldBy = obj.immediateBy

    const newBy = oldBy.ownerDocument!.createElement('by')
    newBy.innerHTML = 'BY, LOVELY WORLD'

    obj.immediateBy = newBy

    const foundBy = obj.byOwner.querySelector('by')

    expect(foundBy).toEqual(newBy)
  })

  it('should get same elements in composite and field mode', () => {
    expect(obj.immediateHi).toEqual(obj.deep.hi)
  })

  it('should handle xpath', () => {
    expect(obj.xp).toEqual(obj.nestedCss)
  })


  class DeepXml {
    @Field(css('insideNestedEscape'), xml(true), css('hi'))
    hi: Element
  }


  class XmlDeepTest {

    @Field('xml', xml(), css('nested1Escaped'), xml(true), css('insideNestedEscape'), xml(true), css('hi'))
    public immediateHi: Element

    @Field('xml', xml(), css('nested1Escaped'), xml(true), css('insideNestedEscape'), xml(true), css('by'))
    public immediateBy: Element

    @Field('xml', xml(), css('nested1Escaped'), xml(true), css('insideNestedEscape'), xml(true))
    public byOwner: Document

    @Field('xml', xml(), css('nested1Escaped'), xml(true))
    deep: DeepXml

    @Field('xml', xml(), xpath('//nested1Escaped'), xml(true))
    xp: Element

    @Field('xml', xml(), css('nested1Escaped'), xml(true))
    nestedCss: Element
  }
})
