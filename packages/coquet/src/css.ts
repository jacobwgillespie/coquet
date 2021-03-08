import {Interpolation, Styles} from './types'
import {flatten, isFunction, isPlainObject} from './utils'

function interleave(strings: string[], interpolations: Interpolation[]): Interpolation[] {
  const result: Interpolation[] = [strings[0]]

  for (let i = 0, len = interpolations.length; i < len; i += 1) {
    result.push(interpolations[i], strings[i + 1])
  }

  return result
}

export function css(styles: Styles, ...interpolations: any[]): Interpolation[] {
  if (isFunction(styles) || isPlainObject(styles)) {
    return flatten(interleave([], [styles, ...interpolations])) as Interpolation[]
  }

  if (interpolations.length === 0 && Array.isArray(styles) && styles.length === 1 && typeof styles[0] === 'string') {
    return [styles[0]]
  }

  return flatten(interleave(styles as string[], interpolations)) as any
}
