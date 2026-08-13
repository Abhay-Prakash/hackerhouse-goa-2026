'use client';

import { useEffect, useState } from 'react';
import { generateQRDataUrl } from '@/lib/qr';
import type { BuilderProfile } from '@/lib/types';

interface Props { profile: BuilderProfile; }

const QR_URL = 'https://hackerhousegoa.com';

export default function BuilderCardBack({ profile }: Props) {
  const [qr, setQr] = useState<string | null>(null);
  const shareUrl = profile.cardId ? `${QR_URL}/card/${profile.cardId}` : QR_URL;

  useEffect(() => {
    generateQRDataUrl(shareUrl).then(setQr).catch(console.error);
  }, [shareUrl]);

  return (
    <div style={{
      width: '100%', height: '100%',
      background: 'linear-gradient(145deg, #043b1f 0%, #075932 100%)',
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

      {/* QR + info */}
      <div style={{ display: 'flex', gap: 12, flex: 1, position: 'relative', zIndex: 1 }}>
        {/* QR */}
        <div style={{
          background: '#fff', borderRadius: 8, padding: 4,
          width: 68, height: 68, flexShrink: 0,
          border: '2px solid #ffe600',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {qr ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={qr} alt="QR" style={{ width: 60, height: 60 }} />
          ) : (
            <div style={{ width: 60, height: 60, background: '#f4f4f4', borderRadius: 3 }} />
          )}
        </div>

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 3,
            padding: '3px 8px', borderRadius: 999,
            background: '#ff007a', border: '1px solid #ffe600',
            fontSize: 7.5, color: '#ffffff', fontWeight: 800, marginBottom: 5,
          }}>✓ VERIFIED BUILDER</div>

          {[
            { l: 'ID', v: profile.registrationId ?? profile.builderId },
            { l: 'CLASS', v: `${profile.builderClassEmoji ?? ''} ${profile.builderClass ?? '—'}` },
            { l: 'ROLE', v: profile.primaryRole ?? '—' },
            ...(profile.tribe === 'team' && profile.teamName ? [{ l: 'CREW', v: profile.teamName }] : []),
          ].map((row) => (
            <div key={row.l} style={{ marginBottom: 4 }}>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 6.5, color: '#a2dfbb', letterSpacing: '0.08em' }}>{row.l}</div>
              <div style={{
                fontSize: 9, color: '#ffffff', fontWeight: 700,
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>{row.v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginTop: 7, paddingTop: 6, borderTop: '1px solid rgba(255,230,0,0.2)',
        position: 'relative', zIndex: 1,
      }}>
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 7, color: '#a2dfbb' }}>hackerhousegoa.com</span>
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 7, color: '#ffe600', fontWeight: 700 }}>#FrameInGoa</span>
      </div>
    </div>
  );
}
