import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const AboutUsSection = styled.section`
  position: relative;
  overflow: hidden;
  color: #e0f4ff;
  display: flex;
  align-items: center;
  -webkit-overflow-scrolling: touch;
  overflow-y: scroll;
`;

const ParticleBackground = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
`;

const AboutUsWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  position: relative;
  z-index: 2;
`;

const SectionTitle = styled(motion.h2)`
  font-size: 2.8rem;
  margin-bottom: 3rem;
  color: #e0f4ff;
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

const Paragraph = styled(motion.p)`
  font-size: 1.1rem;
  line-height: 1.8;
  margin-bottom: 2rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

const SubTitle = styled(motion.h3)`
  font-size: 1.8rem;
  color: #e0f4ff;
  margin: 3rem 0 1.5rem;
  position: relative;
  padding-left: 1.2rem;
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 6px;
    height: 80%;
    border-radius: 3px;
  }
`;

const List = styled(motion.ul)`
  list-style-type: none;
  padding-left: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin: 2rem 0;
`;

const ListItem = styled(motion.li)`
  font-size: 1.1rem;
  padding: 1.5rem;
  background: rgba(0, 55, 110, 0.2);
  border-radius: 8px;
  border: 1px solid rgba(0, 247, 255, 0.1);
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(0, 55, 110, 0.4);
    transform: translateY(-3px);
    box-shadow: 0 4px 15px rgba(0, 247, 255, 0.1);
  }

  &::before {
    content: '▹';
    color: #00f7ff;
    margin-right: 0.8rem;
  }
`;

const GlowOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const AboutUs = () => {
  const canvasRef = useRef(null);

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
    <AboutUsSection>
      <ParticleBackground ref={canvasRef} />
      <GlowOverlay />
      <AboutUsWrapper>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true}}
        >
          <SectionTitle variants={itemVariants}>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.5 }}
            >
              Pioneering Digital Evolution
            </motion.span>
          </SectionTitle>
          
          <Paragraph variants={itemVariants}>
            At KaizenLabs, we're not just another IT consultancy – we're your partners in digital transformation. Born from a passion for continuous improvement, our name embodies the Japanese philosophy of "Kaizen" – small, incremental changes that lead to significant results.
          </Paragraph>
          
          <Paragraph variants={itemVariants}>
            We may be small, but we're a powerhouse of expertise and innovation. Our team of seasoned professionals brings a wealth of experience across a spectrum of IT services, ready to tackle your most complex challenges with agility and precision.
          </Paragraph>

          <SubTitle variants={itemVariants}>Our Ethos: Small Changes, Big Impact</SubTitle>
          
          <Paragraph variants={itemVariants}>
            In the ever-evolving landscape of technology, we believe that true success lies in the ability to adapt, learn, and grow continuously. This philosophy isn't just a part of our name – it's woven into the fabric of everything we do. From agile methodologies to cutting-edge development practices, we're committed to staying at the forefront of industry trends to deliver unparalleled value to our clients.
          </Paragraph>

          <SubTitle variants={itemVariants}>Services: Comprehensive Solutions for Digital Success</SubTitle>
          
          <Paragraph variants={itemVariants}>
            Our service portfolio is as diverse as it is deep, covering every aspect of your digital journey:
          </Paragraph>

          <List variants={containerVariants}>
            <ListItem variants={itemVariants}>Agile Mastery: From Scrum and Kanban training to SAFe agile coaching, we'll transform your team into an agile powerhouse.</ListItem>
            <ListItem variants={itemVariants}>Project Excellence: With our expertise in Agile Program and Project Management, we ensure your initiatives are delivered on time and on budget.</ListItem>
            <ListItem variants={itemVariants}>Product Innovation: Our Product Ownership and Development services help you bring your vision to life, from concept to market-ready solutions.</ListItem>
            <ListItem variants={itemVariants}>Development Prowess: Whether it's Front-end, Web Development, or full-stack solutions, we craft digital experiences that captivate and convert.</ListItem>
            <ListItem variants={itemVariants}>Quality Assurance: Our rigorous QA and User Testing processes ensure your products are not just functional, but flawless.</ListItem>
            <ListItem variants={itemVariants}>Flexible Engagement: From Freelance Services to full-scale on-site and off-site projects, we adapt to your needs and work style.</ListItem>
          </List>

          <SubTitle variants={itemVariants}>Why Choose KaizenLabs?</SubTitle>

          <List variants={containerVariants}>
            <ListItem variants={itemVariants}>Tailored Excellence: We don't believe in one-size-fits-all. Each solution is crafted to your unique needs and challenges.</ListItem>
            <ListItem variants={itemVariants}>Continuous Innovation: Our commitment to ongoing learning means you always get cutting-edge solutions.</ListItem>
            <ListItem variants={itemVariants}>Agile Mindset: We're quick, adaptable, and always focused on delivering value.</ListItem>
            <ListItem variants={itemVariants}>Holistic Approach: From strategy to execution, we cover all bases of your digital transformation journey.</ListItem>
            <ListItem variants={itemVariants}>Passionate Experts: Our team doesn't just work in tech – we live and breathe it.</ListItem>
          </List>

          <SubTitle variants={itemVariants}>Let's Elevate Your Digital Presence Together</SubTitle>
          
          <Paragraph variants={itemVariants}>
            Ready to unlock your digital potential? Whether you're a startup looking to disrupt the market or an established enterprise aiming to stay ahead of the curve, KaizenLabs is your catalyst for digital excellence.
          </Paragraph>
          
          <Paragraph variants={itemVariants}>
            Don't just adapt to the digital future – shape it with KaizenLabs. Reach out through our contact form, and let's embark on a journey of continuous improvement and digital transformation. Your success story starts with a conversation – let's write it together.
          </Paragraph>
        </motion.div>
      </AboutUsWrapper>
    </AboutUsSection>
  );
};

export default AboutUs;
