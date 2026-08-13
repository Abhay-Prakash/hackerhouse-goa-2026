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
  const [viewMode, setViewMode] = useState<'free' | 'front' | 'back'>('free');
  const dragStart = useRef<{ x: number; y: number; rotY: number; rotX: number } | null>(null);
  const idleSway = useRef<ReturnType<typeof setInterval> | null>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.35); // fallback scale

  useEffect(() => {
    if (!sceneRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width > 0) {
          setScale(entry.contentRect.width / 874);
        }
      }
    });
    observer.observe(sceneRef.current);
    return () => observer.disconnect();
  }, []);

  const startIdle = useCallback(() => {
    if (viewMode !== 'free') return;
    idleSway.current = setInterval(() => setRotateY((r) => r + 0.06), 16);
  }, [viewMode]);
  const stopIdle = useCallback(() => {
    if (idleSway.current) { clearInterval(idleSway.current); idleSway.current = null; }
  }, []);

  const getNearestAngle = (current: number, target: number) => {
    const currentMod = ((current % 360) + 360) % 360;
    let delta = target - currentMod;
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;
    return current + delta;
  };

  useEffect(() => { 
    stopIdle();
    if (viewMode === 'free') {
      startIdle();
    } else if (viewMode === 'front') {
      setRotateX(0);
      setRotateY((r) => getNearestAngle(r, 0));
    } else if (viewMode === 'back') {
      setRotateX(0);
      setRotateY((r) => getNearestAngle(r, 180));
    }
    return () => stopIdle(); 
  }, [viewMode, startIdle, stopIdle]);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    if (viewMode !== 'free') return;
    e.preventDefault();
    stopIdle();
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY, rotY: rotateY, rotX: rotateX };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, [rotateY, rotateX, stopIdle, viewMode]);

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
    if (viewMode === 'free') {
      setRotateX(6);
      startIdle();
    }
  }, [startIdle, viewMode]);

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

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24, flexWrap: 'wrap', width: '100%' }}>
        {/* Scene */}
        <div
          ref={sceneRef}
          className="card-scene"
          style={{
            width: 'clamp(240px, 70vw, 340px)',
            aspectRatio: '874 / 1240',
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
              transition: viewMode !== 'free' ? 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)' : (isDragging ? 'none' : 'transform 0.1s ease-out'),
            }}
          >
            <div className="card-face" style={{ 
              backgroundColor: 'rgb(18, 70, 48)',
              visibility: showingBack ? 'hidden' : 'visible',
              boxShadow: `0 28px 56px rgba(0,0,0,0.75), 0 0 36px rgba(0,229,255,${isDragging ? 0.28 : 0.13})`
            }}>
              <div style={{ position: 'absolute', inset: 0, borderRadius: 24, overflow: 'hidden' }}>
                <div style={{ width: 874, height: 1240, transform: `scale(${scale})`, transformOrigin: 'top left' }}>
                  <BuilderCardFront profile={profile} />
                </div>
              </div>
            </div>
            <div className="card-face card-face-back" style={{ 
              backgroundColor: 'rgb(18, 70, 48)', 
              transform: 'rotateY(180deg)',
              visibility: showingBack ? 'visible' : 'hidden',
              boxShadow: `0 28px 56px rgba(0,0,0,0.75), 0 0 36px rgba(0,229,255,${isDragging ? 0.28 : 0.13})`
            }}>
              <div style={{ position: 'absolute', inset: 0, borderRadius: 24, overflow: 'hidden' }}>
                <div style={{ width: 874, height: 1240, transform: `scale(${scale})`, transformOrigin: 'top left' }}>
                  <BuilderCardBack profile={profile} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* View controls on the Right */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
          <button 
            className={`btn-ghost ${viewMode === 'front' ? 'active' : ''}`} 
            onClick={() => setViewMode('front')} 
            style={{ width: '120px', fontSize: 12, padding: '10px 16px', background: viewMode === 'front' ? 'rgba(255,255,255,0.1)' : 'transparent', border: viewMode === 'front' ? '1px solid rgba(255,255,255,0.3)' : '1px solid transparent' }}
          >
            FRONT
          </button>
          <button 
            className={`btn-ghost ${viewMode === 'free' ? 'active' : ''}`} 
            onClick={() => setViewMode('free')} 
            style={{ width: '120px', fontSize: 12, padding: '10px 16px', background: viewMode === 'free' ? 'rgba(255,255,255,0.1)' : 'transparent', border: viewMode === 'free' ? '1px solid rgba(255,255,255,0.3)' : '1px solid transparent' }}
          >
            3D PREVIEW
          </button>
          <button 
            className={`btn-ghost ${viewMode === 'back' ? 'active' : ''}`} 
            onClick={() => setViewMode('back')} 
            style={{ width: '120px', fontSize: 12, padding: '10px 16px', background: viewMode === 'back' ? 'rgba(255,255,255,0.1)' : 'transparent', border: viewMode === 'back' ? '1px solid rgba(255,255,255,0.3)' : '1px solid transparent' }}
          >
            BACK
          </button>

          {viewMode === 'free' && (
            <button id="flip-card-btn" className="btn-ghost" onClick={handleFlip} style={{ width: '120px', fontSize: 12, padding: '10px 16px', marginTop: 8, border: '1px solid rgba(240,220,80,0.4)', color: 'rgb(240, 220, 80)' }}>
              ↻ FLIP
            </button>
          )}
        </div>
      </div>

    </div>
  );
}
