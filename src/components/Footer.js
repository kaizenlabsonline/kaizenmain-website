import React from 'react';
import styled from 'styled-components';

const FooterSection = styled.footer`
  color: white;
  padding: 2rem 10%;
  text-align: center;
`;

const FooterContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SocialLinks = styled.div`
  margin-top: 1rem;
  display: flex;
  gap: 1rem;
`;

const SocialLink = styled.a`
  color: white;
  text-decoration: none;
  transition: color 0.3s ease;

  &:hover {
    color: #00e5ff;
  }
`;

const Footer = () => {
  return (
    <FooterSection>
      <FooterContainer>
        <p>&copy; 2025 KaizenLabs. All rights reserved.</p>
        <SocialLinks>
          <SocialLink href="https://www.linkedin.com/company/kaizen-labs-pty-ltd" target="_blank" rel="noopener noreferrer">LinkedIn</SocialLink>
        </SocialLinks>
      </FooterContainer>
    </FooterSection>
  );
};

export default Footer;
