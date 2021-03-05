import {compile} from 'stylis'

export * from './createGlobalStyle'
export * from './createStyledComponent'
export * from './cx'
export * from './sheet'

export const hello = 'world'

export function css(source: string) {
  return compile(source)
}
