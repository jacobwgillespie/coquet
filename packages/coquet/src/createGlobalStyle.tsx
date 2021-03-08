import {memo, useEffect} from 'react'
import {useStyleSheet} from './CoquetProvider'
import {css} from './css'
import {hash} from './utils'
import {createCompiler} from './utils/compiler'

const stylis = createCompiler()

export function createGlobalStyle(
  styles: TemplateStringsArray,
  ...interpolations: any[]
): React.NamedExoticComponent<{}> {
  const style = css(styles, ...interpolations)
  const compiledCSS = stylis.compile(Array.isArray(style) ? style.join('') : style)

  const id = `coquet-global-${hash(compiledCSS)}`

  const GlobalStyle: React.FC = () => {
    const groupSheet = useStyleSheet()
    useEffect(() => {
      groupSheet.insertRules(id, id, compiledCSS)
      return () => groupSheet.clearRules(id)
    }, [])

    return null
  }

  return memo(GlobalStyle)
}
