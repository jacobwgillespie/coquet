import {v3} from 'murmurhash'
import {forwardRef} from 'react'
import {useStyleSheet} from './CoquetProvider'
import {StyleClass} from './createStyleClass'
import {cssEscape, generateDisplayName, getComponentName, Item} from './utils'

const identifiers = new Map<string, number>()

function generateID(displayName?: string, parentID?: string) {
  const name = displayName ? cssEscape(displayName) : 'coquet'
  const identifier = (identifiers.get(name) || 0) + 1
  identifiers.set(name, identifier)
  const hash = v3(`${name}-${identifier}`).toString(36)
  const id = `${name}-${hash}`
  return parentID ? `${parentID}-${id}` : `coquet-${id}`
}

export function createStyledComponent<T extends React.ElementType>(component: T, styles: Item) {
  const displayName = generateDisplayName(component)
  const componentID = generateID(getComponentName(component))
  const styleClass = new StyleClass(componentID, [styles])

  const Component = component as any
  const WrappedStyledComponent = forwardRef<T, React.ComponentPropsWithoutRef<T>>((props, ref) => {
    const groupSheet = useStyleSheet()
    const className = styleClass.inject(groupSheet)
    return <Component {...props} className={`${componentID} ${className}`} ref={ref} />
  })

  WrappedStyledComponent.displayName = displayName

  return WrappedStyledComponent
}
