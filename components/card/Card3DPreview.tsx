'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import BuilderCardFront from './BuilderCardFront';
import BuilderCardBack from './BuilderCardBack';
import type { BuilderProfile } from '@/lib/types';

interface Props { profile: BuilderProfile; }

export default function Card3DPreview({ profile }: Props) {
  const [rotateY, setRotateY] = useState(-18);
  const [rotateX, setRotateX] = useState(6);
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef<{ x: number; y: number; rotY: number; rotX: number } | null>(null);
  const idleSway = useRef<ReturnType<typeof setInterval> | null>(null);

  const startIdle = useCallback(() => {
    idleSway.current = setInterval(() => setRotateY((r) => r + 0.06), 16);
  }, []);
  const stopIdle = useCallback(() => {
    if (idleSway.current) { clearInterval(idleSway.current); idleSway.current = null; }
  }, []);

  useEffect(() => { startIdle(); return () => stopIdle(); }, [startIdle, stopIdle]);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    stopIdle();
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY, rotY: rotateY, rotX: rotateX };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, [rotateY, rotateX, stopIdle]);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging || !dragStart.current) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    setRotateY(dragStart.current.rotY + dx * 0.65);
    setRotateX(Math.max(-28, Math.min(28, dragStart.current.rotX - dy * 0.32)));
  }, [isDragging]);

  const onPointerUp = useCallback(() => {
    setIsDragging(false);
    dragStart.current = null;
    setRotateX(6);
    startIdle();
  }, [startIdle]);

  // Animated flip
  const handleFlip = () => {
    stopIdle();
    const target = rotateY + 180;
    const start = rotateY;
    const dur = 600;
    const t0 = performance.now();
    const step = (now: number) => {
      const t = Math.min((now - t0) / dur, 1);
      const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      setRotateY(start + (target - start) * ease);
      if (t < 1) requestAnimationFrame(step);
      else startIdle();
    };
    requestAnimationFrame(step);
  };

  const norm = ((rotateY % 360) + 360) % 360;
  const showingBack = norm >= 90 && norm < 270;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
      {/* Hint */}
      <div style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.08em', display: 'flex', gap: 14 }}>
        <span>↔ DRAG TO ROTATE</span><span>·</span><span>TAP FLIP</span>
      </div>

      {/* Scene */}
      <div
        className="card-scene"
        style={{
          width: 'clamp(280px, 82vw, 380px)',
          height: 'clamp(178px, 52vw, 240px)',
          cursor: isDragging ? 'grabbing' : 'grab',
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        <div
          className="card-3d"
          style={{
            transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
            filter: `drop-shadow(0 28px 56px rgba(0,0,0,0.75)) drop-shadow(0 0 36px rgba(0,229,255,${isDragging ? 0.28 : 0.13}))`,
          }}
        >
          <div className="card-face"><BuilderCardFront profile={profile} /></div>
          <div className="card-face card-face-back"><BuilderCardBack profile={profile} /></div>
        </div>
      </div>

      {/* Side label */}
      <div style={{
        fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
        color: showingBack ? 'var(--accent-gold)' : 'var(--accent-teal)',
        transition: 'color 0.3s',
      }}>
        {showingBack ? '↩ BACK OF CARD' : '↪ FRONT OF CARD'}
      </div>

      {/* Flip button */}
      <button id="flip-card-btn" className="btn-ghost" onClick={handleFlip} style={{ fontSize: 13, padding: '9px 22px' }}>
        ↻ FLIP CARD
      </button>
    </div>
  );
}
