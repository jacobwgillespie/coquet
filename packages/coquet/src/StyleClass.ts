import {GroupStyleSheet} from './sheet/groups'
import {flatten, hash, Item} from './utils'
import {compileCSS} from './utils/compiler'

const StyleClassSymbol = Symbol('CoquetClassName')

export function isClassName(name: string): boolean {
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

  inject(sheet: GroupStyleSheet): string {
    const classNames: string[] = []

    if (this.baseStyle) {
      classNames.push(this.baseStyle.inject(sheet))
    }

    let css = ''

    for (const rule of this.rules) {
      css += flatten(rule, sheet)
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

  clear(sheet: GroupStyleSheet) {
    sheet.deleteGroupRules(this.componentID)
  }
}