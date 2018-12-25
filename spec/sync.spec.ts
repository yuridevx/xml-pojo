import {Field, json} from '../src/decorators'
import {Cover2Handler} from '../src/impl/cover2handler'
import {Cover2Compiler} from '../src/impl/cover2compiler'

describe('Cover2 sync', () => {
  let obj: DeepTest
  let root1: any
  let root2: any

  let handler: Cover2Handler

  beforeEach(() => {
    root1 = {
      deep: {
        jsStr1: JSON.stringify({
          str1: 'str1',
          jsStr2: JSON.stringify({
            str2: 'str2',
          })
        })
      }
    }

    root2 = {
      deep: {
        jsStr1: JSON.stringify({
          str1: 'changed',
          jsStr2: JSON.stringify({
            str2: 'changed',
          })
        })
      }
    }

    const compiler = new Cover2Compiler()

    handler = compiler.compileClass(DeepTest)
    obj = handler.instance
    handler.setRoot(root1)
  })

  it('should sync to the root object', () => {
    obj.js1.str1 = 'changed'
    obj.js1.js2.str2 = 'changed'

    handler.sync()

    expect(handler.getRoot()).toEqual(root2)
  })

  class SubSubDeep {
    @Field()
    public str2: string
  }

  class SubDeep {
    @Field()
    str1: string

    @Field('jsStr2', json())
    js2: SubSubDeep
  }

  class DeepTest {

    @Field('deep.jsStr1', json())
    public js1: SubDeep
  }
})
