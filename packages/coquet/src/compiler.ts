import {compile, Element, RULESET, serialize, stringify} from 'stylis'

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
    const atomized = compiled.flatMap((el) => atomize(el))
    console.log(serialize(atomized, stringify))
    return serialize(atomized, stringify)
  }

  return {compile: compileCSS}
}
