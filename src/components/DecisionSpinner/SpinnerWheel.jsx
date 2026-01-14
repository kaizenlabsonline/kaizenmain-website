import React, { useRef, useEffect } from 'react';

const SpinnerWheel = ({ options, isSpinning, onFinished, spinTrigger }) => {
    const canvasRef = useRef(null);
    const velocityRef = useRef(0);
    const rotationRef = useRef(0);
    const rafRef = useRef(null);

    // Colors for slices
    const COLORS = [
        '#f87171', '#fb923c', '#fbbf24', '#a3e635',
        '#34d399', '#22d3ee', '#818cf8', '#c084fc', '#f472b6'
    ];

    // Draw the wheel
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        // Config
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = Math.min(centerX, centerY) - 20;

        const draw = () => {
            // Clear
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            if (options.length === 0) {
                ctx.fillStyle = '#64748b';
                ctx.font = '20px sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText("Add options to spin!", centerX, centerY);
                return;
            }

            const sliceAngle = (2 * Math.PI) / options.length;

            // Draw slices
            options.forEach((option, i) => {
                const startAngle = rotationRef.current + (i * sliceAngle);
                const endAngle = startAngle + sliceAngle;

                ctx.beginPath();
                ctx.moveTo(centerX, centerY);
                ctx.arc(centerX, centerY, radius, startAngle, endAngle);
                ctx.closePath();

                ctx.fillStyle = COLORS[i % COLORS.length];
                ctx.fill();
                ctx.strokeStyle = '#1e293b';
                ctx.lineWidth = 2;
                ctx.stroke();

                // Text
                ctx.save();
                ctx.translate(centerX, centerY);
                ctx.rotate(startAngle + sliceAngle / 2);
                ctx.textAlign = 'right';
                ctx.fillStyle = '#1e293b';
                ctx.font = 'bold 14px sans-serif';
                ctx.fillText(option, radius - 20, 5);
                ctx.restore();
            });

            // Pointer (Static at 3 o'clock or top? Let's assume standard 0 angle is 3 o'clock in canvas)
            // Let's draw a pointer at the right side (0 degrees) pointing left
            ctx.beginPath();
            ctx.moveTo(canvas.width - 10, centerY);
            ctx.lineTo(canvas.width + 10, centerY - 15);
            ctx.lineTo(canvas.width + 10, centerY + 15);
            ctx.fillStyle = '#ffffff';
            ctx.fill();
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Center cap
            ctx.beginPath();
            ctx.arc(centerX, centerY, 15, 0, 2 * Math.PI);
            ctx.fillStyle = '#ffffff';
            ctx.fill();
            ctx.stroke();
        };

        const animate = () => {
            // Physics
            if (velocityRef.current > 0) {
                rotationRef.current += velocityRef.current;
                velocityRef.current *= 0.985; // Friction

                if (velocityRef.current < 0.002) {
                    velocityRef.current = 0;
                    // Determine winner
                    // Pointer is at 0 radians (Right side). 
                    // We need to find which slice is crossing 0.
                    // Normalize rotation to 0 - 2PI
                    const normalizedRotation = rotationRef.current % (2 * Math.PI);
                    // The slice index `i` covers [rotation + i*slice, rotation + (i+1)*slice]
                    // We want to verify if 0 (or 2PI) is inside that range.
                    // Actually simpler: The angle of the pointer relative to the wheel start is -rotation.
                    // Angle modulo 2PI.

                    const sliceAngle = (2 * Math.PI) / options.length;
                    // Current angle of the 0-th slice start is `normalizedRotation`.
                    // We want to know which index `i` contains angle 0.
                    // 0 = normalizedRotation + i * sliceAngle
                    // -normalizedRotation = i * sliceAngle
                    // i = -normalizedRotation / sliceAngle

                    let winningIndex = Math.floor((2 * Math.PI - normalizedRotation) / sliceAngle) % options.length;
                    if (winningIndex < 0) winningIndex += options.length;

                    onFinished(options[winningIndex]);
                }
            }

            draw();
            rafRef.current = requestAnimationFrame(animate);
        };

        animate();

        return () => cancelAnimationFrame(rafRef.current);
    }, [options, onFinished]);

    // Trigger spin
    useEffect(() => {
        if (isSpinning) {
            // Random initial kick + standard speed
            velocityRef.current = 0.5 + Math.random() * 0.3;
        }
    }, [spinTrigger, isSpinning]);

    return (
        <canvas ref={canvasRef} width={400} height={400} className="max-w-full h-auto" />
    );
};

export default SpinnerWheel;
