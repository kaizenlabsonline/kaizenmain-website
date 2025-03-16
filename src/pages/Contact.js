import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useForm } from "react-hook-form";
import useWeb3Forms from "@web3forms/react";

const ContactSection = styled.section`
  position: relative;
  overflow: hidden;
  color: #e0f4ff;
  min-height: 100vh;
  display: flex;
  align-items: center;
`;

const ParticleBackground = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 60vh;
  z-index: 0;
`;

const ContactWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  position: relative;
  z-index: 2;
`;

const SectionTitle = styled(motion.h2)`
  font-size: 2.8rem;
  margin-bottom: 3rem;
  color: #00f7ff;
  text-shadow: 0 0 15px rgba(0, 247, 255, 0.4);
  position: relative;
  &::after {
    content: '';
    display: block;
    width: 60px;
    height: 3px;
    background: linear-gradient(90deg, #00f7ff, transparent);
    margin-top: 1rem;
  }
`;

const ContactForm = styled(motion.form)`
  display: grid;
  gap: 2rem;
  min-width: 600px;
  margin: 0 auto;
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem;
  background: rgba(0, 55, 110, 0.2);
  border: 1px solid rgba(0, 247, 255, 0.1);
  border-radius: 8px;
  color: #e0f4ff;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #00f7ff;
    box-shadow: 0 0 10px rgba(0, 247, 255, 0.3);
  }
`;

const TextArea = styled(Input).attrs({ as: 'textarea' })`
  resize: vertical;
  min-height: 150px;
`;

const SubmitButton = styled(motion.button)`
  background-color: rgba(0, 247, 255, 0.2);
  color: #00f7ff;
  padding: 1rem 2rem;
  border: 1px solid rgba(0, 247, 255, 0.3);
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: rgba(0, 247, 255, 0.3);
    box-shadow: 0 0 15px rgba(0, 247, 255, 0.4);
  }
`;

const ResultMessage = styled(motion.div)`
  margin-top: 2rem;
  text-align: center;
  color: ${props => props.isSuccess ? '#00f7ff' : '#ff4d4d'};
`;

const Contact = () => {
  const { register, reset, handleSubmit } = useForm();
  const [isSuccess, setIsSuccess] = useState(false);
  const [result, setResult] = useState(null);
  const canvasRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -200]);

  const accessKey = "89834c80-96b2-4cac-8e7e-674236ce9bba";

  const { submit: onSubmit } = useWeb3Forms({
    access_key: accessKey,
    settings: {
      from_name: "Kaizen Labs",
      subject: "New Message from Contact Form",
    },
    onSuccess: (msg, data) => {
      setIsSuccess(true);
      setResult(msg);
      reset();
    },
    onError: (msg, data) => {
      setIsSuccess(false);
      setResult(msg);
    },
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const particleCount = 1000;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 0.02 + 0.6,
        dx: (Math.random() - 0.5) * 0.5,
        dy: (Math.random() - 0.5) * 0.5
      });
    }

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight * 0.6; // Set canvas height to 60% of viewport height
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

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

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
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
    <ContactSection>
      <ParticleBackground ref={canvasRef} />
      <ContactWrapper>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <SectionTitle variants={itemVariants}>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.5 }}
            >
              Contact Us
            </motion.span>
          </SectionTitle>
          <ContactForm
            onSubmit={handleSubmit(onSubmit)}
            variants={containerVariants}
          >
            <Input
              type="text"
              required
              {...register("name", { required: true })}
              placeholder="Name"
              variants={itemVariants}
            />
            <Input
              type="email"
              required
              {...register("email", { required: true })}
              placeholder="Email"
              variants={itemVariants}
            />
            <TextArea
              required
              {...register("message", { required: true })}
              placeholder="Message"
              variants={itemVariants}
            />
            <SubmitButton
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              variants={itemVariants}
            >
              Send
            </SubmitButton>
          </ContactForm>
          {result && (
            <ResultMessage
              isSuccess={isSuccess}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {result}
            </ResultMessage>
          )}
        </motion.div>
      </ContactWrapper>
    </ContactSection>
  );
};

export default Contact;
