import React from 'react';
import styled from 'styled-components';
import { motion, useScroll, useTransform } from 'framer-motion';

const AboutUsSection = styled.section`
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #4A69BD, #F08A5D);
  color: white;
  padding: 6rem 0;
`;

const BackgroundShape = styled(motion.div)`
  position: absolute;
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 50%;
  z-index: 0;
`;

const AboutUsWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 4rem 2rem;
  position: relative;
  z-index: 1;
`;

const SectionTitle = styled(motion.h2)`
  font-size: 2.5rem;
  margin-bottom: 2rem;
`;

const Paragraph = styled(motion.p)`
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
`;

const SubTitle = styled(motion.h3)`
  font-size: 1.8rem;
  color: #00e5ff;
  margin-top: 2rem;
  margin-bottom: 1rem;
`;

const List = styled(motion.ul)`
  list-style-type: none;
  padding-left: 0;
`;

const ListItem = styled(motion.li)`
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
  padding-left: 1.5em;
  position: relative;
  
  &:before {
    content: "•";
    color: #00e5ff;
    font-weight: bold;
    position: absolute;
    left: 0;
  }
`;

const ImageContainer = styled(motion.div)`
  display: flex;
  justify-content: center;
  margin: 3rem 0;
`;

const AboutUsImage = styled(motion.img)`
  max-width: 80%;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
`;

const AboutUs = () => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        delay: 0.3
      }
    }
  };

  return (
    <AboutUsSection>
      {/* Background animated shapes */}
      <BackgroundShape 
        style={{ 
          top: '10%', 
          left: '5%', 
          width: '300px', 
          height: '300px',
          y
        }}
        animate={{ 
          x: [0, 20, 0], 
          y: [0, 30, 0],
          rotate: [0, 10, 0]
        }}
        transition={{ 
          repeat: Infinity, 
          duration: 20,
          ease: "easeInOut"
        }}
      />
      <BackgroundShape 
        style={{ 
          bottom: '10%', 
          right: '5%', 
          width: '250px', 
          height: '250px' 
        }}
        animate={{ 
          x: [0, -20, 0], 
          y: [0, -20, 0],
          rotate: [0, -10, 0]
        }}
        transition={{ 
          repeat: Infinity, 
          duration: 15,
          ease: "easeInOut"
        }}
      />
      
      <AboutUsWrapper>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          <SectionTitle variants={itemVariants}>About Us: Empowering Digital Excellence</SectionTitle>
          
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
