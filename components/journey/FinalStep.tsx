'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import type { BuilderProfile } from '@/lib/types';

interface Props {
  profile: BuilderProfile;
  onRestart: () => void;
}

const HOUSE_URL = 'https://hhgoa.com/';

export default function FinalStep({ profile, onRestart }: Props) {
  const [showCta, setShowCta] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowCta(true), 1200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className="journey-stage"
      style={{
        textAlign: 'center',
        background: 'radial-gradient(ellipse at 50% 40%, rgba(255,209,102,0.12) 0%, rgba(124,58,237,0.08) 45%, var(--bg-void) 70%)',
      }}
    >
      {/* Ambient rings */}
      {[160, 260, 380, 520].map((size, i) => (
        <div key={size} style={{
          position: 'absolute', left: '50%', top: '50%',
          transform: 'translate(-50%, -50%)',
          width: size, height: size, borderRadius: '50%',
          border: `1px solid rgba(255,209,102,${0.1 - i * 0.02})`,
          animation: `spin ${10 + i * 5}s linear infinite`,
          animationDirection: i % 2 === 0 ? 'normal' : 'reverse',
          pointerEvents: 'none',
        }} />
      ))}

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 500, padding: '0 24px' }}>
        {/* Stamps */}
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 250, damping: 20 }}
          style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            gap: 6, marginBottom: 28,
          }}
        >
          {['📸', '🧬', '👥', '✦'].map((icon, i) => (
            <motion.div
              key={icon}
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: i * 0.12, type: 'spring', stiffness: 350, damping: 20 }}
              style={{
                width: 36, height: 36, borderRadius: '50%',
                background: 'rgba(16,185,129,0.15)',
                border: '1.5px solid rgba(16,185,129,0.4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14, color: '#10b981',
              }}
            >
              {i < 3 ? '✓' : icon}
            </motion.div>
          ))}
        </motion.div>

        {/* You made it */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <div style={{
            fontSize: 10, fontWeight: 800, letterSpacing: '0.22em',
            color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 16,
          }}>
            Journey Complete
          </div>

          <h1 className="goa-title-serif" style={{
            fontSize: 'clamp(34px, 8vw, 64px)',
            lineHeight: 1.05,
            marginBottom: 10,
          }}>
            You made the journey.
          </h1>

          <p className="goa-retro-mono" style={{
            fontSize: 15, color: 'var(--goa-yellow)', lineHeight: 1.6,
            marginBottom: 8,
          }}>
            <span>{profile.builderClassEmoji} {profile.builderClass}</span>
            {' '}— your Builder identity is sealed.
          </p>

          {profile.tribe === 'team' && profile.teamName && (
            <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 0 }}>
              Rolling with crew: <span style={{ color: '#ffffff', fontWeight: 700 }}>{profile.teamName}</span>
            </p>
          )}
        </motion.div>

        {/* THE BIG CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={showCta ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.85 }}
          transition={{ type: 'spring', stiffness: 250, damping: 20 }}
          style={{ marginTop: 44 }}
        >
          <a
            id="enter-house-final-btn"
            href={HOUSE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-pink"
            style={{
              display: 'inline-flex', textDecoration: 'none',
              fontSize: 20, padding: '22px 52px',
              letterSpacing: '0.08em', borderRadius: 16,
            }}
          >
            ENTER THE HOUSE →
          </a>

          <p style={{ marginTop: 14, fontSize: 12, color: 'rgba(255,209,102,0.5)' }}>
            hackerhousegoa.com
          </p>
        </motion.div>

        {/* Restart */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          onClick={onRestart}
          style={{
            marginTop: 36, background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--text-muted)', fontSize: 12, textDecoration: 'underline',
          }}
        >
          ← Create another card
        </motion.button>
      </div>

      {/* FrameInGoa */}
      <div style={{
        position: 'absolute', bottom: 24, fontSize: 12,
        color: 'rgba(255,209,102,0.4)', fontWeight: 700, letterSpacing: '0.08em',
      }}>
        🌴 #FrameInGoa
      </div>
    </div>
  );
}
