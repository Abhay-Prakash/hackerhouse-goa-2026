'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  onComplete: (role: string, stack: string[]) => void;
  onBack: () => void;
}

const ROLES = [
  { id: 'AI / ML',    icon: '🧠', label: 'AI / ML' },
  { id: 'Software',  icon: '💻', label: 'Software' },
  { id: 'Product',   icon: '🚀', label: 'Product' },
  { id: 'Design',    icon: '🎨', label: 'Design' },
  { id: 'Hardware',  icon: '🔌', label: 'Hardware' },
  { id: 'Research',  icon: '📡', label: 'Research' },
  { id: 'Web',       icon: '🌐', label: 'Web' },
  { id: 'Crypto',    icon: '🔗', label: 'Crypto' },
  { id: 'Automation',icon: '⚙️', label: 'Automation' },
  { id: 'Other',     icon: '⚡', label: 'Other' },
];

const STACKS = [
  'Python', 'JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js',
  'Go', 'Rust', 'Java', 'Kotlin', 'Swift', 'C++',
  'PyTorch', 'TensorFlow', 'JAX', 'Scikit-learn',
  'Flutter', 'React Native',
  'Solidity', 'Web3.js', 'Move',
  'Docker', 'Kubernetes', 'Terraform', 'AWS', 'GCP',
  'Arduino', 'Raspberry Pi', 'FPGA',
  'SQL', 'PostgreSQL', 'MongoDB', 'Redis',
  'Vue.js', 'Svelte', 'Angular',
];

export default function BuilderDnaStep({ onComplete, onBack }: Props) {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [selectedStack, setSelectedStack] = useState<string[]>([]);
  const stackSectionRef = useRef<HTMLDivElement>(null);

  const toggleStack = (s: string) => {
    setSelectedStack((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  };

  const handleRoleSelect = (roleId: string) => {
    const isNew = selectedRole !== roleId;
    setSelectedRole(isNew ? roleId : null);
    if (isNew) {
      setTimeout(() => {
        stackSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 150);
    }
  };

  const canContinue = !!selectedRole && selectedStack.length > 0;

  return (
    <div
      className="journey-stage"
      style={{
        paddingTop: 80, paddingBottom: 120,
        background: 'radial-gradient(ellipse at 50% 0%, rgba(255,230,0,0.06) 0%, transparent 55%), var(--bg-void)',
        justifyContent: 'flex-start',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        style={{ width: '100%', maxWidth: 540, position: 'relative', zIndex: 1 }}
      >
        {/* Back */}
        <button onClick={onBack} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'var(--text-muted)', fontSize: 13,
          display: 'flex', alignItems: 'center', gap: 6,
          marginBottom: 20, padding: 0, letterSpacing: '0.04em',
        }}>← BACK</button>

        {/* Eyebrow */}
        <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.2em', color: 'var(--goa-yellow)', textTransform: 'uppercase', marginBottom: 10 }}>
          02 — BUILDER DNA
        </div>

        {/* Section 1 — Role */}
        <h2 className="goa-title-serif" style={{
          fontSize: 'clamp(24px, 5vw, 36px)', lineHeight: 1.1, marginBottom: 6,
        }}>
          What do you build?
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 18 }}>
          Pick the one that fits you best.
        </p>

        {/* Role grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(96px, 1fr))',
          gap: 10, marginBottom: 32,
        }}>
          {ROLES.map((role) => (
            <button
              key={role.id}
              id={`role-${role.id.replace(/[\s/]/g, '-').toLowerCase()}`}
              className={`dna-tile ${selectedRole === role.id ? 'selected' : ''}`}
              onClick={() => handleRoleSelect(role.id)}
            >
              <span style={{ fontSize: 24 }}>{role.icon}</span>
              <span style={{
                fontSize: 11, fontWeight: 700, letterSpacing: '0.04em',
                color: selectedRole === role.id ? 'var(--goa-yellow)' : 'var(--text-muted)',
              }}>
                {role.label}
              </span>
            </button>
          ))}
        </div>

        {/* Section 2 — Stack */}
        <div ref={stackSectionRef}>
          <AnimatePresence>
            {selectedRole && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
              >
                <h3 className="goa-title-serif" style={{
                  fontSize: 'clamp(20px, 4vw, 28px)', marginBottom: 6,
                }}>
                  What's in your toolkit?
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 14 }}>
                  Select all that apply.
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
                  {STACKS.map((s) => (
                    <button
                      key={s}
                      id={`stack-${s.replace(/[.\s]/g, '-').toLowerCase()}`}
                      className={`stack-chip ${selectedStack.includes(s) ? 'selected' : ''}`}
                      onClick={() => toggleStack(s)}
                    >
                      {selectedStack.includes(s) && (
                        <span style={{ color: '#ffffff' }}>✓</span>
                      )}
                      {s}
                    </button>
                  ))}
                </div>

                {selectedStack.length > 0 && (
                  <div style={{
                    marginBottom: 20, padding: '10px 16px', borderRadius: 12,
                    background: 'rgba(255,0,122,0.15)',
                    border: '1.5px solid var(--goa-pink)',
                    fontSize: 13, color: '#ffffff', fontWeight: 600,
                  }}>
                    {selectedStack.length} tool{selectedStack.length !== 1 ? 's' : ''} selected: {selectedStack.join(', ')}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* ALWAYS VISIBLE FLOATING ACTION DOCK AT SCREEN BOTTOM */}
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
        boxShadow: '0 12px 40px rgba(0,0,0,0.6), 0 0 25px rgba(255,230,0,0.25)',
      }}>
        <button
          id="dna-continue-btn"
          className={canContinue ? 'btn-pink' : 'btn-journey'}
          onClick={() => selectedRole && canContinue && onComplete(selectedRole, selectedStack)}
          disabled={!canContinue}
          style={{
            width: '100%',
            opacity: canContinue ? 1 : 0.45,
            fontSize: 16,
            padding: '16px 20px',
            cursor: canContinue ? 'pointer' : 'not-allowed',
          }}
        >
          {canContinue
            ? 'CONTINUE THE JOURNEY ↓'
            : selectedRole
            ? 'Select at least one toolkit chip above'
            : 'Pick what you build first'}
        </button>
      </div>
    </div>
  );
}
