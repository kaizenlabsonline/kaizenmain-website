import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import logoImg from '../assets/kaizenLogoNew.png';
import { Link } from 'react-router-dom';

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

const LogoImg = styled.img`
  width: auto;
  height: 70px;
  background-size: cover;
  display: flex;
  align-items: center;
`;

const LogoText = styled.h3`
  margin-left: 1rem;
  margin-top: 1rem;
  font-size: 1rem;
  font-weight: 600;
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
  position: relative;
  
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

// Sub-navigation styles
const SubNavList = styled.ul`
  list-style: none;
  position: absolute;
  top: 100%;
  left: 0;
  background-color: #000011;
  padding: 0.5rem 0;
  display: none;
  flex-direction: column;
  min-width: 170px;
  border: 1px solid #333;
  z-index: 1001;

  ${NavItem}:hover & {
    display: flex;
  }

  @media (max-width: 768px) {
    position: relative;
    top: 0;
    border: none;
    display: ${props => (props.$isSubMenuOpen ? 'flex' : 'none')};
  }
`;

const SubNavItem = styled.li`
  padding: 0.5rem 1rem;
  cursor: pointer;

  &:hover {
    background-color: #111133;
  }
`;

const SubNavToggle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
  @media (min-width: 769px) {
    cursor: pointer;
  }
`;

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
      setIsSubMenuOpen(false);
    }
  };

  // Handle submenu toggle for mobile
  const handleSubNavClick = (e) => {
    // Only toggle on mobile
    if (window.innerWidth <= 768) {
      e.preventDefault();
      setIsSubMenuOpen((prev) => !prev);
    }
  };

  // Close submenu when menu closes (mobile)
  React.useEffect(() => {
    if (!isMenuOpen) setIsSubMenuOpen(false);
  }, [isMenuOpen]);

  return (
    <StyledHeader>
      <Nav>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <LogoImg src={logoImg} alt="KaizenLabs Logo" />
          <LogoText>KaizenLabs</LogoText>
        </Link>

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
            <NavLink onClick={() => scrollToSection('home')} href="/">Home</NavLink>
          </NavItem>
          <NavItem>
            <NavLink onClick={() => scrollToSection('about-us')}>About Us</NavLink>
          </NavItem>
          <NavItem>
            <NavLink onClick={() => scrollToSection('portfolio')}>Portfolio</NavLink>
          </NavItem>

          {/* Office Apps with Dropdown */}
          <NavItem
            onMouseEnter={() => window.innerWidth > 768 && setIsSubMenuOpen(true)}
            onMouseLeave={() => window.innerWidth > 768 && setIsSubMenuOpen(false)}
          >
            <SubNavToggle onClick={handleSubNavClick}>
              <span style={{ marginTop: '0', padding: '0.25rem 1rem', color: 'inherit' }}>Office apps ▾</span>
            </SubNavToggle>
            <SubNavList $isSubMenuOpen={isSubMenuOpen}>
              <SubNavItem>
                <Link to="/mp4-to-pdf" style={{ textDecoration: 'none', color: 'inherit' }} onClick={() => { setIsMenuOpen(false); setIsSubMenuOpen(false); }}>
                  MP4 to PDF
                </Link>
              </SubNavItem>
              <SubNavItem>
                <Link to="/random-picker" style={{ textDecoration: 'none', color: 'inherit' }} onClick={() => { setIsMenuOpen(false); setIsSubMenuOpen(false); }}>
                  Decision Spinner
                </Link>
              </SubNavItem>
              <SubNavItem>
                <Link to="/planning-poker" style={{ textDecoration: 'none', color: 'inherit' }} onClick={() => { setIsMenuOpen(false); setIsSubMenuOpen(false); }}>
                  Planning Poker
                </Link>
              </SubNavItem>
              <SubNavItem>
                <Link to="/retro-board" style={{ textDecoration: 'none', color: 'inherit' }} onClick={() => { setIsMenuOpen(false); setIsSubMenuOpen(false); }}>
                  Retro Board
                </Link>
              </SubNavItem>
              <SubNavItem>
                <Link to="/motiv-mate" style={{ textDecoration: 'none', color: 'inherit' }} onClick={() => { setIsMenuOpen(false); setIsSubMenuOpen(false); }}>
                  MotivMate
                </Link>
              </SubNavItem>
            </SubNavList>
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
