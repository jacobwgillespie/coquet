import {memo, useEffect} from 'react'
import {useStyleSheet} from './CoquetProvider'
import {generateComponentID} from './generateComponentID'

export function createGlobalStyle(style: string) {
  const id = `coquet-global-${generateComponentID(style)}`

  const GlobalStyle: React.FC = () => {
    const groupSheet = useStyleSheet()
    useEffect(() => {
      groupSheet.insertRules(id, id, style)
      return () => groupSheet.clearRules(id)
    }, [])

    return null
  }

  return memo(GlobalStyle)
}
