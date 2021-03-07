import {v3} from 'murmurhash'
import {GroupStyleSheet} from './sheet/groups'

export class StyleClass {
  componentID: string
  rules: string[]
  baseStyle?: StyleClass

  constructor(componentID: string, rules: string[], baseStyle?: StyleClass) {
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

    const css = this.rules.filter(Boolean).join('')
    const name = `coquet-${v3(css).toString(36)}`
    classNames.push(name)
    const wrappedRules = `.${name} {${css}}`
    sheet.insertRules(this.componentID, name, wrappedRules)
    return classNames.join(' ')
  }

  clear(sheet: GroupStyleSheet) {
    sheet.deleteGroupRules(this.componentID)
  }
}
