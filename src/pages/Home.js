import React, { useMemo, useRef } from 'react';
import styled from 'styled-components';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const HomeWrapper = styled.div`
  position: relative;
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  background-color: #000011;
`;

const CanvasWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const HomeContent = styled.div`
  text-align: center;
  position: relative;
  z-index: 1;
  padding: 2rem;
  color: white;
`;

const Title = styled.h1`
  font-size: 3rem;
  margin-bottom: 1rem;
  text-shadow: 0 0 10px rgba(0, 255, 255, 0.7);
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  margin-bottom: 2rem;
  text-shadow: 0 0 5px rgba(0, 255, 255, 0.5);
`;

const CTAButton = styled.button`
  background-color: rgba(0, 255, 255, 0.2);
  color: white;
  padding: 0.8rem 2rem;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: rgba(0, 255, 255, 0.3);
    box-shadow: 0 0 15px rgba(0, 255, 255, 0.5);
  }
`;

function Stars() {
  const ref = useRef();
  const [geometry, material] = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    for (let i = 0; i < 5000; i++) {
      vertices.push(THREE.MathUtils.randFloatSpread(2000)); // x
      vertices.push(THREE.MathUtils.randFloatSpread(2000)); // y
      vertices.push(THREE.MathUtils.randFloatSpread(2000)); // z
    }
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    const material = new THREE.PointsMaterial({ color: 0x00ffff, size: 2 });
    return [geometry, material];
  }, []);

  useFrame((state) => {
    ref.current.rotation.x = state.clock.getElapsedTime() * 0.05;
    ref.current.rotation.y = state.clock.getElapsedTime() * 0.075;
  });

  return <points ref={ref} geometry={geometry} material={material} />;
}

const Home = () => {
  return (
    <HomeWrapper>
      <CanvasWrapper>
        <Canvas camera={{ position: [0, 0, 1] }}>
          <Stars />
        </Canvas>
      </CanvasWrapper>
      <HomeContent>
        <Title>Elevate Your Digital Presence</Title>
        <Subtitle>Expert web development and project management solutions</Subtitle>
      </HomeContent>
    </HomeWrapper>
  );
};

export default Home;
