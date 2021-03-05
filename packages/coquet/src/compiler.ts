import {compile, serialize, stringify} from 'stylis'

export function createCompiler() {
  function compileCSS(css: string, selector = '', prefix = '', _id = '&') {
    return serialize(compile(prefix || selector ? `${prefix} ${selector} { ${css} }` : css), stringify)
  }

  return {compile: compileCSS}
}
