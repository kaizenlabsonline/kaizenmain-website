import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion, useScroll, useTransform } from 'framer-motion';
import EnhancedRocket from '../components/EnhancedRocket';

const PortfolioSection = styled.section`
  position: relative;
  overflow: hidden;
  color: #e0f4ff;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #000011;
  z-index: 1;
`;

const ParticleBackground = styled.canvas`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
`;

const PortfolioWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 6rem 2rem 2rem;
  position: relative;
  z-index: 2;
  text-align: center;
`;

const SectionTitle = styled(motion.h2)`
  font-size: 2.2rem;
  margin: 0 0 3rem 0;
  color: rgba(255, 255, 255, 0.9);
  position: relative;
  display: inline-block;
  font-weight: 400;
  letter-spacing: 1px;
  text-transform: none;
  padding: 0;
  text-shadow: none;
  font-family: 'Arial', sans-serif;
  
  &::after {
    content: '';
    display: block;
    width: 80px;
    height: 1px;
    margin: 1rem auto 0;
    background: rgba(255, 255, 255, 0.6);
    box-shadow: none;
  }
  
  @media (max-width: 768px) {
    font-size: 1.8rem;
    margin-bottom: 2.5rem;
    letter-spacing: 0.5px;
  }
`;

const StyledSpan = styled(motion.span)`
  position: relative;
  top: -13rem;
`;

const Portfolio = () => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const canvasRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [rocketPositions, setRocketPositions] = useState([]);

  const clients = [
    'Co-op', 'AstraZeneca', '1Insurer', 'CPA', 'NAB',
    'Services Australia', 'Telstra', 'Manchester Airport Group', 'Co-op Digital',
  ];

  // Update dimensions on resize
  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Update rocket positions
  useEffect(() => {
    const updateRocketPositions = () => {
      const newPositions = clients.map((_, index) => {
        // Increase spacing between rockets and adjust vertical position
        const x = (dimensions.width / (clients.length * 0.8)) * (index + 0.5);
        const y = dimensions.height / 1.8 + Math.sin(Date.now() * 0.001 + index) * 20;
        return { x, y };
      });
      setRocketPositions(newPositions);

      if (dimensions.width > 0 && dimensions.height > 0) {
        requestAnimationFrame(updateRocketPositions);
      }
    };

    if (dimensions.width > 0 && dimensions.height > 0) {
      updateRocketPositions();
    }
  }, [dimensions, clients]);
  // Starfield effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Create stars
    const stars = [];
    const starCount = 200;

    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.5,
        speed: Math.random() * 0.5 + 0.1
      });
    }

    // Animation loop
    const animate = () => {
      ctx.fillStyle = '#000011';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw stars
      ctx.fillStyle = 'white';
      stars.forEach(star => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();

        // Move stars
        star.y += star.speed;
        if (star.y > canvas.height) {
          star.y = 0;
          star.x = Math.random() * canvas.width;
        }
      });

      // Add some twinkling effect
      if (Math.random() > 0.9) {
        const twinkleStar = stars[Math.floor(Math.random() * stars.length)];
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.beginPath();
        ctx.arc(twinkleStar.x, twinkleStar.y, twinkleStar.size * 1.5, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100
      }
    }
  };

  return (
    <PortfolioSection>
      <ParticleBackground ref={canvasRef} />
      
      {/* Render enhanced rockets */}
      {rocketPositions.map((pos, index) => (
        <EnhancedRocket
          key={clients[index]}
          x={pos.x}
          y={pos.y}
          color={`hsl(${index * 40}, 70%, 50%)`}
          clientName={clients[index]}
          index={index}
        />
      ))}
      
      <PortfolioWrapper>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
        >
          <SectionTitle variants={itemVariants}>
            <StyledSpan
              style={{ y }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Our Clients
            </StyledSpan>
          </SectionTitle>
        </motion.div>
      </PortfolioWrapper>
    </PortfolioSection>
  );
};

export default Portfolio;
