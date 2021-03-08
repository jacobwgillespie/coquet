import {createStyledComponent} from './createStyledComponent'
import {css} from './css'
import {domElements} from './utils/domElements'

type DomElements = typeof domElements[number]

type Styled = ((element: React.ElementType) => (styles: TemplateStringsArray, ...interpolations: any[]) => any) &
  Record<DomElements, (styles: TemplateStringsArray, ...interpolations: any[]) => any>

function namedFunction<T extends (...args: any) => any>(name: string, fn: T): T {
  const obj = {
    [name](...args: any[]) {
      return fn(...args)
    },
  }
  return obj[name] as T
}

export const styled: Styled = ((element: React.ElementType) => {
  return namedFunction(`styled.${element}`, (styles: TemplateStringsArray, ...interpolations: any[]) => {
    const builtCSS = css(styles, ...interpolations)
    return createStyledComponent(element, builtCSS)
  })
}) as Styled

for (const element of domElements) {
  styled[element] = styled(element as keyof JSX.IntrinsicElements)
}
