import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Environment, Cloud, Float, Sparkles, Stars } from '@react-three/drei';
import { EffectComposer, Bloom, Noise, Vignette, ToneMapping } from '@react-three/postprocessing';
import * as THREE from 'three';

// --- SHARED UTILS ---

function useInsulationTexture() {
    return useMemo(() => {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#b06c3a';
        ctx.fillRect(0, 0, 512, 512);
        for (let i = 0; i < 512; i += 4) {
            ctx.fillStyle = `rgba(0,0,0,${Math.random() * 0.1})`;
            ctx.fillRect(0, i, 512, 2);
        }
        const imageData = ctx.getImageData(0, 0, 512, 512);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
            const noise = (Math.random() - 0.5) * 20;
            data[i] = Math.max(0, Math.min(255, data[i] + noise));
            data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise));
            data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise));
        }
        ctx.putImageData(imageData, 0, 0);
        const tex = new THREE.CanvasTexture(canvas);
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        return tex;
    }, []);
}

function useNoiseTexture() {
    return useMemo(() => {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#808080';
        ctx.fillRect(0, 0, 256, 256);
        for (let i = 0; i < 40000; i++) {
            ctx.fillStyle = `rgba(0,0,0,${Math.random() * 0.05})`;
            ctx.fillRect(Math.random() * 256, Math.random() * 256, 2, 2);
        }
        return new THREE.CanvasTexture(canvas);
    }, []);
}

