import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import { motion, useScroll, useTransform } from 'framer-motion';

const PortfolioSection = styled.section`
  position: relative;
  overflow: hidden;
  color: #e0f4ff;
  min-height: 100vh;
  display: flex;
  align-items: center;
  background: #000011;
`;

const ParticleBackground = styled.canvas`
  position: absolute;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
`;

const PortfolioWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  position: relative;
  z-index: 2;
`;

const SectionTitle = styled(motion.h2)`
  font-size: 2.8rem;
  margin-bottom: 0;
  color: #00f7ff;
  text-shadow: 0 0 15px rgba(0, 247, 255, 0.4);
  position: relative;
  &::after {
    content: '';
    display: block;
    width: 60px;
    height: 3px;
    margin-top: 1rem;
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

  const clients = [
    'Co-op', 'AstraZeneca', '1Insurer', 'CPA', 'NAB',
    'Services Australia', 'Telstra', 'Manchester Airport Group', 'Co-op Digital',
  ];

  const drawRocket = (ctx, x, y, color) => {
    // Draw rocket body
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x - 15, y + 50);
    ctx.lineTo(x + 15, y + 50);
    ctx.closePath();
    ctx.fill();
  
    // Draw rocket tip
    ctx.fillStyle = '#ff6b6b';
    ctx.beginPath();
    ctx.moveTo(x, y - 20);
    ctx.lineTo(x - 10, y);
    ctx.lineTo(x + 10, y);
    ctx.closePath();
    ctx.fill();
  
    // Draw fins
    ctx.fillStyle = '#4a90e2';
    ctx.beginPath();
    ctx.moveTo(x - 15, y + 50);
    ctx.lineTo(x - 25, y + 70);
    ctx.lineTo(x - 15, y + 60);
    ctx.closePath();
    ctx.fill();
  
    ctx.beginPath();
    ctx.moveTo(x + 15, y + 50);
    ctx.lineTo(x + 25, y + 70);
    ctx.lineTo(x + 15, y + 60);
    ctx.closePath();
    ctx.fill();
  
    // Draw window
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(x, y + 20, 5, 0, Math.PI * 2);
    ctx.fill();
  
    // Draw smoke
    ctx.fillStyle = 'rgba(200, 200, 200, 0.5)';
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      ctx.arc(x + Math.random() * 10 - 5, y + 60 + Math.random() * 20, Math.random() * 5 + 2, 0, Math.PI * 2);
      ctx.fill();
    }
  };
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const particleCount = 500;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 0.02 + 0.6,
        dx: (Math.random() - 0.5) * 0.5,
        dy: (Math.random() - 0.5) * 0.5
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(particle => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'white';
        ctx.fill();

        particle.x += particle.dx;
        particle.y += particle.dy;

        if (particle.x < 0 || particle.x > canvas.width) particle.dx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.dy *= -1;
      });

      clients.forEach((client, index) => {
        const x = (canvas.width / (clients.length + 1)) * (index + 1);
        const y = canvas.height / 2 + Math.sin(Date.now() * 0.001 + index) * 30;
        drawRocket(ctx, x, y * 1.3, `hsl(${index * 40}, 70%, 50%)`);
        
        ctx.fillStyle = 'white';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(client, x, y + 80);
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [clients]);

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
      <PortfolioWrapper>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
        >
          <SectionTitle variants={itemVariants}>
            <StyledSpan
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.5 }}
            >
              Clients We've Worked With
            </StyledSpan>
          </SectionTitle>
        </motion.div>
      </PortfolioWrapper>
    </PortfolioSection>
  );
};

export default Portfolio;
