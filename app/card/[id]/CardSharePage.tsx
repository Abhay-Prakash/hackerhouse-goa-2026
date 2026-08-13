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
 <div style={{ fontSize: 48, marginBottom: 16 }}></div>
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

 const xText = `${card.builderClassEmoji ?? ''} ${card.name} is ${card.builderClass} at HackerHouse Goa 2026 \n\n${shareUrl}\n\n#FrameInGoa #HackerHouseGoa2026`;

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

 {/* Card thumbnail from Blob */}
 <div style={{
 width: 'clamp(240px, 75vw, 340px)',
 aspectRatio: '874 / 1240',
 borderRadius: 20,
 overflow: 'hidden',
 boxShadow: '0 40px 80px rgba(0,0,0,0.6), 0 0 0 1.5px rgba(0,229,255,0.25)',
 }}>
 <img 
 src={`/api/og?id=${cardId}`}
 alt={`${card.name}'s HackerHouse Goa ID Card`}
 style={{ width: '100%', height: '100%', objectFit: 'cover' }}
 />
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
