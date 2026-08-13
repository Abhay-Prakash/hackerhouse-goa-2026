'use client';

import Link from 'next/link';
import type { BuilderProfile } from '@/lib/types';

interface Props {
  card: BuilderProfile | null;
  cardId: string;
}

export default function CardSharePage({ card, cardId }: Props) {
  if (!card) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: 24, textAlign: 'center', fontFamily: "'Inter', sans-serif",
        background: 'var(--bg-void)', color: 'var(--text-primary)',
      }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
        <h1 style={{ margin: '0 0 8px', fontSize: 24, fontWeight: 800 }}>Card Not Found</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>This card may have expired or the link is incorrect.</p>
        <Link href="/" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '12px 28px', borderRadius: 12,
          background: 'linear-gradient(135deg, #00e5ff, #7c3aed)',
          color: '#04060f', fontWeight: 800, textDecoration: 'none', fontSize: 15,
        }}>
          START YOUR OWN JOURNEY →
        </Link>
      </div>
    );
  }

  const shareUrl = typeof window !== 'undefined'
    ? window.location.href
    : `https://hackerhousegoa.com/card/${cardId}`;

  const xText = `${card.builderClassEmoji ?? '⚡'} ${card.name} is ${card.builderClass} at HackerHouse Goa 2026 🌴\n\n${shareUrl}\n\n#FrameInGoa #HackerHouseGoa2026`;

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '32px 20px', fontFamily: "'Inter', sans-serif",
      background: 'radial-gradient(ellipse at 50% 30%, rgba(0,229,255,0.06) 0%, #04060f 65%)',
      color: 'var(--text-primary)',
    }}>
      {/* Card preview */}
      <div style={{ marginBottom: 32, textAlign: 'center' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 7,
          padding: '6px 14px', borderRadius: 999, marginBottom: 20,
          background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)',
          color: '#10b981', fontSize: 12, fontWeight: 700,
        }}>✓ Verified Builder</div>

        {/* Card thumbnail */}
        <div style={{
          width: 'clamp(280px, 85vw, 360px)',
          height: 'clamp(178px, 54vw, 228px)',
          borderRadius: 20,
          background: 'linear-gradient(145deg, #0f1e38, #090d1c)',
          border: '1.5px solid rgba(0,229,255,0.25)',
          boxShadow: '0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,229,255,0.08)',
          display: 'flex', flexDirection: 'column',
          padding: '16px 22px', position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)',
            backgroundSize: '26px 26px',
          }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, position: 'relative', zIndex: 1 }}>
            <span style={{ fontSize: 9, fontWeight: 800, color: '#00e5ff', letterSpacing: '0.1em' }}>HACKERHHOUSE GOA 2026</span>
            <span style={{ fontSize: 9, fontWeight: 700, color: '#ffd166' }}>#FrameInGoa</span>
          </div>
          <div style={{ height: 1, background: 'linear-gradient(90deg, #00e5ff, #7c3aed)', opacity: 0.4, marginBottom: 14, position: 'relative', zIndex: 1 }} />
          <div style={{ display: 'flex', gap: 14, alignItems: 'center', flex: 1, position: 'relative', zIndex: 1 }}>
            <div style={{
              width: 68, height: 68, borderRadius: '50%', flexShrink: 0,
              background: 'linear-gradient(135deg, #00e5ff, #7c3aed)', padding: 2,
            }}>
              <div style={{ width: '100%', height: '100%', borderRadius: '50%', overflow: 'hidden', background: '#090d1c' }}>
                {card.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={card.photo} alt={card.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>👤</div>
                )}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 7.5, color: '#00e5ff', fontWeight: 700, marginBottom: 3 }}>{card.builderClassEmoji} {card.builderClass}</div>
              <div style={{ fontSize: 19, fontWeight: 900, color: '#eef2ff', letterSpacing: '-0.02em' }}>{card.name.toUpperCase()}</div>
              <div style={{ fontSize: 10, color: '#ffd166', marginTop: 4 }}>{card.primaryRole}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Info */}
      <h1 style={{ margin: '0 0 6px', fontSize: 'clamp(20px, 5vw, 26px)', fontWeight: 800, textAlign: 'center' }}>
        {card.name} is a HackerHouse Builder
      </h1>
      <p style={{ color: 'var(--text-muted)', textAlign: 'center', margin: '0 0 28px', fontSize: 15 }}>
        {card.builderClassEmoji} {card.builderClass} · {card.primaryRole} · Goa 2026
      </p>

      {/* Actions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', maxWidth: 380 }}>
        <a
          href={`https://x.com/intent/tweet?text=${encodeURIComponent(xText)}`}
          target="_blank" rel="noopener noreferrer"
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            padding: '14px 28px', borderRadius: 12,
            background: '#000', border: '1.5px solid rgba(255,255,255,0.12)',
            color: '#fff', fontWeight: 700, fontSize: 15, textDecoration: 'none',
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="white">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
          </svg>
          Share to X · #FrameInGoa
        </a>
        <Link href="/" style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '14px 28px', borderRadius: 12,
          background: 'linear-gradient(135deg, #00e5ff, #7c3aed)',
          color: '#04060f', fontWeight: 800, fontSize: 15, textDecoration: 'none',
        }}>
          START YOUR OWN JOURNEY →
        </Link>
      </div>
    </div>
  );
}
