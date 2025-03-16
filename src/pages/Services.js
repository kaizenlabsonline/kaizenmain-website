import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';

const GameSection = styled.section`
  background: linear-gradient(179deg, #070d25, #020210);
  color: #e0f4ff;
  padding: 2rem;
  height: 80vh;
  position: relative;
  overflow: hidden;
`;

const GameArea = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;

const Canvas = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
`;

const ResetButton = styled.button`
  background-color: rgba(0, 247, 255, 0.2);
  color: #00f7ff;
  border: 1px solid #00f7ff;
  padding: 10px 20px;
  font-size: 1rem;
  cursor: pointer;
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 10;
  &:hover {
    background-color: rgba(0, 247, 255, 0.4);
  }
`;

const Services = () => {
  const canvasRef = useRef(null);
  const [services, setServices] = useState([
    "Agile Training", "Agile coaching", "Project Management", "Scrum Mastery",
    "Product Ownership", "Product Development", "Front-end development", "Web Development",
    "Quality Assurance", "User Testing", "Freelance Services", "On/Off-site projects"
  ]);

  const resetGame = () => {
    setServices([
      "Agile Training", "Agile coaching", "Project Management", "Scrum Mastery",
      "Product Ownership", "Product Development", "Front-end development", "Web Development",
      "Quality Assurance", "User Testing", "Freelance Services", "On/Off-site projects"
    ]);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const bubbles = services.map((service, index) => ({
      x: canvas.width + index * 200,
      y: canvas.height / 2 + Math.sin(index) * 50,
      text: service,
      collected: false
    }));

    const drawBubble = (bubble) => {
      ctx.beginPath();
      ctx.arc(bubble.x, bubble.y, 40, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 247, 255, 0.2)';
      ctx.fill();
      ctx.strokeStyle = '#00f7ff';
      ctx.stroke();
      ctx.fillStyle = '#00f7ff';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(bubble.text, bubble.x, bubble.y);
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      bubbles.forEach((bubble, index) => {
        if (!bubble.collected) {
          bubble.x -= 1;
          bubble.y = canvas.height / 2 + Math.sin(bubble.x * 0.02) * 50;
          if (bubble.x < -100) bubble.x = canvas.width + 100;
          drawBubble(bubble);
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [services]);

  return (
    <GameSection>
      <GameArea>
        <Canvas ref={canvasRef} />
        <ResetButton onClick={resetGame}>Reset</ResetButton>
      </GameArea>
    </GameSection>
  );
};

export default Services;
