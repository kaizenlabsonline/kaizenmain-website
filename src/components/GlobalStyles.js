import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body {
    font-family: 'Arial', sans-serif;
    line-height: 1.6;
    color: ${props => props.theme.colors.text};
    background-color: ${props => props.theme.colors.primary};
    margin: 0;
    padding: 0;
  }

  h1, h2, h3 {
    margin-bottom: 1rem;
  }

  h1 {
    font-size: 3rem;
  }

  h2 {
    font-size: 2.5rem;
    text-align: center;
  }
`;

export default GlobalStyle;
