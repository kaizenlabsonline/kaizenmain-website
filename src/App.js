// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { ThemeProvider } from 'styled-components';
// import GlobalStyles from './components/GlobalStyles';
// import Header from './components/Header';
// import Home from './pages/Home';
// import Services from './pages/Services';
// import Portfolio from './pages/Portfolio';
// import Contact from './pages/Contact';

// const theme = {
//   colors: {
//     primary: '#1a2b3c',
//     accent: '#00e5ff',
//     text: '#ffffff',
//   },
// };

// function App() {
//   return (
//     <ThemeProvider theme={theme}>
//       <Router>
//         <GlobalStyles />
//         <Header />
//         <Routes>
//           <Route exact path="/" element={<Home />} />
//           <Route path="/services" element={<Services />} />
//           <Route path="/portfolio" element={<Portfolio />} />
//           <Route path="/contact" element={<Contact />} />
//         </Routes>
//       </Router>
//     </ThemeProvider>
//   );
// }

// export default App;
import React from 'react';
import { ThemeProvider } from 'styled-components';
import GlobalStyles from './components/GlobalStyles';
import Header from './components/Header';
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
    </ThemeProvider>
  );
}

export default App;

