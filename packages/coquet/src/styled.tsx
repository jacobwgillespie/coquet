import {forwardRef} from 'react'
import {useStyleSheet} from './CoquetProvider'
import {css} from './css'
import {StyleClass} from './StyleClass'
import {cssEscape, generateDisplayName, getComponentName, hash, Item, namedFunction} from './utils'

type StyledFn = (element: React.ElementType) => (styles: TemplateStringsArray, ...interpolations: any[]) => any
type IntrinsicStyledFn = {
  [K in keyof JSX.IntrinsicElements]: (styles: TemplateStringsArray, ...interpolations: any[]) => any
}

interface Styled extends StyledFn, IntrinsicStyledFn {}

const styler = (element: React.ElementType) => {
  return namedFunction(generateDisplayName(element), (styles: TemplateStringsArray, ...interpolations: any[]) => {
    const builtCSS = css(styles, ...interpolations)
    return createStyledComponent(element, builtCSS)
  })
}

export const styled: Styled = Object.assign(styler, {
  // List copied from `JSX.IntrinsicElements` type

  // HTML
  a: styler('a'),
  abbr: styler('abbr'),
  address: styler('address'),
  area: styler('area'),
  article: styler('article'),
  aside: styler('aside'),
  audio: styler('audio'),
  b: styler('b'),
  base: styler('base'),
  bdi: styler('bdi'),
  bdo: styler('bdo'),
  big: styler('big'),
  blockquote: styler('blockquote'),
  body: styler('body'),
  br: styler('br'),
  button: styler('button'),
  canvas: styler('canvas'),
  caption: styler('caption'),
  cite: styler('cite'),
  code: styler('code'),
  col: styler('col'),
  colgroup: styler('colgroup'),
  data: styler('data'),
  datalist: styler('datalist'),
  dd: styler('dd'),
  del: styler('del'),
  details: styler('details'),
  dfn: styler('dfn'),
  dialog: styler('dialog'),
  div: styler('div'),
  dl: styler('dl'),
  dt: styler('dt'),
  em: styler('em'),
  embed: styler('embed'),
  fieldset: styler('fieldset'),
  figcaption: styler('figcaption'),
  figure: styler('figure'),
  footer: styler('footer'),
  form: styler('form'),
  h1: styler('h1'),
  h2: styler('h2'),
  h3: styler('h3'),
  h4: styler('h4'),
  h5: styler('h5'),
  h6: styler('h6'),
  head: styler('head'),
  header: styler('header'),
  hgroup: styler('hgroup'),
  hr: styler('hr'),
  html: styler('html'),
  i: styler('i'),
  iframe: styler('iframe'),
  img: styler('img'),
  input: styler('input'),
  ins: styler('ins'),
  kbd: styler('kbd'),
  keygen: styler('keygen'),
  label: styler('label'),
  legend: styler('legend'),
  li: styler('li'),
  link: styler('link'),
  main: styler('main'),
  map: styler('map'),
  mark: styler('mark'),
  menu: styler('menu'),
  menuitem: styler('menuitem'),
  meta: styler('meta'),
  meter: styler('meter'),
  nav: styler('nav'),
  noindex: styler('noindex'),
  noscript: styler('noscript'),
  object: styler('object'),
  ol: styler('ol'),
  optgroup: styler('optgroup'),
  option: styler('option'),
  output: styler('output'),
  p: styler('p'),
  param: styler('param'),
  picture: styler('picture'),
  pre: styler('pre'),
  progress: styler('progress'),
  q: styler('q'),
  rp: styler('rp'),
  rt: styler('rt'),
  ruby: styler('ruby'),
  s: styler('s'),
  samp: styler('samp'),
  slot: styler('slot'),
  script: styler('script'),
  section: styler('section'),
  select: styler('select'),
  small: styler('small'),
  source: styler('source'),
  span: styler('span'),
  strong: styler('strong'),
  style: styler('style'),
  sub: styler('sub'),
  summary: styler('summary'),
  sup: styler('sup'),
  table: styler('table'),
  template: styler('template'),
  tbody: styler('tbody'),
  td: styler('td'),
  textarea: styler('textarea'),
  tfoot: styler('tfoot'),
  th: styler('th'),
  thead: styler('thead'),
  time: styler('time'),
  title: styler('title'),
  tr: styler('tr'),
  track: styler('track'),
  u: styler('u'),
  ul: styler('ul'),
  var: styler('var'),
  video: styler('video'),
  wbr: styler('wbr'),
  webview: styler('webview'),

  // SVG
  svg: styler('svg'),
  animate: styler('animate'),
  animateMotion: styler('animateMotion'),
  animateTransform: styler('animateTransform'),
  circle: styler('circle'),
  clipPath: styler('clipPath'),
  defs: styler('defs'),
  desc: styler('desc'),
  ellipse: styler('ellipse'),
  feBlend: styler('feBlend'),
  feColorMatrix: styler('feColorMatrix'),
  feComponentTransfer: styler('feComponentTransfer'),
  feComposite: styler('feComposite'),
  feConvolveMatrix: styler('feConvolveMatrix'),
  feDiffuseLighting: styler('feDiffuseLighting'),
  feDisplacementMap: styler('feDisplacementMap'),
  feDistantLight: styler('feDistantLight'),
  feDropShadow: styler('feDropShadow'),
  feFlood: styler('feFlood'),
  feFuncA: styler('feFuncA'),
  feFuncB: styler('feFuncB'),
  feFuncG: styler('feFuncG'),
  feFuncR: styler('feFuncR'),
  feGaussianBlur: styler('feGaussianBlur'),
  feImage: styler('feImage'),
  feMerge: styler('feMerge'),
  feMergeNode: styler('feMergeNode'),
  feMorphology: styler('feMorphology'),
  feOffset: styler('feOffset'),
  fePointLight: styler('fePointLight'),
  feSpecularLighting: styler('feSpecularLighting'),
  feSpotLight: styler('feSpotLight'),
  feTile: styler('feTile'),
  feTurbulence: styler('feTurbulence'),
  filter: styler('filter'),
  foreignObject: styler('foreignObject'),
  g: styler('g'),
  image: styler('image'),
  line: styler('line'),
  linearGradient: styler('linearGradient'),
  marker: styler('marker'),
  mask: styler('mask'),
  metadata: styler('metadata'),
  mpath: styler('mpath'),
  path: styler('path'),
  pattern: styler('pattern'),
  polygon: styler('polygon'),
  polyline: styler('polyline'),
  radialGradient: styler('radialGradient'),
  rect: styler('rect'),
  stop: styler('stop'),
  switch: styler('switch'),
  symbol: styler('symbol'),
  text: styler('text'),
  textPath: styler('textPath'),
  tspan: styler('tspan'),
  use: styler('use'),
  view: styler('view'),
})

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
  const componentID = generateID(getComponentName(component))
  const styleClass = new StyleClass(componentID, [styles])

  const Component = component as any
  const WrappedStyledComponent = forwardRef<T, React.ComponentPropsWithoutRef<T>>((props, ref) => {
    const groupSheet = useStyleSheet()
    const className = styleClass.inject(groupSheet, props)
    return <Component {...props} className={`${componentID} ${className}`} ref={ref} />
  })

  WrappedStyledComponent.displayName = displayName

  return WrappedStyledComponent
}
