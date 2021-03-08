import {compile, Element, middleware, RULESET, rulesheet, serialize, stringify} from 'stylis'
import {hash} from './utils/hash'

function cloneElement(element: Element, withChildren = true): Element {
  const clonedElement = {...element}

  if (typeof element.props === 'object') {
    clonedElement.props = [...element.props]
  }

  if (withChildren && typeof element.children === 'object') {
    clonedElement.children = element.children.flatMap((child: Element) => {
      const clonedChildren = atomize(child)
      clonedChildren.forEach((child) => (child.root = clonedElement))
      return clonedChildren
    })
  }
  return clonedElement
}

function atomize(element: Element): Element[] {
  if (element.type !== RULESET) return [cloneElement(element)]
  if (!Array.isArray(element.children)) return [cloneElement(element)]
  return element.children.map((child) => cloneElement({...element, children: [child]}))
}

export function createCompiler() {
  function compileCSS(css: string, selector = '', prefix = '', _id = '&') {
    const compiled = compile(prefix || selector ? `${prefix} ${selector} { ${css} }` : css)
    return serialize(compiled, stringify)
  }

  return {compile: compileCSS}
}

const PLACEHOLDER_CLASSNAME = '\x1b'
const PLACEHOLDER_REGEXP = /\x1b/g

interface CompiledRule {
  className: string
  rule: string
}

export function compileAtomic(css: string): CompiledRule[] {
  const compiled = compile(`.${PLACEHOLDER_CLASSNAME} { ${css} }`)

  const atomized = compiled.flatMap((el) => atomize(el))

  const rules: CompiledRule[] = []
  serialize(
    atomized,
    middleware([
      stringify,
      rulesheet((rule) => {
        const className = `c-${hash(rule)}`
        rules.push({className, rule: rule.replace(PLACEHOLDER_REGEXP, className)})
      }),
    ]),
  )
  return rules
}
