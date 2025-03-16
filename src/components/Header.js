import React from 'react';
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
`;

const Logo = styled(motion.div)`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${props => props.theme.colors.accent};
  background-image: url(${logoImg});
  height: 50px;
  width: 50px;
  background-size: cover;
`;

const LogoText = styled.p`
    margin-left: 4rem;
    margin-top: 0rem;
`;

const NavList = styled.ul`
  display: flex;
  list-style: none;
`;

const NavItem = styled.li`
  margin-left: 2rem;
  cursor: pointer;
`;

const NavLink = styled.a`
  color: ${props => props.theme.colors.text};
  text-decoration: none;
  transition: color 0.3s ease;

  &:hover {
    color: ${props => props.theme.colors.accent};
  }
`;

const Header = () => {

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
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
        <NavList>
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
