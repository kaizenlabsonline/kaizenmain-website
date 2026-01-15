import React from 'react';
import { ThemeProvider } from 'styled-components';
import { Routes, Route } from 'react-router-dom';
import GlobalStyles from './components/GlobalStyles';
import Header from './components/Header';
import Footer from './components/Footer';
import LandingPage from './LandingPage';
import MP4ToPDF from './pages/MP4ToPDF';
import MotivMate from './pages/MotivMate';
import RandomPicker from './pages/RandomPicker';
import PlanningPoker from './pages/PlanningPoker';
import RetroBoard from './pages/RetroBoard';
import JsonSwissKnife from './pages/JsonSwissKnife';
import TimeZoneMap from './pages/TimeZoneMap';
import PomodoroTimer from './pages/PomodoroTimer';

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
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/mp4-to-pdf" element={<MP4ToPDF />} />
        <Route path="/random-picker" element={<RandomPicker />} />
        <Route path="/planning-poker" element={<PlanningPoker />} />
        <Route path="/retro-board" element={<RetroBoard />} />
        <Route path="/json-swiss-knife" element={<JsonSwissKnife />} />
        <Route path="/timezone-map" element={<TimeZoneMap />} />
        <Route path="/pomodoro-timer" element={<PomodoroTimer />} />
        <Route path="/motiv-mate" element={<MotivMate />} />
      </Routes>
      <Footer />
    </ThemeProvider>
  );
}

export default App;

