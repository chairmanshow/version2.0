import React, { useRef, useState, useCallback } from 'react';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number; // max tilt degrees (e.g. 10)
  perspective?: number; // perspective in px (e.g. 1000)
  scale?: number; // hover scale (e.g. 1.02)
  glare?: boolean;
  glareOpacity?: number;
  onClick?: () => void;
}

export const TiltCard: React.FC<TiltCardProps> = ({
  children,
  className = '',
  maxTilt = 8,
  perspective = 1000,
  scale = 1.02,
  glare = true,
  glareOpacity = 0.15,
  onClick,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transformStyle, setTransformStyle] = useState<string>('');
  const [glareStyle, setGlareStyle] = useState<{ x: number; y: number; opacity: number }>({
    x: 50,
    y: 50,
    opacity: 0,
  });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left; // x position within element.
      const y = e.clientY - rect.top; // y position within element.

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Calculate tilt
      const rotateX = ((y - centerY) / centerY) * -maxTilt;
      const rotateY = ((x - centerX) / centerX) * maxTilt;

      setTransformStyle(
        `perspective(${perspective}px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(${scale}, ${scale}, ${scale})`
      );

      // Glare center in percentage
      const glareX = (x / rect.width) * 100;
      const glareY = (y / rect.height) * 100;

      setGlareStyle({
        x: glareX,
        y: glareY,
        opacity: glareOpacity,
      });
    },
    [maxTilt, perspective, scale, glareOpacity]
  );

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTransformStyle(`perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`);
    setGlareStyle((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        transform: transformStyle || `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`,
        transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
        transformStyle: 'preserve-3d',
        willChange: 'transform',
      }}
      className={`relative overflow-hidden ${className}`}
    >
      {/* 3D Child Layer */}
      <div className="relative z-10 w-full h-full">{children}</div>

      {/* Dynamic Apple/Stripe-Style Specular Glare Overlay */}
      {glare && (
        <div
          className="pointer-events-none absolute inset-0 z-20 transition-opacity duration-300"
          style={{
            opacity: glareStyle.opacity,
            background: `radial-gradient(circle 350px at ${glareStyle.x}% ${glareStyle.y}%, rgba(255, 255, 255, 0.8), transparent 70%)`,
          }}
        />
      )}
    </div>
  );
};
