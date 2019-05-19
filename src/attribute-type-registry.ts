import { ApplicationRecord } from "../test/fixtures"

export class BaseType {
  serialize(value: any): any {
    return value
  }

  serializeFilter(value: any): any {
    return value
  }

  deserialize(value: any): any {
    return value
  }
}

class HashType extends BaseType {
  serializeFilter(value: any): any {
    if (typeof value === "object") {
      value = encodeURIComponent(JSON.stringify(value))
    }
    return value
  }
}

class DateType extends BaseType {
  serialize(value: Date): string {
    return value.toISOString()
  }

  deserialize(value: any): Date {
    if (typeof value === "string") {
      let b = value.split(/\D/) as any
      return new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6] | 0))
    } else {
      return value
    }
  }
}

// For documentation
class ShortDateType extends DateType {
  deserialize(value: any): any {
    let date = super.deserialize(value)
    console.log(date)
    return "asdf"
  }
}
// ApplicationRecord.types.add('shortDate', ShortDateType)
// @Attr({ type: 'shortDate' })

export class AttributeTypeRegistry {
  all: any = {}

  constructor() {
    this.all = {
      date: new DateType(),
      shortDate: new ShortDateType(),
      hash: new HashType()
    }
  }

  add(type: string, klass: any) {
    this.all[type] = klass
  }

  get(type: string): BaseType {
    let found = this.all[type]
    if (!found) {
      throw new Error(`Could not find type '${type}' in the registry!`)
    }
    return found
  }
}
