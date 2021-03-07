import {flatten} from './utils'

function interleave(strings: TemplateStringsArray, interpolations: Array<any>): Array<any> {
  const result = [strings[0]]

  for (let i = 0, len = interpolations.length; i < len; i += 1) {
    result.push(interpolations[i], strings[i + 1])
  }

  return result
}

export function css(styles: TemplateStringsArray, ...interpolations: any[]): string {
  if (interpolations.length === 0 && styles.length === 1 && typeof styles[0] === 'string') {
    return styles[0]
  }

  return flatten(interleave(styles, interpolations))
}
