import {Cover2Handler} from './cover2handler'
import {RootHierarchy} from './root-hierarchy'
import {FieldProcessor} from './field-processor'
import {ICover2Field} from '../interfaces'
import {ICover2Context, ICover2Hierarchy} from './interfaces'
import {cover2Meta} from '../metadata'
import {AssociateMap} from './associate-map'
import clone from 'clone'

export class Cover2Compiler {
  compileClass(clazz: any): Cover2Handler {
    const instance = new clazz
    return this.compileInstance(instance)
  }

  protected compileInstance(instance): Cover2Handler {

    const meta = cover2Meta.get(instance)
    const hierarchy = new RootHierarchy()
    const processor = new FieldProcessor(hierarchy)

    const context: ICover2Context = {
      meta,
      hierarchy,
      processor,
      instance
    }

    this.linkFields(context)
    this.linkAssociate(context)

    const handler = new Cover2Handler(context)

    return handler
  }

  protected linkFields(context: ICover2Context) {
    if (!context.meta.fields) {
      return
    }

    const fieldNames = Object.keys(context.meta.fields)

    fieldNames.forEach(fieldName => {
      const field: ICover2Field = context.meta.fields[fieldName]

      if (cover2Meta.hasInProto(field.type)) {
        this.linkClassField(fieldName, field, context)
      } else {
        this.linkField(fieldName, field, context)
      }
    })
  }

  protected linkAssociate(context: ICover2Context) {
    if (!context.meta.associates) {
      return
    }

    context.associates = new AssociateMap(context.hierarchy)

    const fieldNames = Object.keys(context.meta.associates)

    fieldNames.forEach(fieldName => {
      const assoc = context.meta.associates[fieldName]

      if (!cover2Meta.hasInProto(assoc.type)) {
        const errorStr = `Associate field must be a cover2 annotated class`
        console.error(errorStr, {
          context,
          fieldName,
          assoc
        })
        throw new Error(errorStr)
      }

      let nestedContext = this.compileNestedClass(assoc.type)

      if (nestedContext.associates) {
        context.associates!.addChildAssociate(fieldName, nestedContext.associates)
      } else {
        const childAssociate = new AssociateMap(nestedContext.hierarchy)
        context.associates!.addChildAssociate(fieldName, childAssociate)
      }

      Object.defineProperty(context.instance, fieldName, {
        value: nestedContext.instance,
        enumerable: true,
        writable: false,
        configurable: true
      })
    })
  }

  protected linkClassField(fieldName: string, field: ICover2Field, context: ICover2Context) {
    const nestedHierarchy = context.hierarchy.delegateHierarchy(field.path)
    const nestedContext = this.compileNestedClass(field.type, nestedHierarchy)

    Object.defineProperty(context.instance, fieldName, {
      value: nestedContext.instance,
      enumerable: true,
      writable: false,
      configurable: true
    })
  }

  protected linkField(fieldName: string, field: ICover2Field, context: ICover2Context) {
    field = clone(field)
    Object.defineProperty(context.instance, fieldName, {
      get: context.processor.get.bind(context.processor, field),
      set: context.processor.set.bind(context.processor, field),
      enumerable: true,
      configurable: true
    })
  }

  protected compileNestedClass(clazz: any, hierarchy?: ICover2Hierarchy) {
    if (!hierarchy) {
      hierarchy = new RootHierarchy()
    }

    const instance = new clazz()
    const meta = cover2Meta.get(instance)
    const processor = new FieldProcessor(hierarchy)

    const context: ICover2Context = {
      instance,
      meta,
      processor,
      hierarchy
    }

    this.linkFields(context)
    this.linkAssociate(context)

    return context
  }

}
