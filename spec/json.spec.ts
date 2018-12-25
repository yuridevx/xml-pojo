import {Cover2Compiler} from '../src/impl/cover2compiler'
import {Cover2Handler} from '../src/impl/cover2handler'
import {Field, json, Root} from '../src/decorators'

describe('Cover2 json', () => {

  let obj: DeepTest
  let root: any
  let handler: Cover2Handler

  beforeEach(() => {
    root = {
      path: {
        to: {
          number: 20,
          deep: JSON.stringify({
            str1: 'str1',
            str2: 'str2',
            change: false,
            deep2: JSON.stringify({
              deeper: {
                str3: 'deep2-str3',
                change: false
              }
            })
          })
        }
      }
    }

    const compiler = new Cover2Compiler()

    handler = compiler.compileClass(DeepTest)
    obj = handler.instance
    handler.setRoot(root)
  })

  it('should proxy fields', () => {
    expect(obj.num).toBe(20)
  })

  it('should proxy deep composite field', () => {
    expect(obj.sub.str1).toBe('str1')
    expect(obj.sub.str2).toBe('str2')

    expect(obj.sub.str2).toBe('str2')
    expect(obj.sub.deep2.str3).toBe('deep2-str3')
  })

  it('should proxy 2 level depth composite field', () => {
    expect(obj.sub.str2).toBe('str2')
    expect(obj.sub.deep2.str3).toBe('deep2-str3')
  })

  it('should set deep values', () => {
    obj.sub.change = true
    obj.sub.deep2.change = true

    expect(obj.sub.change).toEqual(true)
    expect(obj.sub.deep2.change).toEqual(true)
  })

  it('should create nested json object', () => {
    expect(obj.nowhere).toBeUndefined()

    obj.nowhere = 'hi'
    expect(obj.nowhere).toBe('hi')

    handler.sync()

    expect(root['nowhere']['in']['json']).toEqual('hi')
  })

  it('should create root field', () => {
    expect(obj.json).toEqual(root)
  })

  class SubSubDeep {
    @Field('deeper.str3')
    public str3: string

    @Field('deeper.change')
    public change: boolean
  }

  class SubDeep {
    @Field()
    str1: string

    @Field()
    str2: string

    @Field()
    change: boolean

    @Field('deep2', json())
    deep2: SubSubDeep
  }

  class DeepTest {

    @Root()
    public json: any

    @Field('nowhere.in.json')
    public nowhere: string

    @Field('path.to.number')
    public num: number

    @Field('path.to.deep', json())
    public sub: SubDeep
  }

})
