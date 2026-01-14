import React, { useRef, useEffect, useState, useMemo } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import Rocket3DScene from '../components/Rocket3DScene';

const PortfolioSection = styled.section`
  position: relative;
  overflow: hidden;
  color: #e0f4ff;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding-top: 100px;
  background: #000011;
  z-index: 1;
`;

// Space background canvas
const ParticleBackground = styled.canvas`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
`;

// Container for the 3D scene - absolutely positioned to cover the section
const SceneContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none; 
`;

// Container for the HTML labels overlay
const LabelContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); /* Centered relative to viewport, same as 3D origin */
  width: 100%;
  height: 100%; /* Matches SceneContainer height */
  pointer-events: none;
  z-index: 2;
  overflow: visible;
`;

const ClientLabel = styled(motion.div)`
  position: absolute;
  font-family: 'Arial', sans-serif;
  font-weight: bold;
  font-size: 1rem;
  color: #ffffff;
  text-shadow: 0 0 8px rgba(0,0,0,0.8), 0 0 15px ${props => props.color};
  white-space: nowrap;
  pointer-events: auto;
  cursor: default;
  transform: translate(-50%, 0); /* Center horizontally on the coordinate */
  text-align: center;
  top: 50%; /* Start at vertical center */
  
  display: flex;
  flex-direction: column;
  align-items: center;

  span {
    background: rgba(0,0,0,0.3);
    padding: 4px 12px;
    border-radius: 12px;
    backdrop-filter: blur(4px);
    border: 1px solid rgba(255,255,255,0.1);
  }
`;

const PortfolioWrapper = styled.div`
  position: relative;
  z-index: 2;
  text-align: center;
  margin-bottom: 2rem;
`;

const SectionTitle = styled(motion.h2)`
  font-size: 2.5rem;
  margin: 0;
  color: rgba(255, 255, 255, 0.95);
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  background: linear-gradient(to right, #ffffff, #a5f3fc);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  
  &::after {
    content: '';
    display: block;
    width: 100px;
    height: 3px;
    margin: 1rem auto 0;
    background: linear-gradient(90deg, transparent, #0ea5e9, transparent);
  }

  @media (max-width: 768px) {
    font-size: 1.8rem;
  }
`;

const Portfolio = () => {
  const canvasRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const clients = useMemo(() => [
    'Co-op', 'AstraZeneca', '1Insurer', 'CPA', 'NAB',
    'Services Australia', 'Telstra', 'Manchester Airport', 'Co-op Digital',
  ], []);

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

  // Calculate shared positions
  // We place rockets along X axis. 
  // 3D Scene (Orthographic, centered): 0 is center. width is canvas width.
  // HTML Overlay (centered container): 0 is center.

  const rocketData = useMemo(() => {
    if (!dimensions.width) return [];

    // Spread calculation
    // Limit total width to keep them readable even on ultra-wide screens, but ensure they fit on mobile
    const maxSpread = 1600;
    const spread = Math.min(dimensions.width * 0.85, maxSpread);

    const count = clients.length;
    // Calculate total width needed vs available
    const spacing = spread / (count);

    // Start from left side
    const startX = -(spread / 2) + (spacing / 2);

    return clients.map((name, i) => ({
      name,
      x: startX + (spacing * i),
      // Assign meaningful colors based on index or brand (simplified here)
      color: `hsl(${200 + i * 20}, 80%, 60%)`, // Blue/Cyan/Purple range
      index: i
    }));
  }, [dimensions.width, clients]);

  // Starfield effect (Legacy code kept for specific background requested)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const stars = Array.from({ length: 200 }).map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 1.5,
      speed: Math.random() * 0.5 + 0.1
    }));

    const animate = () => {
      ctx.fillStyle = '#000011';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      stars.forEach(star => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
        star.y += star.speed;
        if (star.y > canvas.height) {
          star.y = 0;
          star.x = Math.random() * canvas.width;
        }
      });
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <PortfolioSection>
      <ParticleBackground ref={canvasRef} />

      <PortfolioWrapper>
        <SectionTitle
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Our Clients
        </SectionTitle>
      </PortfolioWrapper>

      {/* 3D Scene Layer */}
      <SceneContainer>
        {dimensions.width > 0 && (
          <Canvas
            // Switch to Perspective Camera for more 3D depth, or stick to Orthographic for alignment.
            // Orthographic is easier for alignment.
            orthographic
            camera={{
              zoom: 40, // 40 pixels = 1 unit. This matches the division by 40 in the child.
              position: [0, 0, 100],
              left: -dimensions.width / 2,
              right: dimensions.width / 2,
              top: dimensions.height / 2,
              bottom: -dimensions.height / 2,
              near: 0.1,
              far: 1000
            }}
            shadows
            dpr={[1, 2]}
          >
            <Rocket3DScene clients={rocketData} dimensions={dimensions} />
          </Canvas>
        )}
      </SceneContainer>

      {/* HTML Label Layer */}
      <LabelContainer>
        {rocketData.map((data) => (
          <ClientLabel
            key={data.name}
            color={data.color}
            style={{
              left: `calc(50% + ${data.x}px)`, // Offset from center
            }}
            // Animate label to float BELOW the rocket
            // Rocket floats at Y=0 (center) +/- 8px
            // Label should be below that, e.g., +80px
            animate={{
              y: [70, 85, 70] // Float range
            }}
            transition={{
              duration: 2, // Must match rocket frequency? Rocket period is based on sin(t).
              // Actually hard to sync perfectly without shared state.
              // But a gentle float is fine even if not perfectly synced.
              repeat: Infinity,
              ease: "easeInOut",
              delay: data.index * 0.2
            }}
          >
            <span>{data.name}</span>
          </ClientLabel>
        ))}
      </LabelContainer>

    </PortfolioSection>
  );
};

export default Portfolio;
