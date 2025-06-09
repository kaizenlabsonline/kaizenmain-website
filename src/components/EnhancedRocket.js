import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const EnhancedRocket = ({ x, y, color, clientName, index }) => {
  const canvasRef = useRef(null);

  // Rocket designs - different for each client
  const rocketDesigns = [
    // Traditional rocket
    {
      bodyColor: '#4a90e2',
      windowColor: '#e0f4ff',
      finColor: '#2c5282',
      noseConeColor: '#ff6b6b',
      exhaustColors: ['#ff9a44', '#ff6b6b', '#ff3e3e']
    },
    // Space shuttle
    {
      bodyColor: '#9f7aea',
      windowColor: '#e0f4ff',
      finColor: '#553c9a',
      noseConeColor: '#d6bcfa',
      exhaustColors: ['#ff9a44', '#ff6b6b', '#ff3e3e']
    },
    // Satellite
    {
      bodyColor: '#48bb78',
      windowColor: '#e0f4ff',
      finColor: '#2f855a',
      noseConeColor: '#9ae6b4',
      exhaustColors: ['#68d391', '#48bb78', '#38a169']
    },
    // Futuristic rocket
    {
      bodyColor: '#4299e1',
      windowColor: '#e0f4ff',
      finColor: '#2b6cb0',
      noseConeColor: '#90cdf4',
      exhaustColors: ['#63b3ed', '#4299e1', '#3182ce']
    },
    // Classic rocket
    {
      bodyColor: '#e53e3e',
      windowColor: '#e0f4ff',
      finColor: '#c53030',
      noseConeColor: '#feb2b2',
      exhaustColors: ['#fc8181', '#f56565', '#e53e3e']
    },
    // Advanced space vehicle
    {
      bodyColor: '#805ad5',
      windowColor: '#e0f4ff',
      finColor: '#6b46c1',
      noseConeColor: '#d6bcfa',
      exhaustColors: ['#9f7aea', '#805ad5', '#6b46c1']
    },
    // Modern rocket
    {
      bodyColor: '#38b2ac',
      windowColor: '#e0f4ff',
      finColor: '#2c7a7b',
      noseConeColor: '#81e6d9',
      exhaustColors: ['#4fd1c5', '#38b2ac', '#319795']
    },
    // Experimental craft
    {
      bodyColor: '#ed8936',
      windowColor: '#e0f4ff',
      finColor: '#c05621',
      noseConeColor: '#fbd38d',
      exhaustColors: ['#f6ad55', '#ed8936', '#dd6b20']
    },
    // Deep space explorer
    {
      bodyColor: '#667eea',
      windowColor: '#e0f4ff',
      finColor: '#5a67d8',
      noseConeColor: '#a3bffa',
      exhaustColors: ['#7f9cf5', '#667eea', '#5a67d8']
    }
  ];

  const design = rocketDesigns[index % rocketDesigns.length];
  const scale = 1.2; // Increased scale factor for larger rockets

  const [flameIntensity, setFlameIntensity] = useState(0);
  const [rocketRotation, setRocketRotation] = useState(0);
  const [particles, setParticles] = useState([]);
  
  // Update flame intensity for effect
  useEffect(() => {
    const interval = setInterval(() => {
      setFlameIntensity(Math.random() * 15 + 15);
    }, 100);
    return () => clearInterval(interval);
  }, []);
  
  // Update rocket rotation based on movement
  useEffect(() => {
    const interval = setInterval(() => {
      // Slight rotation based on time for subtle movement
      setRocketRotation(Math.sin(Date.now() * 0.002 + index) * 0.05);
    }, 16);
    return () => clearInterval(interval);
  }, [index]);
  
  // Particle effect for exhaust
  useEffect(() => {
    const interval = setInterval(() => {
      setParticles(prev => [
        ...prev.slice(-20), // Keep only last 20 particles
        {
          x: 0,
          y: 40 * scale,
          size: Math.random() * 3 + 1,
          opacity: Math.random() * 0.5 + 0.3,
          speed: Math.random() * 2 + 1,
          angle: (Math.random() - 0.5) * Math.PI * 0.5
        }
      ]);
    }, 50);
    
    return () => clearInterval(interval);
  }, [scale]);
  
  // Update particles
  useEffect(() => {
    const updateParticles = () => {
      setParticles(prev => 
        prev
          .map(p => ({
            ...p,
            x: p.x + Math.sin(p.angle) * p.speed,
            y: p.y + Math.cos(p.angle) * p.speed * 0.5 + 1,
            opacity: p.opacity - 0.01,
            size: p.size * 0.99
          }))
          .filter(p => p.opacity > 0.05 && p.size > 0.1)
      );
    };
    
    const animationFrame = requestAnimationFrame(updateParticles);
    return () => cancelAnimationFrame(animationFrame);
  }, [particles]);
  
  // Draw the rocket
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Set canvas size to match parent
    canvas.width = 300;
    canvas.height = 500;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Save the current context state
    ctx.save();
    
    // Move to the rocket's position
    ctx.translate(canvas.width / 2, canvas.height / 2);
    
    // Apply rotation
    ctx.rotate(rocketRotation);
    
    // Draw rocket body
    const bodyWidth = 30 * scale;
    const bodyHeight = 80 * scale;
    
    // Draw exhaust particles
    particles.forEach(particle => {
      ctx.save();
      ctx.translate(particle.x, particle.y);
      
      const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, particle.size * 2);
      gradient.addColorStop(0, `rgba(255, 160, 60, ${particle.opacity})`);
      gradient.addColorStop(1, `rgba(255, 80, 80, 0)`);
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(0, 0, particle.size * 2, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.restore();
    });
    
    // Draw exhaust flame
    const flameHeight = flameIntensity * scale;
    const flameWidth = bodyWidth * 0.7;
    
    // Gradient for flame
    const flameGradient = ctx.createLinearGradient(0, bodyHeight/2, 0, bodyHeight/2 + flameHeight);
    design.exhaustColors.forEach((color, i) => {
      flameGradient.addColorStop(i / (design.exhaustColors.length - 1), color);
    });
    
    // Draw flame with pulsing effect
    ctx.save();
    const pulse = 1 + Math.sin(Date.now() * 0.01) * 0.1;
    ctx.scale(pulse, 1);
    
    ctx.beginPath();
    ctx.moveTo(-flameWidth/2, bodyHeight/2);
    ctx.quadraticCurveTo(0, bodyHeight/2 + flameHeight, flameWidth/2, bodyHeight/2);
    ctx.fillStyle = flameGradient;
    ctx.globalAlpha = 0.8;
    ctx.fill();
    ctx.restore();
    
    // Reset alpha
    ctx.globalAlpha = 1.0;
    
    // Draw rocket body with gradient
    const bodyGradient = ctx.createLinearGradient(0, -bodyHeight/2, 0, bodyHeight/2);
    bodyGradient.addColorStop(0, design.noseConeColor);
    bodyGradient.addColorStop(0.2, design.bodyColor);
    bodyGradient.addColorStop(1, design.finColor);
    
    ctx.fillStyle = bodyGradient;
    ctx.beginPath();
    ctx.roundRect(-bodyWidth/2, -bodyHeight/2, bodyWidth, bodyHeight, 5);
    ctx.fill();
    
    // Draw nose cone
    const noseGradient = ctx.createLinearGradient(0, -bodyHeight/2 - 20 * scale, 0, -bodyHeight/2);
    noseGradient.addColorStop(0, design.noseConeColor);
    noseGradient.addColorStop(1, design.bodyColor);
    
    ctx.fillStyle = noseGradient;
    ctx.beginPath();
    ctx.moveTo(-bodyWidth/2, -bodyHeight/2);
    ctx.lineTo(0, -bodyHeight/2 - 20 * scale);
    ctx.lineTo(bodyWidth/2, -bodyHeight/2);
    ctx.closePath();
    ctx.fill();
    
    // Draw window with reflection
    ctx.fillStyle = design.windowColor;
    ctx.beginPath();
    ctx.arc(0, -bodyHeight/6, 8 * scale, 0, Math.PI * 2);
    ctx.fill();
    
    // Add window highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.beginPath();
    ctx.arc(-2 * scale, -bodyHeight/6 - 2 * scale, 3 * scale, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw fins with gradient
    const finWidth = 20 * scale;
    const finHeight = 30 * scale;
    
    // Left fin
    const leftFinGradient = ctx.createLinearGradient(
      -bodyWidth/2 - finWidth, bodyHeight/4 + finHeight,
      -bodyWidth/2, bodyHeight/4
    );
    leftFinGradient.addColorStop(0, design.finColor);
    leftFinGradient.addColorStop(1, design.bodyColor);
    
    ctx.fillStyle = leftFinGradient;
    ctx.beginPath();
    ctx.moveTo(-bodyWidth/2, bodyHeight/4);
    ctx.lineTo(-bodyWidth/2 - finWidth, bodyHeight/4 + finHeight);
    ctx.lineTo(-bodyWidth/2, bodyHeight/4 + finHeight - 10 * scale);
    ctx.closePath();
    ctx.fill();
    
    // Right fin
    const rightFinGradient = ctx.createLinearGradient(
      bodyWidth/2 + finWidth, bodyHeight/4 + finHeight,
      bodyWidth/2, bodyHeight/4
    );
    rightFinGradient.addColorStop(0, design.finColor);
    rightFinGradient.addColorStop(1, design.bodyColor);
    
    ctx.fillStyle = rightFinGradient;
    ctx.beginPath();
    ctx.moveTo(bodyWidth/2, bodyHeight/4);
    ctx.lineTo(bodyWidth/2 + finWidth, bodyHeight/4 + finHeight);
    ctx.lineTo(bodyWidth/2, bodyHeight/4 + finHeight - 10 * scale);
    ctx.closePath();
    ctx.fill();
    
    // Draw decorative stripes
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 2 * scale;
    
    for (let i = 1; i <= 3; i++) {
      const yPos = -bodyHeight/2 + (i * bodyHeight/4);
      ctx.beginPath();
      ctx.moveTo(-bodyWidth/2 + 5 * scale, yPos);
      ctx.lineTo(bodyWidth/2 - 5 * scale, yPos);
      ctx.stroke();
    }
    
    // Draw client name with glow effect
    ctx.shadowColor = 'rgba(255, 255, 255, 0.7)';
    ctx.shadowBlur = 10;
    ctx.fillStyle = 'white';
    ctx.font = `bold ${14 * scale}px 'Arial', sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    // Increase font size and adjust positioning for better visibility
    const fontSize = 18 * scale;
    ctx.font = `bold ${fontSize}px 'Arial', sans-serif`;
    ctx.fillText(clientName, 0, bodyHeight/2 + 25 * scale);
    ctx.shadowBlur = 0;
    
    // Restore the context state
    ctx.restore();
    
  }, [x, y, design, clientName, scale, flameIntensity, rocketRotation, particles]);

  return (
    <motion.div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
        zIndex: 10,
      }}
      animate={{
        y: [null, -5, 0],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        repeatType: 'reverse',
        ease: 'easeInOut'
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          width: '200px',
          height: '350px',
        }}
        width={300}
        height={500}
      />
    </motion.div>
  );
};

export default EnhancedRocket;
