import React, { useEffect, useRef } from 'react';

interface SiteBackgroundOverlayProps {
  dotColor?: string;
  glowColor?: string;
  density?: number;
  className?: string;
}

export const SiteBackgroundOverlay: React.FC<SiteBackgroundOverlayProps> = ({
  dotColor = 'rgba(240, 196, 27, 0.22)',
  glowColor = 'rgba(240, 196, 27, 0.12)',
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let mouseX = -9999;
    let mouseY = -9999;
    let targetMouseX = -9999;
    let targetMouseY = -9999;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = e.clientX;
      targetMouseY = e.clientY;
    };

    const handleMouseLeave = () => {
      targetMouseX = -9999;
      targetMouseY = -9999;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    // Setup dot grid coordinates
    const spacing = 32; // Distance between dots
    let time = 0;

    const render = () => {
      time += 0.015;

      // Smooth mouse lerp
      mouseX += (targetMouseX - mouseX) * 0.1;
      mouseY += (targetMouseY - mouseY) * 0.1;

      ctx.clearRect(0, 0, width, height);

      const cols = Math.ceil(width / spacing) + 1;
      const rows = Math.ceil(height / spacing) + 1;

      // Calculate radial mask center (top hero area)
      const centerX = width / 2;
      const topY = height * 0.15;
      const maxRadius = Math.max(width, height) * 0.75;

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = i * spacing;
          const y = j * spacing;

          // Distance from top center for subtle ambient falloff
          const dxCenter = x - centerX;
          const dyCenter = y - topY;
          const distCenter = Math.sqrt(dxCenter * dxCenter + dyCenter * dyCenter);
          const centerFactor = Math.max(0, 1 - distCenter / maxRadius);

          // Distance from mouse for interactive glow
          const dxMouse = x - mouseX;
          const dyMouse = y - mouseY;
          const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
          const mouseReach = 180;
          const mouseFactor = distMouse < mouseReach ? Math.pow(1 - distMouse / mouseReach, 2) : 0;

          // Subtle gentle breathing wave
          const wave = Math.sin(time + (x + y) * 0.008) * 0.15;

          // Combined dot opacity
          const baseAlpha = 0.07 * centerFactor + wave * 0.02;
          const finalAlpha = Math.min(0.9, baseAlpha + mouseFactor * 0.65);

          if (finalAlpha > 0.02) {
            ctx.beginPath();
            // Near cursor, dots are slightly larger and brighter gold #F0C41B
            const radius = mouseFactor > 0.1 ? 1.4 + mouseFactor * 1.2 : 1.1;

            if (mouseFactor > 0.15) {
              ctx.fillStyle = `rgba(240, 196, 27, ${finalAlpha})`;
              ctx.shadowColor = '#F0C41B';
              ctx.shadowBlur = 8 * mouseFactor;
            } else {
              ctx.fillStyle = `rgba(240, 196, 27, ${finalAlpha * 0.8})`;
              ctx.shadowBlur = 0;
            }

            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      className={`fixed inset-0 pointer-events-none overflow-hidden z-0 ${className}`}
      aria-hidden="true"
    >
      {/* ── 1. Top Spotlight Glowing Ellipse (Tradzu Ambient Glow) ── */}
      <div
        className="absolute -top-[200px] left-1/2 -translate-x-1/2 w-[1000px] h-[700px] rounded-full blur-[140px] pointer-events-none opacity-75"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(240, 196, 27, 0.16) 0%, rgba(240, 196, 27, 0.05) 50%, transparent 75%)'
        }}
      />

      {/* ── 2. Mid-Page Gentle Ambient Aura ── */}
      <div
        className="absolute top-[40%] left-1/2 -translate-x-1/2 w-[850px] h-[550px] rounded-full blur-[160px] pointer-events-none opacity-45"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(240, 196, 27, 0.10) 0%, transparent 70%)'
        }}
      />

      {/* ── 3. Bottom Accent Glow ── */}
      <div
        className="absolute -bottom-[250px] left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full blur-[150px] pointer-events-none opacity-50"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(240, 196, 27, 0.12) 0%, transparent 70%)'
        }}
      />

      {/* ── 4. CSS Dot Matrix Grid with Vignette Mask ── */}
      <div
        className="absolute inset-0 size-full opacity-60"
        style={{
          backgroundImage: `
            radial-gradient(circle at 1px 1px, rgba(240, 196, 27, 0.15) 1.2px, transparent 1.2px),
            radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.04) 1px, transparent 1px)
          `,
          backgroundSize: '32px 32px, 64px 64px',
          maskImage: 'radial-gradient(ellipse 85% 75% at 50% 25%, black 40%, transparent 95%)',
          WebkitMaskImage: 'radial-gradient(ellipse 85% 75% at 50% 25%, black 40%, transparent 95%)'
        }}
      />

      {/* ── 5. Interactive HTML5 Dot Field Canvas ── */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 size-full block opacity-85"
      />

      {/* ── 6. Subtle Vignette Edge Fade to Pure Black ── */}
      <div
        className="absolute inset-0 size-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 50%, transparent 50%, rgba(0, 0, 0, 0.5) 100%)'
        }}
      />
    </div>
  );
};

export default SiteBackgroundOverlay;
