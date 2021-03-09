import {memo, useEffect} from 'react'
import {useStyleSheet} from './CoquetProvider'
import {css} from './css'
import {flatten, hash} from './utils'
import {createCompiler} from './utils/compiler'

const stylis = createCompiler()

type NoInfer<A extends any> = [A][A extends any ? 0 : never]

type Interpolation<Props> = string | false | ((props: NoInfer<Props>) => Interpolation<Props>) | Interpolation<Props>[]

export function createGlobalStyle<Props extends {} = {}>(
  styles: TemplateStringsArray,
  ...interpolations: Interpolation<Props>[]
): React.FC<Props> {
  const rules = css(styles, ...interpolations)

  const id = `coquet-global-${hash(JSON.stringify(rules))}`

  const GlobalStyle: React.FC = (props) => {
    const groupSheet = useStyleSheet()
    useEffect(() => {
      const style = flatten(rules, groupSheet, props)
      const flatCSS = `${Array.isArray(style) ? style.join('') : style}`
      const compiledCSS = stylis.compile(flatCSS)
      groupSheet.insertRules(id, id, compiledCSS)
      return () => groupSheet.clearRules(id)
    }, [])

    return null
  }

  return memo(GlobalStyle)
}
