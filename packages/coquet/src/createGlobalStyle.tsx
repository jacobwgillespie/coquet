import {memo, useEffect} from 'react'
import {useStyleSheet} from './CoquetProvider'
import {css} from './css'
import {flatten, hash} from './utils'
import {createCompiler} from './utils/compiler'

const stylis = createCompiler()

export function createGlobalStyle(
  styles: TemplateStringsArray,
  ...interpolations: any[]
): React.NamedExoticComponent<any> {
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
