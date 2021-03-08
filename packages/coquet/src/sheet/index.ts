import {compile, middleware, rulesheet, serialize, stringify} from 'stylis'

function getStyleSheetFromStyleElement(element: HTMLStyleElement) {
  if (element.sheet) return element.sheet
  for (let i = 0; i < document.styleSheets.length; i++) {
    if (document.styleSheets[i].ownerNode === element) {
      return document.styleSheets[i]
    }
  }
  return undefined
}

function getBeforeElement(siblings: HTMLElement[], parent: HTMLElement) {
  return siblings.length === 0 ? parent.firstChild : siblings[siblings.length - 1].nextSibling
}

export interface SheetOptions {
  key: string
  parent: HTMLElement
  nonce?: string
}

export class Sheet {
  key: string
  parent: HTMLElement
  nonce?: string

  ruleCount = 0
  styleElements: HTMLStyleElement[] = []

  constructor(options: SheetOptions) {
    this.key = options.key
    this.parent = options.parent
    this.nonce = options.nonce
  }

  insertRule(rule: string) {
    if (process.env.NODE_ENV !== 'production' || this.ruleCount % 50000 === 0) {
      const styleElement = document.createElement('style')
      styleElement.setAttribute('data-coquet', this.key)
      if (this.nonce) styleElement.setAttribute('nonce', this.nonce)
      styleElement.appendChild(document.createTextNode(''))
      styleElement.setAttribute('data-js', '')
      const beforeElement = getBeforeElement(this.styleElements, this.parent)
      this.parent.insertBefore(styleElement, beforeElement)
      this.styleElements.push(styleElement)
    }

    const styleElement = this.styleElements[this.styleElements.length - 1]

    if (process.env.NODE_ENV === 'production') {
      const sheet = getStyleSheetFromStyleElement(styleElement)
      try {
        sheet?.insertRule(rule, sheet.cssRules.length)
      } catch {}
    } else {
      styleElement.appendChild(document.createTextNode(rule))
    }

    this.ruleCount += 1
  }

  clearRules() {
    for (const styleElement of this.styleElements) {
      styleElement.parentNode?.removeChild(styleElement)
    }
    this.styleElements = []
    this.ruleCount = 0
  }

  hydrate(styleElements: HTMLStyleElement[]) {
    for (const styleElement of styleElements) {
      const beforeElement = getBeforeElement(this.styleElements, this.parent)
      this.parent.insertBefore(styleElement, beforeElement)
      this.styleElements.push(styleElement)
    }
  }
}

export const isBrowser = typeof document !== 'undefined'

export function insertBrowser(selector: string, styles: string, sheet: Sheet) {
  const serializer = middleware([stringify, rulesheet((rule) => sheet.insertRule(rule))])
  const stylis = (styles: string) => serialize(compile(styles), serializer)
  stylis(selector ? `${selector}{${styles}}` : styles)
}
