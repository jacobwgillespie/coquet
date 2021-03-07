import {memo, useEffect} from 'react'
import {createCompiler} from './compiler'
import {useStyleSheet} from './CoquetProvider'
import {css} from './css'
import {generateComponentID} from './generateComponentID'

const stylis = createCompiler()

export function createGlobalStyle(styles: TemplateStringsArray, ...interpolations: any[]) {
  const style = css(styles, ...interpolations)
  const compiledCSS = stylis.compile(style)

  const id = `coquet-global-${generateComponentID(compiledCSS)}`

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
