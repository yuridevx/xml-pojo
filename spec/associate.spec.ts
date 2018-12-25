import {Cover2Compiler} from '../src/impl/cover2compiler'
import {Cover2Handler} from '../src/impl/cover2handler'
import {Associate, Field} from '../src/decorators'

describe('Cover2', () => {
  let obj: DeepTest
  let handler: Cover2Handler

  beforeEach(() => {
    const associateRoot = {
      num: 20,
    }

    const compiler = new Cover2Compiler()

    handler = compiler.compileClass(DeepTest)
    obj = handler.instance
    handler.setAssociateRoot(['deep', 'deep2'], associateRoot)
  })

  it('should create associate object', () => {
    expect(obj.deep.deep2.num).toBe(20)
  })


  class ActualObject {
    @Field()
    public num: number
  }

  class DeepAssociate {
    @Associate()
    public deep2: ActualObject
  }

  class DeepTest {

    @Associate()
    public deep: DeepAssociate
  }
})

