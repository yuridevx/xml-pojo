import {AbstractDigger} from './abstract-digger'

export class JsonDigger extends AbstractDigger {
  id: string

  private forceGet(root: any, skipRight: number) {
    let self = root

    const lastIndex = this.jsonPath.length - 1 - skipRight

    if (lastIndex < 0) {
      return self
    }

    for (let i = 0; i <= lastIndex; i++) {
      const part = this.jsonPath[i]

      if (!self.hasOwnProperty(part)) {
        self[part] = {}
        console.warn('Field', this.jsonPath.slice(0, i + 1), 'was just created on', root)
      }

      self = self[part]
    }

    return self
  }

  getOn(root: any) {
    let parent = this.forceGet(root, 1)
    return parent[this.jsonPath[this.jsonPath.length - 1]]
  }

  setOn(root: any, value: any) {
    let parent = this.forceGet(root, 1)
    parent[this.jsonPath[this.jsonPath.length - 1]] = value
  }

  constructor(private jsonPath: string[]) {
    super()
    this.id = `json(${jsonPath.join('.')})`
  }
}
