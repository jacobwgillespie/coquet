import {v3} from 'murmurhash'
import {createCompiler} from './compiler'
import {GroupStyleSheet} from './sheet/groups'
import {flatten, Item} from './utils'
const stylis = createCompiler()

export class StyleClass {
  componentID: string
  rules: Item[]
  baseStyle?: StyleClass

  constructor(componentID: string, rules: Item[], baseStyle?: StyleClass) {
    this.componentID = componentID
    this.rules = rules
    this.baseStyle = baseStyle
  }

  get className() {
    return this.componentID
  }

  inject(sheet: GroupStyleSheet) {
    const classNames: string[] = []

    if (this.baseStyle) {
      classNames.push(this.baseStyle.inject(sheet))
    }

    let css = ''

    for (const rule of this.rules) {
      css += flatten(rule, sheet)
    }

    const name = `coquet-${v3(css).toString(36)}`
    if (!sheet.hasNameForID(this.componentID, name)) {
      const wrappedRules = stylis.compile(css, `.${name}`, undefined, this.componentID)
      sheet.insertRules(this.componentID, name, wrappedRules)
    }
    classNames.push(name)
    return classNames.join(' ')
  }

  clear(sheet: GroupStyleSheet) {
    sheet.deleteGroupRules(this.componentID)
  }
}
