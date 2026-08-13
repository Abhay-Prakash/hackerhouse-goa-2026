'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  onComplete: (tribe: 'solo' | 'team', teamName?: string) => void;
  onBack: () => void;
}

export default function TribeStep({ onComplete, onBack }: Props) {
  const [choice, setChoice] = useState<'solo' | 'team' | null>(null);
  const [teamName, setTeamName] = useState('');

  const canContinue = !!choice && (choice === 'solo' || teamName.trim().length > 0);

  return (
    <div
      className="journey-stage"
      style={{
        paddingTop: 80,
        background: 'radial-gradient(ellipse at 30% 70%, rgba(255,209,102,0.06) 0%, transparent 55%), var(--bg-void)',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        style={{ width: '100%', maxWidth: 520, position: 'relative', zIndex: 1 }}
      >
        {/* Back */}
        <button onClick={onBack} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'var(--text-muted)', fontSize: 13,
          display: 'flex', alignItems: 'center', gap: 6,
          marginBottom: 28, padding: 0, letterSpacing: '0.04em',
        }}>← BACK</button>

        {/* Eyebrow */}
        <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.2em', color: 'var(--accent-gold)', textTransform: 'uppercase', marginBottom: 12 }}>
          03 — YOUR TRIBE
        </div>

        <h2 style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 'clamp(24px, 5.5vw, 38px)', fontWeight: 800,
          letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: 8,
        }}>
          Who are you building with?
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: 15, lineHeight: 1.6, marginBottom: 32 }}>
          Every builder has a story — solo or crew.
        </p>

        {/* Tribe cards */}
        <div style={{ display: 'flex', gap: 14, marginBottom: 28 }}>
          {/* Solo */}
          <button
            id="tribe-solo-btn"
            className={`tribe-card ${choice === 'solo' ? 'selected' : ''}`}
            onClick={() => setChoice('solo')}
          >
            <div style={{ fontSize: 40, marginBottom: 12 }}>🏄</div>
            <div style={{
              fontSize: 16, fontWeight: 800, letterSpacing: '-0.01em',
              color: choice === 'solo' ? 'var(--accent-gold)' : 'var(--text-primary)',
              marginBottom: 6,
            }}>
              SOLO
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Rolling solo? Own your journey.
            </div>
          </button>

          {/* Team */}
          <button
            id="tribe-team-btn"
            className={`tribe-card ${choice === 'team' ? 'selected' : ''}`}
            onClick={() => setChoice('team')}
          >
            <div style={{ fontSize: 40, marginBottom: 12 }}>🛖</div>
            <div style={{
              fontSize: 16, fontWeight: 800, letterSpacing: '-0.01em',
              color: choice === 'team' ? 'var(--accent-gold)' : 'var(--text-primary)',
              marginBottom: 6,
            }}>
              CREW
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Got a team? Name your crew.
            </div>
          </button>
        </div>

        {/* Team name input */}
        <AnimatePresence>
          {choice === 'team' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{ overflow: 'hidden', marginBottom: 24 }}
            >
              <label style={{
                display: 'block', marginBottom: 8,
                fontSize: 10, fontWeight: 800, letterSpacing: '0.18em',
                color: 'var(--text-muted)', textTransform: 'uppercase',
              }}>
                What&apos;s your crew called?
              </label>
              <input
                id="team-name-input"
                className="input-field"
                type="text"
                placeholder="e.g. Night Owls, The Minimalists…"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && canContinue && onComplete(choice!, teamName.trim() || undefined)}
                autoFocus
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sticky/Fixed Action Dock */}
        <div style={{
          position: 'fixed',
          bottom: 16,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'calc(100% - 32px)',
          maxWidth: 520,
          zIndex: 1000,
          padding: '10px 14px',
          borderRadius: 20,
          background: 'rgba(3,38,21,0.94)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '2px solid var(--goa-yellow)',
          boxShadow: '0 12px 40px rgba(0,0,0,0.6)',
        }}>
          <button
            id="tribe-continue-btn"
            className="btn-pink"
            onClick={() => canContinue && onComplete(choice!, choice === 'team' ? teamName.trim() : undefined)}
            disabled={!canContinue}
            style={{ width: '100%', opacity: canContinue ? 1 : 0.45, fontSize: 16 }}
          >
            {!choice ? 'Choose your path' : choice === 'team' && !teamName.trim() ? 'Name your crew' : "LET'S GO ↓"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
