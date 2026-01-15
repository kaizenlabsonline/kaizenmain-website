import * as THREE from 'three';

// Utility to create a gradient texture on the fly
const createGradientTexture = (colors, type = 'radial') => {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');

    // Gradient center
    const cx = 64;
    const cy = 64;
    const radius = 60;

    if (type === 'radial') {
        const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
        colors.forEach((c, i) => gradient.addColorStop(i / (colors.length - 1), c));
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 128, 128);
    } else {
        // Spiral approximation for galaxies using varied opacity
        ctx.fillStyle = '#00000000'; // transparent
        ctx.fillRect(0, 0, 128, 128);

        ctx.save();
        ctx.translate(cx, cy);

        for (let i = 0; i < 50; i++) {
            ctx.rotate(0.3);
            ctx.fillStyle = colors[i % colors.length];
            // Draw oval particles
            ctx.beginPath();
            ctx.ellipse(i + 10, 0, 20 - i * 0.3, 5, 0, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
    }

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
};

// Generate reusable textures
export const getCosmicTextures = () => {
    return {
        // glowing orb (Gas Giant)
        orb: createGradientTexture(['rgba(255, 255, 255, 1)', 'rgba(74, 144, 226, 0.5)', 'rgba(0, 0, 0, 0)']),

        // Deep Red Nebula
        nebulaRed: createGradientTexture(['rgba(255, 100, 100, 0.8)', 'rgba(120, 0, 0, 0.4)', 'rgba(0,0,0,0)']),

        // Mystic Purple Galaxy
        galaxyPurple: createGradientTexture(['rgba(255, 200, 255, 0.9)', 'rgba(120, 0, 200, 0.5)', 'rgba(0,0,0,0)']),

        // Golden Cluster
        goldCluster: createGradientTexture(['rgba(255, 255, 200, 0.9)', 'rgba(200, 150, 0, 0.5)', 'rgba(0,0,0,0)'])
    };
};
