import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import landingPageGif from '../assets/landingPage.gif'; // Import your GIF file

const HomeWrapper = styled.div`
  position: relative;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`;

const BackgroundGif = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url(${landingPageGif});
  background-position: center;
  background-repeat: no-repeat;
  opacity: 0.7;
  z-index: -1;
`;

const HomeContent = styled.div`
  text-align: center;
  position: relative;
  z-index: 1;
  padding: 2rem;
  color: white; // Ensure text is visible against the background
`;

const Title = styled(motion.h1)`
  font-size: 3rem;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.5); // Add shadow for better readability
`;

const Subtitle = styled(motion.p)`
  font-size: 1.2rem;
  margin-bottom: 2rem;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.5); // Add shadow for better readability
`;

const CTAButton = styled(motion.button)`
  background-color: ${props => props.theme.colors.accent};
  color: ${props => props.theme.colors.primary};
  padding: 0.8rem 2rem;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #00b8cc;
  }
`;

const Home = () => {
  return (
    <HomeWrapper>
      <BackgroundGif />
      <HomeContent>
        <Title>Elevate Your Digital Presence</Title>
        <Subtitle>Expert web development and project management solutions</Subtitle>
        <CTAButton
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Get Started
        </CTAButton>
      </HomeContent>
    </HomeWrapper>
  );
};

export default Home;