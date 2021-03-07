import {createGlobalStyle, css, styled} from 'coquet'

const boldAndRed = css`
  font-weight: bold;
  color: red;
`

const GlobalStyle = createGlobalStyle`
h1 {
  color: green;
}
`

const StyledP = styled.p`
  ${boldAndRed};
  font-family: monospace;
`

const Demo: React.FC<{name: string}> = ({name, ...rest}) => {
  return <p {...rest}>Hello {name}</p>
}

const StyledDemo = styled(Demo)`
  color: blue;
  font-family: monospace;
  font-weight: bold;
  color: green;

  &:hover {
    color: yellow;
  }

  @media (min-width: 600px) {
    color: blue;
    background: yellow;
  }
`

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
