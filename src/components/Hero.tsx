import React, { useEffect, useRef } from 'react';
import { Bolt } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../translations';

interface HeroProps {
  currentLang: Language;
}

export const Hero: React.FC<HeroProps> = ({ currentLang }) => {
  const t = translations[currentLang];
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const width = 340;
    const height = 340;
    canvas.width = width;
    canvas.height = height;

    // Glowing particle system
    const particles = Array.from({ length: 32 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2 + 1,
      speedX: (Math.random() - 0.5) * 0.8,
      speedY: (Math.random() - 0.5) * 0.8,
      color: Math.random() > 0.5 ? '#00d4ff' : '#a855f7',
      opacity: Math.random() * 0.7 + 0.3
    }));

    const render = () => {
      time += 0.025;
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;

      // Draw background glow
      const glowGrad = ctx.createRadialGradient(cx, cy, 20, cx, cy, 140);
      glowGrad.addColorStop(0, 'rgba(0, 212, 255, 0.25)');
      glowGrad.addColorStop(0.5, 'rgba(168, 85, 247, 0.15)');
      glowGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, 140, 0, Math.PI * 2);
      ctx.fill();

      // Render orbiting particles
      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        if (p.x < 0 || p.x > width) p.speedX *= -1;
        if (p.y < 0 || p.y > height) p.speedY *= -1;

        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity * (0.6 + Math.sin(time + p.x) * 0.3);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;

      // Draw 3D Isometric Cyber PDF Document
      const floatY = Math.sin(time) * 10;
      const docW = 130;
      const docH = 175;
      const x = cx - docW / 2;
      const y = cy - docH / 2 + floatY;

      // Document Outer Shadow
      ctx.shadowColor = 'rgba(0, 212, 255, 0.5)';
      ctx.shadowBlur = 25;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 15;

      // Document Background (Dark Cyber Glass)
      const docGrad = ctx.createLinearGradient(x, y, x + docW, y + docH);
      docGrad.addColorStop(0, 'rgba(15, 23, 42, 0.95)');
      docGrad.addColorStop(1, 'rgba(30, 41, 59, 0.92)');
      ctx.fillStyle = docGrad;

      // Rounded rect path
      ctx.beginPath();
      ctx.roundRect(x, y, docW, docH, 16);
      ctx.fill();

      // Document Border (Neon Cyan / Purple gradient)
      const borderGrad = ctx.createLinearGradient(x, y, x + docW, y + docH);
      borderGrad.addColorStop(0, '#00d4ff');
      borderGrad.addColorStop(0.5, '#a855f7');
      borderGrad.addColorStop(1, '#ec4899');
      ctx.strokeStyle = borderGrad;
      ctx.lineWidth = 2.5;
      ctx.stroke();

      ctx.shadowColor = 'transparent';

      // Red PDF Corner Ribbon
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.roundRect(x + 14, y + 14, 38, 22, 6);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px Tajawal, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('PDF', x + 33, y + 29);

      // Document illustration box (mountain / sun icon representing images)
      const boxX = x + 16;
      const boxY = y + 46;
      const boxW = docW - 32;
      const boxH = 65;

      const imgBoxGrad = ctx.createLinearGradient(boxX, boxY, boxX, boxY + boxH);
      imgBoxGrad.addColorStop(0, 'rgba(0, 212, 255, 0.12)');
      imgBoxGrad.addColorStop(1, 'rgba(168, 85, 247, 0.08)');
      ctx.fillStyle = imgBoxGrad;
      ctx.beginPath();
      ctx.roundRect(boxX, boxY, boxW, boxH, 10);
      ctx.fill();
      ctx.strokeStyle = 'rgba(0, 212, 255, 0.3)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Mountain vector
      ctx.fillStyle = 'rgba(0, 212, 255, 0.5)';
      ctx.beginPath();
      ctx.moveTo(boxX + 15, boxY + boxH - 10);
      ctx.lineTo(boxX + 38, boxY + 20);
      ctx.lineTo(boxX + 58, boxY + boxH - 10);
      ctx.fill();

      ctx.fillStyle = 'rgba(168, 85, 247, 0.45)';
      ctx.beginPath();
      ctx.moveTo(boxX + 44, boxY + boxH - 10);
      ctx.lineTo(boxX + 68, boxY + 28);
      ctx.lineTo(boxX + 85, boxY + boxH - 10);
      ctx.fill();

      // Glowing Sun
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(boxX + 74, boxY + 18, 7, 0, Math.PI * 2);
      ctx.fill();

      // Document Text simulation lines
      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.beginPath();
      ctx.roundRect(x + 18, y + 122, docW - 36, 6, 3);
      ctx.fill();

      ctx.beginPath();
      ctx.roundRect(x + 18, y + 135, docW - 55, 6, 3);
      ctx.fill();

      ctx.beginPath();
      ctx.roundRect(x + 18, y + 148, docW - 44, 6, 3);
      ctx.fill();

      // Orbiting Neon Ring
      ctx.save();
      ctx.translate(cx, cy + floatY);
      ctx.rotate(time * 0.7);
      ctx.beginPath();
      ctx.ellipse(0, 0, docW * 0.85, 45, Math.PI / 4, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(0, 212, 255, 0.35)';
      ctx.lineWidth = 1.8;
      ctx.stroke();

      // Orbiting Spark
      const sparkX = Math.cos(time * 1.5) * (docW * 0.85);
      const sparkY = Math.sin(time * 1.5) * 45;
      ctx.fillStyle = '#06ffe4';
      ctx.shadowColor = '#06ffe4';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(sparkX, sparkY, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div className="w-full flex flex-col items-center">
      {/* Top Pro Badge */}
      <div className="mb-6 flex justify-center">
        <div className="relative inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-slate-900/80 border border-cyan-500/30 text-cyan-200 text-xs sm:text-sm font-bold shadow-lg shadow-cyan-500/10 backdrop-blur-xl overflow-hidden group">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400 animate-pulse" />
          <Bolt className="w-4 h-4 text-cyan-400" />
          <span>{t.heroBadge}</span>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        </div>
      </div>

      {/* Hero Visual & Titles */}
      <div className="w-full flex flex-col lg:flex-row-reverse items-center justify-between gap-8 lg:gap-14 mb-10">
        {/* Canvas Visual */}
        <div className="flex-1 flex justify-center relative">
          <div className="relative group">
            <canvas
              ref={canvasRef}
              className="max-w-[280px] sm:max-w-[340px] w-full h-auto drop-shadow-[0_20px_40px_rgba(0,212,255,0.35)]"
            />
          </div>
        </div>

        {/* Text Area */}
        <div className={`flex-1 text-center ${currentLang === 'ar' ? 'lg:text-right' : 'lg:text-left'}`}>
          <div className="inline-flex items-center gap-2 text-cyan-400 text-xs sm:text-sm font-extrabold uppercase tracking-widest mb-3">
            <span className="w-6 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full" />
            {t.heroTagline}
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight tracking-tight text-white mb-4">
            {currentLang === 'ar' ? (
              <>
                حوّل صورك إلى{' '}
                <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500 bg-clip-text text-transparent">
                  ملف PDF
                </span>{' '}
                احترافي
              </>
            ) : currentLang === 'fr' ? (
              <>
                Convertissez vos images en{' '}
                <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500 bg-clip-text text-transparent">
                  PDF
                </span>{' '}
                parfait
              </>
            ) : (
              <>
                Convert Images to a{' '}
                <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500 bg-clip-text text-transparent">
                  Professional PDF
                </span>
              </>
            )}
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl font-normal">
            {t.heroDesc}
          </p>
        </div>
      </div>
    </div>
  );
};
