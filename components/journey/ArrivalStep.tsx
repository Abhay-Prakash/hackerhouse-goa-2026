'use client';

import { motion } from 'framer-motion';

interface Props { onStart: () => void; }

export default function ArrivalStep({ onStart }: Props) {
  return (
    <div
      className="journey-stage"
      style={{
        background: 'radial-gradient(ellipse at 50% 30%, #086b3a 0%, #064e29 70%, #04381d 100%)',
        justifyContent: 'flex-start',
        textAlign: 'center',
        paddingTop: 70,
        paddingBottom: 60,
      }}
    >
      {/* Top Header Navigation */}
      <div style={{
        width: '100%', maxWidth: 860, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: 32, padding: '0 10px',
      }}>
        <div className="goa-retro-mono" style={{ fontSize: 13, color: 'var(--goa-yellow)' }}>
          2:47<span style={{ fontSize: 9 }}>PM</span> STUDIO
        </div>
        <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
          <span className="goa-retro-mono" style={{ fontSize: 11, color: '#ffffff', opacity: 0.8, letterSpacing: '0.12em' }}>
            CHECK HYPE
          </span>
          <button
            className="btn-journey"
            onClick={onStart}
            style={{ padding: '8px 20px', fontSize: 12, borderRadius: 8 }}
          >
            START
          </button>
        </div>
      </div>

      {/* Main Hero Header (Matches exact inspiration typography) */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        style={{ width: '100%', maxWidth: 860, marginBottom: 20 }}
      >
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <h1
            className="goa-title-serif"
            style={{
              fontSize: 'clamp(44px, 10vw, 110px)',
              lineHeight: 0.95,
              letterSpacing: '-0.02em',
              margin: 0,
            }}
          >
            HACKER<span style={{ display: 'inline-block', width: '0.2em' }} />HOUSE
          </h1>

          {/* Hot Pink Devanagari Badge overlapping "HACKER HOUSE" */}
          <div
            className="goa-hindi-badge"
            style={{
              position: 'absolute',
              top: '32%',
              left: '46%',
              transform: 'translate(-50%, -50%) rotate(-4deg)',
              fontSize: 'clamp(24px, 5vw, 54px)',
              boxShadow: '0 6px 20px rgba(0,0,0,0.4)',
              zIndex: 10,
            }}
          >
            गोवा
          </div>
        </div>

        {/* Date and Location Subtitle */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          maxWidth: 720, margin: '20px auto 0', padding: '0 10px',
          color: 'var(--goa-yellow)',
          fontFamily: "'Space Mono', monospace",
          fontSize: 'clamp(11px, 2vw, 14px)',
          fontWeight: 700,
          letterSpacing: '0.12em',
        }}>
          <span>GOA, INDIA · 28 - 31 OCT 2026</span>
          <span>2:47 PM STUDIO</span>
        </div>
      </motion.div>

      {/* Goan Beach Sunset Illustration (Inspiration SVG Graphic) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        style={{ width: '100%', maxWidth: 760, position: 'relative', margin: '20px auto 30px' }}
      >
        <svg viewBox="0 0 800 360" style={{ width: '100%', height: 'auto', display: 'block' }}>
          <defs>
            <linearGradient id="sunGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFE600" />
              <stop offset="100%" stopColor="#FF8000" />
            </linearGradient>
          </defs>

          {/* Sunburst Rays */}
          <g stroke="#FFE600" strokeWidth="3" opacity="0.75">
            <line x1="400" y1="180" x2="400" y2="40" />
            <line x1="400" y1="180" x2="280" y2="70" />
            <line x1="400" y1="180" x2="520" y2="70" />
            <line x1="400" y1="180" x2="180" y2="130" />
            <line x1="400" y1="180" x2="620" y2="130" />
          </g>

          {/* Sun */}
          <circle cx="400" cy="180" r="85" fill="url(#sunGrad)" />

          {/* Horizon & Ocean Waves */}
          <path d="M0 210 Q200 200 400 210 T800 210 L800 360 L0 360 Z" fill="#04381d" opacity="0.6" />
          <path d="M0 230 Q200 220 400 230 T800 230 L800 360 L0 360 Z" fill="#064e29" opacity="0.8" />
          <path d="M0 250 Q200 240 400 250 T800 250 L800 360 L0 360 Z" fill="#f4fbf7" />

          {/* Beach Shack */}
          <g transform="translate(510, 195)">
            <rect x="0" y="25" width="100" height="60" fill="#075932" stroke="#ffffff" strokeWidth="2" />
            <polygon points="-10,25 50,-5 110,25" fill="#FF007A" stroke="#FFE600" strokeWidth="3" />
            <rect x="15" y="0" width="70" height="20" fill="#FF007A" />
            <text x="50" y="14" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">GOA BEACH</text>
            {/* Stools */}
            <rect x="20" y="60" width="12" height="25" fill="#FFE600" />
            <rect x="44" y="60" width="12" height="25" fill="#FFE600" />
            <rect x="68" y="60" width="12" height="25" fill="#FFE600" />
          </g>

          {/* Left Palm Trees */}
          <g stroke="#032615" strokeWidth="3">
            <path d="M60 360 Q100 200 80 80" fill="none" stroke="#FFE600" strokeWidth="12" />
            <path d="M60 360 Q100 200 80 80" fill="none" stroke="#075932" strokeWidth="8" />
            {/* Leaves */}
            <path d="M80 80 Q20 30 -40 60 Q40 80 80 80 Z" fill="#075932" stroke="#FFE600" strokeWidth="2" />
            <path d="M80 80 Q140 30 200 60 Q120 80 80 80 Z" fill="#075932" stroke="#FFE600" strokeWidth="2" />
            <path d="M80 80 Q80 0 90 -50 Q95 40 80 80 Z" fill="#075932" stroke="#FFE600" strokeWidth="2" />
            <path d="M80 80 Q0 120 -50 160 Q30 110 80 80 Z" fill="#075932" stroke="#FFE600" strokeWidth="2" />
          </g>

          {/* Right Palm Trees */}
          <g transform="translate(640,0)">
            <path d="M100 360 Q60 200 80 90" fill="none" stroke="#FFE600" strokeWidth="12" />
            <path d="M100 360 Q60 200 80 90" fill="none" stroke="#075932" strokeWidth="8" />
            {/* Leaves */}
            <path d="M80 90 Q20 40 -30 70 Q40 90 80 90 Z" fill="#075932" stroke="#FFE600" strokeWidth="2" />
            <path d="M80 90 Q140 40 190 70 Q120 90 80 90 Z" fill="#075932" stroke="#FFE600" strokeWidth="2" />
            <path d="M80 90 Q80 10 90 -40 Q95 50 80 90 Z" fill="#075932" stroke="#FFE600" strokeWidth="2" />
          </g>

          {/* Beach Chairs & Umbrellas */}
          <g transform="translate(140, 210)">
            <polygon points="30,10 60,-15 90,10" fill="#FFE600" stroke="#032615" strokeWidth="2" />
            <line x1="60" y1="10" x2="60" y2="40" stroke="#032615" strokeWidth="3" />
          </g>
        </svg>
      </motion.div>

      {/* Main Start Journey CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}
      >
        <button
          id="start-journey-btn"
          className="btn-pink"
          onClick={onStart}
          style={{ fontSize: 18, padding: '20px 52px', letterSpacing: '0.08em' }}
        >
          START THE JOURNEY ↓
        </button>

        <p className="goa-retro-mono" style={{ fontSize: 12, color: 'var(--goa-yellow)', opacity: 0.9 }}>
          SCROLL DOWN TO UNLOCK YOUR BUILDER IDENTITY
        </p>
      </motion.div>
    </div>
  );
}
