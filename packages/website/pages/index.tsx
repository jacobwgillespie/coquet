import {createGlobalStyle, styled} from 'coquet'

const GlobalStyle = createGlobalStyle`
h1 {
  color: ${(props) => props.color ?? 'green'};
}
`

const StyledP = styled.p`
  color: red;
  color: blue;
`

const Demo: React.FC<{name: string}> = ({name, ...rest}) => {
  return <p {...rest}>Hello {name}</p>
}

const StyledDemo = styled(Demo)`
  color: red;

  ${(props) => (props.name === 'world' ? 'color: purple;' : '')};

  & + & {
    color: green;
  }
`

export default function Home() {
  return (
    <div>
      <GlobalStyle color="red" />
      <h1>Hello World</h1>
      <StyledP>Hello world</StyledP>

      <StyledDemo name="world" />
      <StyledDemo name="there" />
    </div>
  )
}
