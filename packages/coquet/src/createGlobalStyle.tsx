import {memo, useEffect} from 'react'
import {createCompiler} from './compiler'
import {useStyleSheet} from './CoquetProvider'
import {generateComponentID} from './generateComponentID'
import {flatten, Item} from './utils'

const stylis = createCompiler()

export function createGlobalStyle(style: Item) {
  const css = flatten(style)
  const compiledCSS = stylis.compile(css)

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
