import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

// Import your section components
import Home from './pages/Home';
import Services from './pages/Services';
import Portfolio from './pages/Portfolio';
import Contact from './pages/Contact';
import AboutUs from './pages/AboutUs';

const PageContainer = styled.div`
  overflow-x: hidden;
  position: relative;
`;


const Section = styled(motion.section)`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 2rem 0;
  position: relative;
`;

const NoSetHeightSection = styled(motion.section)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
`;

const AnimatedSection = ({ children, noHeightSet }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    noHeightSet ? <NoSetHeightSection
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8 }}
    >
      {children}
    </NoSetHeightSection> : <Section
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8 }}
    >
      {children}
    </Section>
  );
};


const LandingPage = () => {
  return (
    <PageContainer>
      <AnimatedSection>
        <Home />
      </AnimatedSection>
      <AnimatedSection>
        <AboutUs />
      </AnimatedSection>
      <AnimatedSection>
        <Services />
      </AnimatedSection>
      <AnimatedSection noHeightSet>
        <Portfolio />
      </AnimatedSection>
      <AnimatedSection noHeightSet>
        <Contact />
      </AnimatedSection>
    </PageContainer>
  );
};

export default LandingPage;
