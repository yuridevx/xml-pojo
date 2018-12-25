import {Field, Mock} from '../src/decorators'
import {Cover2Compiler} from '../src/impl/cover2compiler'
import {Cover2Handler} from '../src/impl/cover2handler'

describe('Cover2 mock', () => {
  let obj: DeepTest
  let root: any
  let handler: Cover2Handler

  beforeEach(() => {
    root = {
      empty: true
    }

    const compiler = new Cover2Compiler()

    handler = compiler.compileClass(DeepTest)
    obj = handler.instance
    handler.setRoot(root)
  })

  it('should mock fields', () => {
    expect(obj.mocked).toEqual({
      value: false
    })

    obj.mocked = {
      value: true
    }

    expect(obj.mocked).toEqual({
      value: true
    })
  })

  class DeepTest {

    @Mock({value: false})
    @Field('path.to.hyper.form')
    public mocked: any
  }
})

