import {compile, Element, middleware, Middleware, prefixer, RULESET, rulesheet, serialize, stringify} from 'stylis'
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

function selfReferenceReplacer(match: string, offset: number, string: string): string {
  if (
    // do not replace the first occurrence if it is complex (has a modifier)
    (offset === 0 ? !COMPLEX_SELECTOR_PREFIX.includes(string[1]) : true) &&
    // no consecutive self refs (.b.b); that is a precedence boost and treated differently
    !string.match(_consecutiveSelfRefRegExp)
  ) {
    return `.COMPONENT_ID`
  }

  return match
}

const selfReferenceReplacementPlugin: Middleware = (element) => {
  if (element.type === RULESET && element.value.includes('&')) {
    ;(element.props as string[])[0] = element.props[0].replace(_selectorRegexp, selfReferenceReplacer)
  }
}

const COMMENT_REGEX = /^\s*\/\/.*$/gm
const COMPLEX_SELECTOR_PREFIX = [':', '[', '.', '#']
const PLACEHOLDER_CLASSNAME = '\x1b'
const PLACEHOLDER_REGEXP = /\x1b/g

const _selectorRegexp = new RegExp(`\\.${PLACEHOLDER_CLASSNAME}\\b`, 'g')
const _consecutiveSelfRefRegExp = new RegExp(`(\\.${PLACEHOLDER_CLASSNAME}\\b){2,}`)

interface CompiledRule {
  className: string
  rule: string
}

export function compileCSS(css: string) {
  const compiled = compile(`.${PLACEHOLDER_CLASSNAME} { ${css.replace(COMMENT_REGEX, '')} }`)

  const rules: CompiledRule[] = []
  serialize(
    compiled,
    middleware([
      prefixer,
      selfReferenceReplacementPlugin,
      stringify,
      rulesheet((rule) => {
        const className = `c-${hash(rule)}`
        rules.push({className, rule: rule.replace(PLACEHOLDER_REGEXP, className)})
      }),
    ]),
  )
  return rules
}

export function compileAtomic(css: string): CompiledRule[] {
  const compiled = compile(`.${PLACEHOLDER_CLASSNAME} { ${css.replace(COMMENT_REGEX, '')} }`)

  const atomized = compiled.flatMap((el) => atomize(el))

  const rules: CompiledRule[] = []
  serialize(
    atomized,
    middleware([
      prefixer,
      selfReferenceReplacementPlugin,
      stringify,
      rulesheet((rule) => {
        const className = `c-${hash(rule)}`
        rules.push({className, rule: rule.replace(PLACEHOLDER_REGEXP, className)})
      }),
    ]),
  )
  return rules
}
