'use client';

import type { BuilderProfile } from '@/lib/types';

interface Props { profile: BuilderProfile; }

export default function BuilderCardFront({ profile }: Props) {
  const stackPreview = profile.stack?.slice(0, 3).join(' · ') ?? '';
  return (
    <div style={{
      width: '100%', height: '100%',
      background: 'linear-gradient(145deg, #075932 0%, #043b1f 100%)',
      borderRadius: 'inherit', position: 'relative', overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
      padding: '14px 18px 12px',
      fontFamily: "'Inter', sans-serif",
    }}>
      {/* Border */}
      <div style={{
        position: 'absolute', inset: 0, borderRadius: 'inherit', pointerEvents: 'none',
        background: 'linear-gradient(135deg, #ffe600, #ff007a, #ffe600)',
        mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
        WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
        maskComposite: 'exclude', WebkitMaskComposite: 'xor', padding: 2,
      }} />
      {/* Grid */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'linear-gradient(rgba(255,230,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,230,0,0.03) 1px, transparent 1px)',
        backgroundSize: '22px 22px',
      }} />

      {/* Top bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, position: 'relative', zIndex: 1 }}>
        <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 11, fontWeight: 900, color: '#ffe600' }}>HACKER HOUSE</span>
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 8.5, fontWeight: 700, color: '#ff007a' }}>#FrameInGoa</span>
      </div>
      <div style={{ height: 1.5, marginBottom: 10, background: 'linear-gradient(90deg, #ffe600, #ff007a)', position: 'relative', zIndex: 1 }} />

      {/* Content */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', flex: 1, position: 'relative', zIndex: 1 }}>
        {/* Photo */}
        <div style={{
          width: 72, height: 72, borderRadius: '50%', flexShrink: 0,
          background: 'linear-gradient(135deg, #ffe600, #ff007a)', padding: 2.5,
        }}>
          <div style={{ width: '100%', height: '100%', borderRadius: '50%', overflow: 'hidden', background: '#043b1f' }}>
            {profile.photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={profile.photo} alt={profile.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>👤</div>
            )}
          </div>
        </div>

        {/* Text */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Class badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 3,
            padding: '3px 8px', borderRadius: 999,
            background: '#ff007a', border: '1px solid #ffe600',
            fontSize: 7.5, color: '#ffffff', fontWeight: 800, marginBottom: 4,
          }}>
            {profile.builderClassEmoji} {profile.builderClass}
          </div>

          <div style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(14px, 4vw, 18px)', fontWeight: 900, color: '#ffe600',
            lineHeight: 1.1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            {profile.name.toUpperCase()}
          </div>

          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: '#ffffff', fontWeight: 700, marginTop: 3 }}>
            {profile.primaryRole}
          </div>

          {stackPreview && (
            <div style={{ fontSize: 8, color: '#a2dfbb', marginTop: 2 }}>
              {stackPreview}
            </div>
          )}
        </div>
      </div>

      {/* Bottom */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginTop: 8, paddingTop: 7, borderTop: '1px solid rgba(255,230,0,0.2)',
        position: 'relative', zIndex: 1,
      }}>
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 7.5, color: '#a2dfbb' }}>
          {profile.builderId}
        </span>
        <div style={{ display: 'flex', gap: 4 }}>
          {['#ffe600','#ff007a','#a3e635'].map((c) => (
            <div key={c} style={{ width: 6, height: 6, borderRadius: '50%', background: c }} />
          ))}
        </div>
      </div>
    </div>
  );
}
