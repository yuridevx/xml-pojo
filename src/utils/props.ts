export function getProp(object: any, path: Array<string>) {
  let value = object

  for (let i = 0; i < path.length; i++) {
    const key = path[i]

    if (!value.hasOwnProperty(key)) {
      return void 0
    }

    value = value[key]
  }

  return value
}

export function setProp(object: any, path: Array<string>, data: any) {
  let value = object

  for (let i = 0; i < path.length - 1; i++) {
    const key = path[i]

    if (!value.hasOwnProperty(key)) {
      value[key] = {}
    }

    value = value[key]
  }

  value[path[path.length - 1]] = data
}
