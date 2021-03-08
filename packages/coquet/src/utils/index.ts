import {v3} from 'murmurhash'
import {typeOf} from 'react-is'
import {GroupStyleSheet} from '../sheet/groups'
import {unitless} from './unitless'

export function hash(string: string) {
  return v3(string).toString(36)
}

// Taken from https://github.com/facebook/react/blob/b87aabdfe1b7461e7331abb3601d9e6bb27544bc/packages/react-dom/src/shared/dangerousStyleValue.js
export function addUnitIfNeeded(name: string, value: any): any {
  if (value == null || typeof value === 'boolean' || value === '') {
    return ''
  }

  if (typeof value === 'number' && value !== 0 && !(name in unitless)) {
    return `${value}px` // Presumes implicit 'px' suffix for unitless numbers
  }

  return String(value).trim()
}

export function isTag(value: React.ElementType): value is keyof JSX.IntrinsicElements {
  return typeof value === 'string'
}

export function getComponentName(value: React.ElementType): string {
  if (isTag(value)) {
    return value
  }
  return value.displayName || value.name || 'Component'
}

export function generateDisplayName(value: React.ElementType) {
  return isTag(value) ? `styled.${value}` : `Styled(${getComponentName(value)})`
}

/**
 * inlined version of
 * https://github.com/facebook/fbjs/blob/master/packages/fbjs/src/core/hyphenateStyleName.js
 */

const uppercaseCheck = /([A-Z])/
const uppercasePattern = /([A-Z])/g
const msPattern = /^ms-/
const prefixAndLowerCase = (char: string): string => `-${char.toLowerCase()}`

/**
 * Hyphenates a camelcased CSS property name, for example:
 *
 *   > hyphenateStyleName('backgroundColor')
 *   < "background-color"
 *   > hyphenateStyleName('MozTransition')
 *   < "-moz-transition"
 *   > hyphenateStyleName('msTransition')
 *   < "-ms-transition"
 *
 * As Modernizr suggests (http://modernizr.com/docs/#prefixed), an `ms` prefix
 * is converted to `-ms-`.
 *
 * @param {string} string
 * @return {string}
 */
export function hyphenateStyleName(string: string): string {
  return uppercaseCheck.test(string)
    ? string.replace(uppercasePattern, prefixAndLowerCase).replace(msPattern, '-ms-')
    : string
}

const escapeMiddle = /[!"#$%&'()*+,./:;<=>?@[\\\]^`{|}~-]+/g
const escapeEnd = /(^-|-$)/g

export function cssEscape(value: string) {
  return value.replace(escapeMiddle, '-').replace(escapeEnd, '')
}

export function isPlainObject(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === 'object' &&
    value !== null &&
    (value.toString ? value.toString() : Object.prototype.toString.call(value)) === '[object Object]' &&
    !typeOf(value)
  )
}

export function isFunction(value: unknown): value is Function {
  return typeof value === 'function'
}

export default function isStatelessFunction(value: unknown): boolean {
  return typeof value === 'function' && !(value.prototype && value.prototype.isReactComponent)
}

export function isStyledComponent(value: unknown) {
  return value && typeof (value as any).coquetComponentID === 'string'
}

export function objectToCSS(obj: Record<string, unknown>, prevKey?: string): (string | Function)[] {
  const rules: (string | Function)[] = []

  for (const key in obj) {
    const value = obj[key]

    if (!obj.hasOwnProperty(key) || (!value && value !== 0)) continue

    if (isPlainObject(value)) {
      rules.push(...objectToCSS(value, key))
    } else if (isFunction(value)) {
      rules.push(`${hyphenateStyleName(key)}:`, value, ';')
    } else {
      rules.push(`${hyphenateStyleName(key)}: ${addUnitIfNeeded(key, value)};`)
    }
  }

  return prevKey ? [`${prevKey} {`, ...rules, '}'] : rules
}

export type Item = string | number | Function | object | Item[]

export function flattenInner(item: Item, sheet?: GroupStyleSheet): string | Function | (string | Function)[] {
  if (Array.isArray(item)) {
    const rules: (string | Function)[] = []
    for (const i of item) {
      const result = flattenInner(i, sheet)
      if (result === '') continue
      else if (Array.isArray(result)) rules.push(...result)
      else rules.push(result)
    }
    return rules
  }

  if (!item && item !== 0) {
    return ''
  }

  if (isStyledComponent(item)) {
    return `.${(item as any).coquetComponentID}`
  }

  if (isFunction(item) && isStatelessFunction(item)) {
    const result = item()
    return flattenInner(result, sheet)
  }

  if (isPlainObject(item)) {
    return objectToCSS(item)
  }

  return item.toString()
}

export function flatten(item: Item, sheet?: GroupStyleSheet): string {
  const result = flattenInner(item, sheet)

  return Array.isArray(result)
    ? result.map((i) => (isFunction(i) ? i() : i)).join('')
    : isFunction(result)
    ? result()
    : result
}

export function namedFunction<T extends (...args: any) => any>(name: string, fn: T): T {
  const obj = {
    [name](...args: any[]) {
      return fn(...args)
    },
  }
  return obj[name] as T
}