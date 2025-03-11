import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import homePageGif from '../assets/homepage.gif';

const ServicesSection = styled.section`
  padding: 5rem 5%;
  height: 80vh;
  position: relative;
  overflow: hidden;
`;

const ServiceBubble = styled(motion.div)`
  background-color: rgba(0, 184, 204, 0.7);
  color: white;
  border-radius: 50%;
  padding: 10px;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: 0.6rem;
  position: absolute;
  cursor: grab;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(5px);
  z-index: 2;
`;

const ServiceImage = styled(motion.img)`
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  left: 0;
  top: 0;
  opacity: 0.3;
  z-index: 1;
`;

const bubbleVariants = {
  initial: { 
    opacity: 0, 
    scale: 0,
    y: 50
  },
  animate: { 
    opacity: 1, 
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 10,
      duration: 1
    }
  },
  hover: {
    y: -10,
    transition: {
      yoyo: Infinity,
      duration: 0.5
    }
  }
};

const Services = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    if (inView) {
      controls.start("animate");
    }
  }, [controls, inView]);

  const services = [
    "Agile Training",
    "Agile coaching",
    "Project Management",
    "Scrum Mastery",
    "Product Ownership",
    "Product Development",
    "Front-end development",
    "Web Development",
    "Quality Assurance",
    "User Testing",
    "Freelance Services",
    "On/Off-site projects"
  ];

  const [positions, setPositions] = useState(services.map(() => ({
    x: Math.random() * 80 + 10,
    y: Math.random() * 70 + 15,
  })));

  const handleDragEnd = (info, index) => {
    const newPositions = [...positions];
    newPositions[index] = { 
      x: (info.point.x / window.innerWidth) * 100,
      y: (info.point.y / window.innerHeight) * 100
    };
    setPositions(newPositions);
  };

  return (
    <ServicesSection ref={ref}>
      <h2 style={{ position: 'relative', zIndex: 3 }}>Our Services</h2>
      <ServiceImage 
        src={homePageGif}
        alt="Our Services"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 0.5 }}
      />
      {services.map((service, index) => (
        <ServiceBubble
          key={index}
          variants={bubbleVariants}
          initial="initial"
          animate={controls}
          whileHover="hover"
          drag
          dragMomentum={false}
        //   onDragEnd={(_, info) => handleDragEnd(info, index)}
          style={{
            left: `${positions[index].x}%`,
            top: `${positions[index].y}%`,
          }}
        >
          {service}
        </ServiceBubble>
      ))}
    </ServicesSection>
  );
};

export default Services;
