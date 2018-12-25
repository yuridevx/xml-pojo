import {Field, Transform} from '../src/decorators'
import {Cover2Compiler} from '../src/impl/cover2compiler'
import {Cover2Handler} from '../src/impl/cover2handler'
import Spy = jasmine.Spy

declare class DeepTest {
  value: string
}

describe('Cover2 transform', () => {
  let obj: DeepTest
  let root: any
  let handler: Cover2Handler
  let spyGet1: Spy, spySet1: Spy

  beforeEach(() => {
    class DeepTest {

      @Transform({
        get: spyGet1 = jasmine.createSpy('spyGet1'),
        set: spySet1 = jasmine.createSpy('spySet1')
      })
      @Field('path.to.value')
      public value: string
    }

    spyGet1.and.returnValue('get')
    spySet1.and.callFake(function (current, toSet, fnChange) {
      fnChange('set')
    })

    root = {
      path: {
        to: {
          value: 'non-set-str'
        }
      }
    }

    const compiler = new Cover2Compiler()

    handler = compiler.compileClass(DeepTest)
    obj = handler.instance
    handler.setRoot(root)
  })

  it('should transform fields', () => {
    expect(obj.value).toBe('get')

    obj.value = 'hi'

    handler.sync()

    expect(root.path.to.value).toBe('set')
  })
})
