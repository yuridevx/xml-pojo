import {MetadataAccessor} from '../src/utils/metadata'

describe('Metadata', () => {
  let meta: MetadataAccessor<any>
  let obj1: any
  let obj2: any

  beforeEach(() => {
    meta = new MetadataAccessor('somekey')

    obj1 = {}
    obj2 = {}
  })

  it('should store values', () => {
    meta.set(obj1, 'data1')
    meta.set(obj2, 'data2')

    expect(meta.get(obj1)).toBe('data1')
    expect(meta.get(obj2)).toBe('data2')
  })

  it('should track metadata presence', () => {
    expect(meta.has(obj1)).toBe(false)
    meta.set(obj1, 'data1')
    expect(meta.has(obj1)).toBe(true)
  })

  it('should store deep values', () => {
    meta.setDeep(obj1, ['one', 'two'], 'data1')
    meta.setDeep(obj1, ['one', 'three'], 'data2')

    console.log(obj1.__metadata__)

    expect(meta.get(obj1)).toEqual({
      one: {
        two: 'data1',
        three: 'data2'
      }
    })
  })

})
