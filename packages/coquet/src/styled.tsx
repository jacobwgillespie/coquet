import {createElement, forwardRef} from 'react'
import {useStyleSheet} from './CoquetProvider'
import {css} from './css'
import {cx} from './cx'
import {StyleClass} from './StyleClass'
import {Interpolation as OtherInterp} from './types'
import {cssEscape, generateDisplayName, getDisplayName, hash, Item, namedFunction} from './utils'
import {elements} from './utils/elements'

export type NoInfer<A extends any> = [A][A extends any ? 0 : never]

type Interpolation<Props> =
  | string
  | false
  | ((props: NoInfer<Props>) => Interpolation<Props>)
  | StyledComponentInterpolation
  | Interpolation<Props>[]
  | OtherInterp[]

type StyledComponentInterpolation =
  | Pick<StyledComponent<any, any>, keyof StyledComponent<any, any>>
  | Pick<StyledComponent<any>, keyof StyledComponent<any, any>>

export type PropsOf<
  C extends keyof JSX.IntrinsicElements | React.JSXElementConstructor<any>
> = JSX.LibraryManagedAttributes<C, React.ComponentProps<C>>

export interface StyledComponent<ComponentProps extends {}, JSXProps extends {} = {}>
  extends React.FC<ComponentProps & JSXProps> {
  as<Component extends React.ComponentClass<React.ComponentProps<Component>>>(
    component: Component,
  ): StyledComponent<PropsOf<Component>, {ref?: React.Ref<InstanceType<Component>>}>

  as<Component extends React.ComponentType<React.ComponentProps<Component>>>(
    component: Component,
  ): StyledComponent<PropsOf<Component>>

  as<Tag extends keyof JSX.IntrinsicElements>(tag: Tag): StyledComponent<JSX.IntrinsicElements[Tag]>
}

interface BaseCreateStyled {
  <C extends React.ComponentClass<React.ComponentProps<C>>>(component: C): CreateStyledComponent<
    PropsOf<C>,
    {ref?: React.Ref<InstanceType<C>>}
  >

  <C extends React.ComponentType<React.ComponentProps<C>>>(component: C): CreateStyledComponent<PropsOf<C>>

  <Tag extends keyof JSX.IntrinsicElements>(tag: Tag): CreateStyledComponent<{}, JSX.IntrinsicElements[Tag]>
}

export interface CreateStyledComponent<ComponentProps extends {}, JSXProps extends {} = {}> {
  <AdditionalProps extends {}>(
    template: TemplateStringsArray,
    ...styles: Interpolation<ComponentProps & AdditionalProps>[]
  ): StyledComponent<ComponentProps & AdditionalProps, JSXProps>

  (template: TemplateStringsArray, ...styles: Interpolation<ComponentProps>[]): StyledComponent<
    ComponentProps,
    JSXProps
  >
}

export type StyledTags = {
  [Tag in keyof JSX.IntrinsicElements]: CreateStyledComponent<{}, JSX.IntrinsicElements[Tag]>
}

interface Styled extends BaseCreateStyled, StyledTags {}

const styler: BaseCreateStyled = (element: React.ElementType) => {
  return namedFunction(generateDisplayName(element), (styles: TemplateStringsArray, ...interpolations: any[]) => {
    const builtCSS = css(styles, ...interpolations)
    return createStyledComponent(element, builtCSS)
  })
}

export const styled: Styled = Object.assign(
  styler,
  elements.reduce<StyledTags>((obj, el) => {
    obj[el] = styler(el)
    return obj
  }, {} as StyledTags),
)

const identifiers = new Map<string, number>()

function generateID(displayName?: string, parentID?: string) {
  const name = displayName ? cssEscape(displayName) : 'coquet'
  const identifier = (identifiers.get(name) || 0) + 1
  identifiers.set(name, identifier)
  const id = `${name}-${hash(`${name}-${identifier}`)}`
  return parentID ? `${parentID}-${id}` : `coquet-${id}`
}

function createStyledComponent<T extends React.ElementType>(component: T, styles: Item) {
  const displayName = generateDisplayName(component)
  const componentID = generateID(getDisplayName(component))
  const styleClass = new StyleClass(componentID, [styles])
  const asComponentCache = new Map<React.ElementType, StyledComponent<any, any>>()

  const WrappedStyledComponent = forwardRef<T, React.ComponentPropsWithoutRef<T>>((props, ref) => {
    const groupSheet = useStyleSheet()
    const className = styleClass.inject(groupSheet, props)

    const filteredProps = {} as typeof props
    for (const key in props) {
      if (key[0] !== '$') {
        filteredProps[key] = props[key]
      }
    }

    return createElement(component, {
      ...filteredProps,
      ref,
      className: cx(props.className, componentID, className),
    })
  })

  const StyledComponent = Object.assign(WrappedStyledComponent, {
    displayName,
    as<T extends React.ElementType>(component: T) {
      const cachedStyledComponent = asComponentCache.get(component)
      if (cachedStyledComponent) return cachedStyledComponent
      const styledComponentAs = createStyledComponent(component, styles)
      asComponentCache.set(component, styledComponentAs)
      return styledComponentAs
    },
  })

  return StyledComponent
}
