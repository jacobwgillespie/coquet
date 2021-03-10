import {StyleManager} from './StyleManager'
import {flatten, hash, Item} from './utils'
import {compileCSS} from './utils/compiler'

const StyleClassSymbol = Symbol('CoquetClassName')

export function isClassName(name: unknown): name is string {
  return Boolean((name as any)[StyleClassSymbol])
}

export class StyleClass {
  componentID: string
  rules: Item[]
  baseStyle?: StyleClass

  constructor(componentID: string, rules: Item[], baseStyle?: StyleClass) {
    this.componentID = componentID
    this.rules = rules
    this.baseStyle = baseStyle
  }

  inject(sheet: StyleManager, ctx: object): string {
    const classNames: string[] = []

    if (this.baseStyle) {
      classNames.push(this.baseStyle.inject(sheet, ctx))
    }

    let css = ''

    for (const rule of this.rules) {
      const result = flatten(rule, sheet, ctx)
      css += Array.isArray(result) ? result.join('') : result
    }

    const name = `coquet-${hash(css)}`
    const rules = compileCSS(css)
    // const wrappedRules = stylis.compile(css, `.${name}`, undefined, this.componentID)
    for (const rule of rules) {
      if (!sheet.hasNameForID(this.componentID, rule.className)) {
        sheet.insertRules(this.componentID, rule.className, rule.rule)
      }
      classNames.push(rule.className)
    }
    classNames.push(name)
    return Object.assign(classNames.join(' '), {[StyleClassSymbol]: true})
  }

  clear(sheet: StyleManager) {
    sheet.deleteGroupRules(this.componentID)
  }
}
