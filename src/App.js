import React from 'react';
import { ThemeProvider } from 'styled-components';
import GlobalStyles from './components/GlobalStyles';
import Header from './components/Header';
import Footer from './components/Footer';
import LandingPage from './LandingPage';

const theme = {
  colors: {
    primary: '#1a2b3c',
    accent: '#00e5ff',
    text: '#ffffff',
  },
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <Header />
      <LandingPage />
      <Footer />
    </ThemeProvider>
  );
}

export default App;

