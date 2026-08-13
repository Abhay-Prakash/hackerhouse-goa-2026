'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { VerificationResult } from '@/lib/verification';

interface Props {
  onVerified: (result: VerificationResult) => void;
  onBack: () => void;
}

export default function VerificationStep({ onVerified, onBack }: Props) {
  const [identifier, setIdentifier] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleVerify = async () => {
    if (!identifier.trim()) return;
    setStatus('loading');
    setErrorMsg('');
    try {
      const res = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier }),
      });
      const data: VerificationResult = await res.json();
      if (data.success) {
        setResult(data);
        setStatus('success');
        setTimeout(() => onVerified(data), 1800);
      } else {
        setStatus('error');
        setErrorMsg(data.error ?? 'Pass not recognised.');
      }
    } catch {
      setStatus('error');
      setErrorMsg('Network error. Please try again.');
    }
  };

  return (
    <div
      className="journey-stage"
      style={{
        paddingTop: 80,
        background: 'radial-gradient(ellipse at 30% 20%, rgba(0,229,255,0.06) 0%, transparent 60%), var(--bg-void)',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        style={{ width: '100%', maxWidth: 480, position: 'relative', zIndex: 1 }}
      >
        {/* Back */}
        <button onClick={onBack} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'var(--text-muted)', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6,
          marginBottom: 28, padding: 0, letterSpacing: '0.04em',
        }}>
          ← BACK
        </button>

        {/* Eyebrow */}
        <div style={{
          fontSize: 10, fontWeight: 800, letterSpacing: '0.2em',
          color: 'var(--accent-teal)', textTransform: 'uppercase', marginBottom: 16,
        }}>
          01 — FIRST STOP
        </div>

        {/* Heading */}
        <h2 style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 'clamp(26px, 6vw, 42px)', fontWeight: 800,
          letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: 10,
        }}>
          The Checkpoint
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: 15, lineHeight: 1.6, marginBottom: 36 }}>
          Before we build your identity, let&apos;s confirm your HackerHouse Goa registration.
        </p>

        {/* Passport-style card */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(0,229,255,0.04), rgba(13,22,48,0.8))',
          border: '1px solid rgba(0,229,255,0.12)',
          borderRadius: 20, padding: '32px 28px',
          position: 'relative', overflow: 'hidden',
        }}>
          {/* Decorative passport corner marks */}
          {['tl','tr','bl','br'].map((c) => (
            <div key={c} style={{
              position: 'absolute',
              top: c.startsWith('t') ? 12 : 'auto',
              bottom: c.startsWith('b') ? 12 : 'auto',
              left: c.endsWith('l') ? 12 : 'auto',
              right: c.endsWith('r') ? 12 : 'auto',
              width: 14, height: 14,
              borderTop: c.startsWith('t') ? '2px solid rgba(0,229,255,0.25)' : 'none',
              borderBottom: c.startsWith('b') ? '2px solid rgba(0,229,255,0.25)' : 'none',
              borderLeft: c.endsWith('l') ? '2px solid rgba(0,229,255,0.25)' : 'none',
              borderRight: c.endsWith('r') ? '2px solid rgba(0,229,255,0.25)' : 'none',
            }} />
          ))}

          <AnimatePresence mode="wait">
            {status === 'success' && result ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 280, damping: 22 }}
                style={{ textAlign: 'center', padding: '12px 0' }}
              >
                <motion.div
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 20, delay: 0.1 }}
                  className="animate-stamp"
                  style={{
                    width: 80, height: 80, borderRadius: '50%', margin: '0 auto 16px',
                    background: 'rgba(16,185,129,0.12)',
                    border: '2.5px solid rgba(16,185,129,0.5)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 34,
                  }}
                >
                  ✓
                </motion.div>

                <div className="verified-badge" style={{ margin: '0 auto 14px', display: 'inline-flex' }}>
                  ✓ VERIFIED BUILDER
                </div>

                <p style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.18em', color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase' }}>
                  Your pass checks out.
                </p>
                <p style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>
                  Welcome, {result.name?.split(' ')[0]}.
                </p>
                <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                  Continuing your journey…
                </p>
              </motion.div>
            ) : (
              <motion.div key="form" exit={{ opacity: 0 }}>
                <label style={{
                  display: 'block', marginBottom: 8,
                  fontSize: 10, fontWeight: 800, letterSpacing: '0.18em',
                  color: 'var(--text-muted)', textTransform: 'uppercase',
                }}>
                  Registration ID or registered email
                </label>

                <input
                  id="identifier-input"
                  className="input-field"
                  type="text"
                  placeholder="HH2026-001 or your@email.com"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
                  disabled={status === 'loading'}
                  autoFocus
                  style={{ marginBottom: 10 }}
                />

                <AnimatePresence>
                  {status === 'error' && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      style={{
                        background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)',
                        borderRadius: 10, padding: '10px 14px',
                        fontSize: 13, color: '#f87171', marginBottom: 10, overflow: 'hidden',
                      }}
                    >
                      {errorMsg}
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  id="check-pass-btn"
                  className="btn-journey"
                  onClick={handleVerify}
                  disabled={status === 'loading' || !identifier.trim()}
                  style={{ width: '100%', opacity: !identifier.trim() ? 0.45 : 1, marginBottom: 20 }}
                >
                  {status === 'loading' ? (
                    <><div className="spinner" style={{ width: 17, height: 17, borderWidth: 2, borderTopColor: 'rgba(0,0,0,0.5)', borderColor: 'rgba(0,0,0,0.15)' }} /> CHECKING…</>
                  ) : 'CHECK MY PASS →'}
                </button>

                <div style={{
                  padding: '12px 14px', borderRadius: 10,
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.7,
                }}>
                  <strong style={{ color: 'var(--text-primary)' }}>Demo passes:</strong>{' '}
                  HH2026-001 · HH2026-002 · HH2026-003 · HH2026-004 · HH2026-005
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
