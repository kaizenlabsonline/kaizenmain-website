import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import logoImg from '../assets/KaizenLabsLogo.png';

const StyledHeader = styled.header`
  background-color: #000011;
  position: fixed;
  width: 100%;
  z-index: 1000;
`;

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 5%;
  position: relative;
`;

const Logo = styled(motion.div)`
  color: ${props => props.theme.colors.accent};
  background-image: url(${logoImg});
  height: 50px;
  width: 50px;
  background-size: cover;
  display: flex;
  align-items: center;
`;

const LogoText = styled.p`
  margin-left: 4rem;
  margin-top: 0;
  @media (max-width: 768px) {
    display: none;
  }
`;

const NavList = styled.ul`
  display: flex;
  list-style: none;
  transition: all 0.3s ease;
  
  @media (max-width: 768px) {
    position: absolute;
    top: 100%;
    right: 0;
    width: 100%;
    background-color: #000011;
    flex-direction: column;
    align-items: center;
    max-height: ${props => (props.$isMenuOpen ? '500px' : '0')};
    overflow: hidden;
    padding: ${props => (props.$isMenuOpen ? '1rem 0' : '0')};
  }
`;

const NavItem = styled.li`
  margin-left: 2rem;
  cursor: pointer;
  
  @media (max-width: 768px) {
    margin: 1rem 0;
    width: 100%;
    text-align: center;
  }
`;

const NavLink = styled.a`
  color: ${props => props.theme.colors.text};
  text-decoration: none;
  transition: color 0.3s ease;
  padding: 0.5rem 1rem;

  &:hover {
    color: ${props => props.theme.colors.accent};
  }

  @media (max-width: 768px) {
    width: 100%;
    display: block;
  }
`;

const Hamburger = styled.div`
  display: none;
  cursor: pointer;
  flex-direction: column;
  gap: 5px;
  
  @media (max-width: 768px) {
    display: flex;
  }

  span {
    width: 25px;
    height: 2px;
    background-color: ${props => props.theme.colors.text};
    transition: all 0.3s ease;
    transform-origin: left center;
    
    &:nth-child(1) {
      transform: ${props => props.$isMenuOpen ? 'rotate(45deg)' : 'none'};
    }
    
    &:nth-child(2) {
      opacity: ${props => props.$isMenuOpen ? '0' : '1'};
    }
    
    &:nth-child(3) {
      transform: ${props => props.$isMenuOpen ? 'rotate(-45deg)' : 'none'};
    }
  }
`;

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  return (
    <StyledHeader>
      <Nav>
        <Logo
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <LogoText>KaizenLabs</LogoText>
        </Logo>
        
        <Hamburger 
          $isMenuOpen={isMenuOpen} 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span />
          <span />
          <span />
        </Hamburger>

        <NavList $isMenuOpen={isMenuOpen}>
          <NavItem>
            <NavLink onClick={() => scrollToSection('home')}>Home</NavLink>
          </NavItem>
          <NavItem>
            <NavLink onClick={() => scrollToSection('about-us')}>About Us</NavLink>
          </NavItem>
          <NavItem>
            <NavLink onClick={() => scrollToSection('portfolio')}>Portfolio</NavLink>
          </NavItem>
          <NavItem>
            <NavLink onClick={() => scrollToSection('contact')}>Contact</NavLink>
          </NavItem>
        </NavList>
      </Nav>
    </StyledHeader>
  );
};

export default Header;
