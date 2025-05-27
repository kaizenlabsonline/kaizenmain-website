import React, { useMemo, useRef } from 'react';
import styled from 'styled-components';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import MotivMate from '../components/MotivMate/App';

const MotivMateWrapper = styled.div`
  position: relative;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  background-color: #000011;
  z-index: 1;
`;

const CanvasWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
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

const MotivMateComponent = () => {
  return (
    <MotivMateWrapper>
      <CanvasWrapper>
        <Canvas camera={{ position: [0, 0, 1] }}>
          <Stars />
        </Canvas>
      </CanvasWrapper>
      <MotivMate />
    </MotivMateWrapper>
  );
};

export default MotivMateComponent;
