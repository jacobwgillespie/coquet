import {createGlobalStyle, createStyledComponent} from 'coquet'

const GlobalStyle = createGlobalStyle(`
h1 {
  color: green;
}
`)

const StyledP = createStyledComponent('p', [
  `
color: red;
`,
  () => 'font-weight: bold;',
  {fontFamily: 'monospace'},
])

const Demo: React.FC<{name: string}> = ({name, ...rest}) => {
  return <p {...rest}>Hello {name}</p>
}

const StyledDemo = createStyledComponent(Demo, `color: blue`)

export default function Home() {
  return (
    <div>
      <GlobalStyle />
      <h1>Hello World</h1>
      <StyledP>Hello world</StyledP>

      <StyledDemo name="world" />
      <StyledDemo name="there" />
    </div>
  )
}
