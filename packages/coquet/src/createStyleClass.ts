import {GroupStyleSheet} from './sheet/groups'

export class StyleClass {
  componentID: string
  rules: string[]

  constructor(componentID: string, rules: string[]) {
    this.componentID = componentID
    this.rules = rules
  }

  get className() {
    return this.componentID
  }

  inject(sheet: GroupStyleSheet) {
    const wrappedRules = this.rules.map((rule) => `.${this.componentID} {${rule}}`)
    sheet.insertGroupRules(this.componentID, wrappedRules)
  }

  clear(sheet: GroupStyleSheet) {
    sheet.deleteGroupRules(this.componentID)
  }
}
