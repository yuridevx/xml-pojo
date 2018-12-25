import {ICover2Path, ICover2RawPath} from './interfaces'
import {AbstractDigger} from './diggers/abstract-digger'
import {AbstractFormat} from './formats/abstract-format'
import {JsonDigger} from './diggers/json-digger'
import {IdentityFormat} from './formats/identity-format'

import 'reflect-metadata'

export function normalizeCoverPath(path: ICover2RawPath): ICover2Path {
  const normalized: any[] = []

  let parts = replaceStringWithJsonPath(path)

  for (let i = 0; i < parts.length; i++) {
    let candidate = parts[i]
    let next = parts[i + 1]
    let isEnd = (i + 1) === parts.length

    if (candidate.deepPart === 'digger') {
      if (isEnd) {
        normalized.push([candidate, new IdentityFormat()])
      } else if (next.deepPart === 'digger') {
        normalized.push([candidate, new IdentityFormat()])
      } else if (next.deepPart === 'format') {
        normalized.push([candidate, next])
        i++
      }
    } else if (candidate.deepPart === 'format') {
      throw new Error(`Type seems to appear twice in a row or on the first position in @Field arguments (${parts.map((c: any) => c.toId())})`)
    }
  }

  return normalized as ICover2Path
}


export function getFieldType(prototype: any, propertyKey: any) {
  const type = (<any>Reflect).getMetadata('design:type', prototype, propertyKey)

  if (!type) {
    throw new Error(`Couldn't recognize the type of '${prototype.constructor.name}.${propertyKey}', 
      perhaps you should reorder classes so that defined in type class is placed above ${prototype.constructor.name}`)
  }

  return type
}

function replaceStringWithJsonPath(path: ICover2RawPath): Array<AbstractFormat | AbstractDigger> {
  const parts = path.map(pathPart => {

    if (typeof pathPart === 'string') {
      return new JsonDigger(splitJsonPath(pathPart))
    } else if (['digger', 'format'].includes(pathPart.deepPart)) {
      return pathPart
    }

    const errorStr = `Unrecognized ${pathPart} value in Field arguments`

    console.error(errorStr, {
      path,
      pathPart
    })

    throw new Error()
  })

  return parts
}

function splitJsonPath(pathStr: string): string[] {
  return pathStr.split('.')
}