// --- MOVING STARS COMPONENT ---
const MovingStars = () => {
    const count = 1000;
    const mesh = useRef();

    // Generate random initial positions and speeds
    const particles = useMemo(() => {
        const temp = [];
        for (let i = 0; i < count; i++) {
            const x = (Math.random() - 0.5) * 200; // Wide spread X
            const y = (Math.random() - 0.5) * 100; // Spread Y
            const z = (Math.random() - 0.5) * 100 - 50; // Depth behind rockets

            // 95% Slow (Background), 5% Fast (Foreground Parallax)
            const isFast = Math.random() > 0.95;

            // Speed: Fast = 0.1-0.3, Slow = 0.002-0.012 (Very slow)
            const speed = isFast ? (Math.random() * 0.2 + 0.1) : (Math.random() * 0.01 + 0.002);

            // Size: Fast = 0.1-0.3, Slow = 0.02-0.10 (Tiny dust)
            const size = isFast ? (Math.random() * 0.2 + 0.1) : (Math.random() * 0.08 + 0.02);

            temp.push({ x, y, z, speed, size });
        }
        return temp;
    }, []);

    const dummy = useMemo(() => new THREE.Object3D(), []);

    useFrame(() => {
        if (!mesh.current) return;

        particles.forEach((particle, i) => {
            // Update Y position (falling effect)
            particle.y -= particle.speed;

            // Wrap around
            if (particle.y < -50) {
                particle.y = 50;
            }

            // Update instance matrix
            dummy.position.set(particle.x, particle.y, particle.z);
            dummy.scale.set(particle.size, particle.size, particle.size);
            dummy.updateMatrix();
            mesh.current.setMatrixAt(i, dummy.matrix);
        });
        mesh.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh ref={mesh} args={[null, null, count]}>
            <dodecahedronGeometry args={[0.2, 0]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.6} />
        </instancedMesh>
    );
};


// --- CLASS 1: THE ARTEMIS (Heavy Lift) --- (Unchanged)
const ArtemisModel = ({ materials }) => {
    return (
        <group scale={[1, 1, 1]}>
            {/* Core Stage */}
            <mesh position={[0, 0.5, 0]} material={materials.orangeFoam} castShadow>
                <cylinderGeometry args={[0.8, 0.8, 8, 32]} />
            </mesh>
            <mesh position={[0, -3.8, 0]} material={materials.whitePaint}><cylinderGeometry args={[0.8, 0.7, 0.8, 32]} /></mesh>
            {/* Boosters */}
            <group position={[1.2, -1, 0]}>
                <mesh material={materials.whitePaint}><cylinderGeometry args={[0.35, 0.35, 7, 32]} /></mesh>
                <mesh position={[0, 4, 0]} material={materials.whitePaint}><cylinderGeometry args={[0.05, 0.35, 1, 32]} /></mesh>
                <mesh position={[0, -3.8, 0]} material={materials.engineMetal}><cylinderGeometry args={[0.25, 0.1, 0.6, 32]} /></mesh>
            </group>
            <group position={[-1.2, -1, 0]}>
                <mesh material={materials.whitePaint}><cylinderGeometry args={[0.35, 0.35, 7, 32]} /></mesh>
                <mesh position={[0, 4, 0]} material={materials.whitePaint}><cylinderGeometry args={[0.05, 0.35, 1, 32]} /></mesh>
                <mesh position={[0, -3.8, 0]} material={materials.engineMetal}><cylinderGeometry args={[0.25, 0.1, 0.6, 32]} /></mesh>
            </group>
            {/* Upper Stage */}
            <group position={[0, 4.5, 0]}>
                <mesh material={materials.whitePaint}><cylinderGeometry args={[0.6, 0.8, 1.2, 32]} /></mesh>
                <mesh position={[0, 1, 0]} material={materials.whitePaint}><cylinderGeometry args={[0.6, 0.6, 1, 32]} /></mesh>
                <mesh position={[0, 2.3, 0]} material={materials.whitePaint}><coneGeometry args={[0.6, 0.5, 32]} /></mesh>
                <mesh position={[0, 3.2, 0]} material={materials.whitePaint}><cylinderGeometry args={[0.05, 0.1, 1.5, 16]} /></mesh>
            </group>
            <mesh position={[0, -2, 0]} material={materials.blackTiles}><boxGeometry args={[2.2, 0.1, 0.1]} /></mesh>
            <mesh position={[0, 2, 0]} material={materials.blackTiles}><boxGeometry args={[2.2, 0.1, 0.1]} /></mesh>
        </group>
    )
}

// --- CLASS 2: SPACE JET (Replacing Starship) ---
// Detailed Futuristic Spaceplane
const SpaceJetModel = ({ materials }) => {
    return (
        <group scale={[1.3, 1.3, 1.3]} rotation={[0, Math.PI, 0]}>
            {/* Main Fuselage */}
            <mesh position={[0, 1, 0]} material={materials.stainlessSteel} castShadow>
                <cylinderGeometry args={[0.4, 0.8, 6, 6]} /> {/* Hexagonal fuselage */}
            </mesh>
            {/* Cockpit Canopy */}
            <mesh position={[0, 3.5, 0.3]} rotation={[-0.2, 0, 0]} material={materials.blackTiles}>
                <capsuleGeometry args={[0.3, 1.2, 4, 8]} />
            </mesh>
            {/* Delta Wings */}
            <group position={[0, 0, 0]}>
                <mesh position={[1.2, -1, 0]} rotation={[0, 0, -0.2]} material={materials.whitePaint}>
                    <boxGeometry args={[2, 4, 0.1]} /> {/* Left Wing */}
                </mesh>
                <mesh position={[-1.2, -1, 0]} rotation={[0, 0, 0.2]} material={materials.whitePaint}>
                    <boxGeometry args={[2, 4, 0.1]} /> {/* Right Wing */}
                </mesh>
            </group>
            {/* Vertical Stabilizers */}
            <group position={[0, -2, 0.5]}>
                <mesh position={[0.6, 0, 0]} rotation={[0, -0.1, 0]} material={materials.stainlessSteel}>
                    <boxGeometry args={[0.1, 2, 1.5]} />
                </mesh>
                <mesh position={[-0.6, 0, 0]} rotation={[0, 0.1, 0]} material={materials.stainlessSteel}>
                    <boxGeometry args={[0.1, 2, 1.5]} />
                </mesh>
            </group>
            {/* Engine Intakes */}
            <mesh position={[0.8, 1, 0.5]} material={materials.blackTiles}><boxGeometry args={[0.5, 1.5, 0.5]} /></mesh>
            <mesh position={[-0.8, 1, 0.5]} material={materials.blackTiles}><boxGeometry args={[0.5, 1.5, 0.5]} /></mesh>

            {/* Rear Thrusters */}
            <mesh position={[0, -2.5, 0]} material={materials.engineMetal}>
                <cylinderGeometry args={[0.6, 0.4, 0.8, 8]} />
            </mesh>
        </group>
    )
}

// --- CLASS 3: SCI-FI HEAVY LANDER (Replacing Falcon) ---
// Robust, industrial looking lander with tanks
const SciFiLanderModel = ({ materials }) => {
    return (
        <group scale={[1.1, 1.1, 1.1]}>
            {/* Central Core */}
            <mesh position={[0, 0, 0]} material={materials.whitePaint} castShadow>
                <cylinderGeometry args={[0.7, 0.9, 5, 8]} />
            </mesh>
            {/* Top Dome */}
            <mesh position={[0, 2.5, 0]} material={materials.whitePaint}>
                <sphereGeometry args={[0.7, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
            </mesh>
            {/* External Fuel Tanks (Spheres) */}
            {[0, 1, 2, 3].map(i => (
                <group key={i} rotation={[0, i * Math.PI / 2 + Math.PI / 4, 0]}>
                    <mesh position={[0.8, -1, 0]} material={materials.orangeFoam}>
                        <capsuleGeometry args={[0.25, 2, 4, 8]} />
                    </mesh>
                    {/* Connecting Struts */}
                    <mesh position={[0.6, -1, 0]} material={materials.engineMetal}>
                        <boxGeometry args={[0.4, 0.2, 0.2]} />
                    </mesh>
                </group>
            ))}
            {/* Heavy Landing Legs */}
            {[0, 1, 2, 3].map(i => (
                <group key={i} rotation={[0, i * Math.PI / 2, 0]} position={[0, -2.5, 0]}>
                    <mesh position={[0.8, -0.5, 0]} rotation={[0, 0, -0.5]} material={materials.blackTiles}>
                        <boxGeometry args={[0.2, 1.5, 0.3]} />
                    </mesh>
                    <mesh position={[1.1, -1.2, 0]} material={materials.engineMetal}>
                        <cylinderGeometry args={[0.3, 0.4, 0.2, 6]} /> {/* Footpad */}
                    </mesh>
                </group>
            ))}
            {/* Engine Bell */}
            <mesh position={[0, -2.8, 0]} material={materials.engineMetal}>
                <cylinderGeometry args={[0.5, 0.8, 1, 16]} />
            </mesh>
        </group>
    )
}

// --- MAIN WRAPPER WITH WAVE MOTION ---

const RocketVariant = ({ type, position, color, index, materials }) => {
    const group = useRef();
    const cloudsRef = useRef();

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        if (group.current) {
            // ROTATION
            group.current.rotation.y = t * 0.1 + index;

            // WAVE MOTION: A sine wave offset by index
            // Slower frequency (0.5) for majestic "heavy" float
            const waveY = Math.sin(t * 0.5 + index * 1.2) * 1.5;

            group.current.position.y = waveY; // Apply wave motion to Y
        }
    });

    let PlumeComponent;
    if (type === 'artemis') PlumeComponent = ArtemisPlume;
    else if (type === 'spacejet') PlumeComponent = SpaceJetPlume;
    else PlumeComponent = LanderPlume;

    return (
        <group ref={group} position={position} scale={[0.35, 0.35, 0.35]}>
            {/* We removed Float because we are manually animating Y now for the wave effect */}
            {type === 'artemis' && <ArtemisModel materials={materials} />}
            {type === 'spacejet' && <SpaceJetModel materials={materials} />}
            {type === 'lander' && <SciFiLanderModel materials={materials} />}

            <PlumeComponent />
        </group>
    );
};

// --- PLUMES (UPDATED FOR REALISM) ---

const ArtemisPlume = () => (
    <group position={[0, -8, 0]}>
        {/* Massive White Smoke */}
        <Cloud opacity={0.5} speed={0.4} width={4} depth={1.5} segments={8} color="#dddddd" />
        {/* Core Flame */}
        <Cloud position={[0, 2, 0]} opacity={0.8} speed={1.0} width={1} depth={0.5} segments={4} color="#ffaa00" />
    </group>
);

const SpaceJetPlume = () => (
    <group position={[0, -6, 0]}>
        {/* Blue Ion Stream */}
        <Sparkles count={150} scale={[1, 8, 1]} size={6} speed={10} opacity={0.9} color="#00ffff" noise={0.1} />
        {/* Plasma Glow */}
        <Cloud opacity={0.2} speed={2} width={1.5} depth={0.5} segments={5} color="#0088ff" />
        <pointLight distance={8} intensity={5} color="#00ffff" />
    </group>
);

const LanderPlume = () => (
    <group position={[0, -6, 0]}>
        {/* Dirty Hypergolic Exhaust (Orange/Brown) */}
        <Cloud opacity={0.6} speed={0.6} width={3} depth={1} segments={6} color="#aa4400" />
        <Sparkles count={50} scale={[2, 4, 2]} size={12} speed={4} opacity={0.7} color="#ff4400" />
        <pointLight distance={10} intensity={4} color="#ffaa00" />
    </group>
);


const Rocket3DScene = ({ clients, dimensions }) => {
    const insulationTex = useInsulationTexture();
    const noiseTex = useNoiseTexture();

    const materials = useMemo(() => ({
        orangeFoam: new THREE.MeshStandardMaterial({
            color: '#cd7f32', map: insulationTex, roughness: 0.9, bumpMap: insulationTex, bumpScale: 0.05
        }),
        whitePaint: new THREE.MeshPhysicalMaterial({
            color: '#ffffff', roughness: 0.3, metalness: 0.1, clearcoat: 0.5
        }),
        sootPaint: new THREE.MeshPhysicalMaterial({
            color: '#eeeeee', roughness: 0.5, metalness: 0.1, map: noiseTex
        }),
        blackTiles: new THREE.MeshStandardMaterial({
            color: '#1a1a1a', roughness: 0.9
        }),
        engineMetal: new THREE.MeshStandardMaterial({
            color: '#333333', roughness: 0.4, metalness: 0.8
        }),
        stainlessSteel: new THREE.MeshPhysicalMaterial({
            color: '#a0a0a0', metalness: 1.0, roughness: 0.15, clearcoat: 1.0
        }),
    }), [insulationTex, noiseTex]);

    const getRocketType = (i) => {
        // New types mapping
        const types = ['artemis', 'spacejet', 'lander'];
        return types[i % types.length];
    };

    return (
        <>
            <color attach="background" args={['#050505']} />

            {/* Moving Starfield */}
            <MovingStars />

            <Environment preset="night" blur={0.6} />

            <ambientLight intensity={0.1} />
            <directionalLight position={[20, 10, 10]} intensity={3} color="#xfff0dd" castShadow />
            <directionalLight position={[-10, 0, -5]} intensity={1} color="#202040" />
            <spotLight position={[0, -20, 0]} intensity={5} color="#ffaa00" angle={1} />

            {clients.map((clientData, i) => (
                <RocketVariant
                    key={clientData.name}
                    type={getRocketType(i)}
                    index={clientData.index}
                    color={clientData.color}
                    position={[clientData.x / 40, 0, 0]}
                    materials={materials}
                />
            ))}

            <EffectComposer disableNormalPass>
                <Bloom luminanceThreshold={1.2} mipmapBlur intensity={1.5} radius={0.5} />
                <Noise opacity={0.12} />
                <Vignette eskil={false} offset={0.1} darkness={0.6} />
                <ToneMapping adaptive={true} resolution={256} middleGrey={0.6} maxLuminance={16.0} adaptationRate={1.0} />
            </EffectComposer>
        </>
    );
};

export default Rocket3DScene;
