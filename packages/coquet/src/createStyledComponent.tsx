import {v3} from 'murmurhash'
import {forwardRef, useEffect} from 'react'
import {useStyleSheet} from './CoquetProvider'
import {StyleClass} from './createStyleClass'
import {cssEscape, generateDisplayName} from './utils'

const identifiers = new Map<string, number>()

function generateID(displayName?: string, parentID?: string) {
  const name = displayName ? cssEscape(displayName) : 'coquet'
  const identifier = (identifiers.get(name) || 0) + 1
  identifiers.set(name, identifier)
  const hash = v3(`${name}-${identifier}`).toString(36)
  const id = `${name}-${hash}`
  return parentID ? `${parentID}-${id}` : id
}

export function createStyledComponent<T extends React.ElementType>(component: T, styles: string) {
  const displayName = generateDisplayName(component)
  const componentID = generateID(displayName)
  const styleClass = new StyleClass(componentID, [styles])

  const Component = component as any
  const WrappedStyledComponent = forwardRef<T, React.ComponentPropsWithoutRef<T>>((props, ref) => {
    const groupSheet = useStyleSheet()
    useEffect(() => {
      styleClass.inject(groupSheet)
    }, [])
    return <Component {...props} className={styleClass.className} ref={ref} />
  })

  WrappedStyledComponent.displayName = displayName

  return WrappedStyledComponent
}
