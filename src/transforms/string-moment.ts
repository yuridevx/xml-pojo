const moment = require('moment')

import {ICover2Transform} from '../interfaces'

export class StringMoment implements ICover2Transform {

  get(value: any): any {
    const date = moment(value)

    return date
  }

  set(current: any, toSet: any, setValue: (value: any) => void): any {
    const format = toSet.format('YYYY-MM-DDTHH:mm:ss')
    setValue(format)
  }
}
