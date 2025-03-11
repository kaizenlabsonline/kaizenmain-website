import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import portfolioImg from '../assets/portfolio.gif';

const PortfolioSection = styled.section`
  padding: 4rem 10%;
  background: linear-gradient(135deg, #4A69BD, #F08A5D);
  color: white;
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 3rem;
`;

const PortfolioGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;
`;

const PortfolioItem = styled(motion.div)`
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  position: relative;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
`;

const PortfolioImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const PortfolioTitle = styled.h3`
  padding: 1rem;
  text-align: center;
`;

const PortfolioDetails = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const ClientsSection = styled.div`
  margin-top: 4rem;
`;

const ClientsTitle = styled.h2`
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 2rem;
`;

const ClientsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ClientsList = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
`;

const ClientItem = styled(motion.div)`
  background-color: rgba(255, 255, 255, 0.2);
  padding: 1.5rem;
  border-radius: 10px;
  text-align: center;
  font-size: 1.2rem;
  font-weight: 500;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const IllustrationContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Illustration = styled(motion.img)`
  max-width: 100%;
  height: auto;
  border-radius: 10px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
`;

const portfolioVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const detailsVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const clientVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
    },
  }),
};

const illustrationVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: 0.8,
      delay: 0.3,
    }
  },
};

const Portfolio = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const projects = [
    { title: 'E-Commerce Platform', image: 'https://via.placeholder.com/300x200', description: 'A fully responsive online store with integrated payment processing' },
    { title: 'Corporate Website', image: 'https://via.placeholder.com/300x200', description: 'Modern web presence for a Fortune 500 company' },
    { title: 'Mobile Application', image: 'https://via.placeholder.com/300x200', description: 'Cross-platform app with real-time data synchronization' },
  ];

  const clients = [
    'Co-op',
    'AstraZeneca',
    '1Insurer',
    'CPA',
    'NAB',
    'Services Australia',
    'Telstra',
    'Manchester Airport Group',
    'Co-op Digital',
  ];

  return (
    <PortfolioSection>
      {/* <SectionTitle>Our Work</SectionTitle>
      <PortfolioGrid>
        {projects.map((project, index) => (
          <PortfolioItem
            key={index}
            variants={portfolioVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5, delay: index * 0.2 }}
            onHoverStart={() => setHoveredIndex(index)}
            onHoverEnd={() => setHoveredIndex(null)}
          >
            <PortfolioImage src={project.image} alt={project.title} />
            <PortfolioTitle>{project.title}</PortfolioTitle>
            <AnimatePresence>
              {hoveredIndex === index && (
                <PortfolioDetails
                  variants={detailsVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                >
                  <h4>{project.title}</h4>
                  <p>{project.description}</p>
                </PortfolioDetails>
              )}
            </AnimatePresence>
          </PortfolioItem>
        ))}
      </PortfolioGrid> */}
      
      <ClientsSection>
        <ClientsTitle>Clients We've Worked With</ClientsTitle>
        <ClientsContainer>
          <ClientsList>
            {clients.map((client, index) => (
              <ClientItem
                key={index}
                custom={index}
                variants={clientVariants}
                initial="hidden"
                animate="visible"
              >
                {client}
              </ClientItem>
            ))}
          </ClientsList>
          <IllustrationContainer>
            <Illustration 
              src={portfolioImg}
              alt="Web Development Illustration"
              variants={illustrationVariants}
              initial="hidden"
              animate="visible"
            />
          </IllustrationContainer>
        </ClientsContainer>
      </ClientsSection>
    </PortfolioSection>
  );
};

export default Portfolio;
