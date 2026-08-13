'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { determineBuilderClass } from '@/lib/builderClass';

interface Props {
  role?: string;
  stack?: string[];
  onComplete: (cls: string, emoji: string, description: string) => void;
}

export default function BuilderClassStep({ role, stack, onComplete }: Props) {
  const [phase, setPhase] = useState<'analysing' | 'reveal'>('analysing');
  const [dots, setDots] = useState('.');
  const classInfo = determineBuilderClass(role, stack);

  // Animated dots
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((d) => (d.length >= 3 ? '.' : d + '.'));
    }, 400);
    return () => clearInterval(interval);
  }, []);

  // Auto-advance to reveal
  useEffect(() => {
    const timer = setTimeout(() => setPhase('reveal'), 2600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="journey-stage"
      style={{
        background: 'radial-gradient(ellipse at 50% 50%, rgba(124,58,237,0.15) 0%, rgba(4,6,15,0.98) 60%), var(--bg-void)',
        textAlign: 'center',
      }}
    >
      {/* Ambient glow rings */}
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
        pointerEvents: 'none',
      }}>
        {[200, 320, 440].map((size, i) => (
          <div key={size} style={{
            position: 'absolute',
            width: size, height: size, borderRadius: '50%',
            border: `1px solid rgba(124,58,237,${0.12 - i * 0.03})`,
            animation: `spin ${8 + i * 4}s linear infinite`,
            animationDirection: i % 2 === 0 ? 'normal' : 'reverse',
          }} />
        ))}
      </div>

      {phase === 'analysing' ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: 48, marginBottom: 24 }}>🔮</div>
          <div style={{
            fontSize: 10, fontWeight: 800, letterSpacing: '0.25em',
            color: 'var(--accent-violet)', textTransform: 'uppercase', marginBottom: 20,
          }}>
            Analysing your Builder DNA
          </div>
          <h2 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 'clamp(20px, 5vw, 32px)', fontWeight: 800,
            color: 'var(--text-muted)', letterSpacing: '-0.01em',
          }}>
            Discovering your class{dots}
          </h2>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.75 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 220, damping: 20 }}
          style={{ position: 'relative', zIndex: 1, maxWidth: 480, padding: '0 20px' }}
        >
          <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.25em', color: 'var(--accent-violet)', textTransform: 'uppercase', marginBottom: 20 }}>
            You are
          </div>

          {/* Class emoji */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 18, delay: 0.15 }}
            style={{ fontSize: 72, marginBottom: 16, display: 'block' }}
          >
            {classInfo.emoji}
          </motion.div>

          {/* Class name */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="goa-title-serif"
            style={{
              fontSize: 'clamp(32px, 7vw, 56px)',
              lineHeight: 1.05, marginBottom: 16,
            }}
          >
            {classInfo.name}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{ fontSize: 16, color: 'var(--text-muted)', marginBottom: 12 }}
          >
            {classInfo.description}
          </motion.p>

          {/* DNA summary */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.65 }}
            style={{
              display: 'inline-flex', flexWrap: 'wrap', gap: 8,
              justifyContent: 'center', marginBottom: 36,
            }}
          >
            {role && (
              <span style={{
                padding: '5px 12px', borderRadius: 999, fontSize: 12, fontWeight: 700,
                background: 'rgba(0,229,255,0.1)', border: '1px solid rgba(0,229,255,0.25)',
                color: 'var(--accent-teal)',
              }}>{role}</span>
            )}
            {stack?.slice(0, 4).map((s) => (
              <span key={s} style={{
                padding: '5px 12px', borderRadius: 999, fontSize: 12,
                background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)',
                color: 'var(--accent-violet)',
              }}>{s}</span>
            ))}
          </motion.div>

          <motion.button
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            id="class-continue-btn"
            className="btn-journey"
            onClick={() => onComplete(classInfo.name, classInfo.emoji, classInfo.description)}
            style={{ padding: '16px 44px', fontSize: 16 }}
          >
            THAT'S ME. REVEAL MY CARD →
          </motion.button>
        </motion.div>
      )}
    </div>
  );
}
