'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Card3DPreview from '@/components/card/Card3DPreview';
import { renderCardFront, renderCardBack } from '@/lib/cardRenderer';
import type { BuilderProfile } from '@/lib/types';

interface Props {
  profile: BuilderProfile;
  onUpdateProfile: (patch: Partial<BuilderProfile>) => void;
  onEnterHouse: () => void;
  onRebuild: () => void;
}

const MAIN_SITE_URL = 'https://hhgoa.com/';

export default function RevealStep({ profile, onUpdateProfile, onEnterHouse, onRebuild }: Props) {
  const [phase, setPhase] = useState<'intro' | 'card'>('intro');
  const [downloading, setDownloading] = useState(false);
  const [downloadFace, setDownloadFace] = useState<'front' | 'back' | 'both'>('front');
  const [shareStatus, setShareStatus] = useState<'idle' | 'copied'>('idle');
  const [referStatus, setReferStatus] = useState<'idle' | 'copied'>('idle');

  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/card/${profile.cardId ?? ''}`
    : 'https://hackerhousegoa.com';

  // Save card on mount if not yet saved
  useEffect(() => {
    if (profile.cardId) return;
    fetch('/api/cards', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile),
    })
      .then((r) => r.json())
      .then(({ cardId }) => { if (cardId) onUpdateProfile({ cardId }); })
      .catch(console.error);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setPhase('card'), 2200);
    return () => clearTimeout(t);
  }, []);

  const handleDownload = useCallback(async (face: 'front' | 'back') => {
    setDownloading(true);
    setDownloadFace(face);
    try {
      const dataUrl = face === 'front'
        ? await renderCardFront(profile)
        : await renderCardBack(profile, shareUrl);
      const safeName = profile.name.replace(/\s+/g, '-').toLowerCase() || 'builder';
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `hh-goa-2026-${face}-${safeName}.png`;
      a.click();
    } catch (e) { console.error(e); }
    finally { setDownloading(false); }
  }, [profile, shareUrl]);

  const handleDownloadBoth = useCallback(async () => {
    setDownloading(true);
    setDownloadFace('both');
    try {
      const frontDataUrl = await renderCardFront(profile);
      const backDataUrl = await renderCardBack(profile, shareUrl);
      const safeName = profile.name.replace(/\s+/g, '-').toLowerCase() || 'builder';

      // Trigger Front Download
      const aFront = document.createElement('a');
      aFront.href = frontDataUrl;
      aFront.download = `hh-goa-2026-front-${safeName}.png`;
      document.body.appendChild(aFront);
      aFront.click();
      document.body.removeChild(aFront);

      // Trigger Back Download after slight delay
      setTimeout(() => {
        const aBack = document.createElement('a');
        aBack.href = backDataUrl;
        aBack.download = `hh-goa-2026-back-${safeName}.png`;
        document.body.appendChild(aBack);
        aBack.click();
        document.body.removeChild(aBack);
      }, 300);
    } catch (e) {
      console.error(e);
    } finally {
      setTimeout(() => setDownloading(false), 600);
    }
  }, [profile, shareUrl]);

  const handleShareX = useCallback(() => {
    const text = `Officially framed for HackerHouse Goa 2026 🌴\n\n${shareUrl}\n\n#FrameInGoa #HackerHouseGoa2026`;
    window.open(`https://x.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank', 'noopener,width=600,height=500');
  }, [shareUrl]);

  const handleReferFriend = useCallback(() => {
    const msg = `Hey! I just generated my official Builder ID Card for HackerHouse Goa 2026 🌴\n\nGenerate yours & join the House: ${shareUrl}\n\n#FrameInGoa #HackerHouseGoa2026`;
    if (navigator.share) {
      navigator.share({ title: 'HackerHouse Goa 2026', text: msg, url: shareUrl }).catch(() => {});
    } else {
      navigator.clipboard.writeText(msg);
      setReferStatus('copied');
      setTimeout(() => setReferStatus('idle'), 2000);
    }
  }, [shareUrl]);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(shareUrl).catch(() => {});
    setShareStatus('copied');
    setTimeout(() => setShareStatus('idle'), 2000);
  }, [shareUrl]);

  return (
    <div
      className="journey-stage"
      style={{
        paddingTop: 80, paddingBottom: 60,
        background: 'radial-gradient(ellipse at 50% 60%, rgba(255,230,0,0.12) 0%, rgba(255,0,122,0.06) 40%, var(--bg-void) 75%)',
        justifyContent: 'flex-start', overflowY: 'auto',
        alignItems: 'center',
      }}
    >
      <AnimatePresence mode="wait">
        {phase === 'intro' ? (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            style={{ textAlign: 'center', position: 'relative', zIndex: 1, maxWidth: 480 }}
          >
            {/* Journey complete checklist */}
            <div style={{ marginBottom: 36 }}>
              {[
                { icon: '📸', label: 'Portrait' },
                { icon: '🧬', label: 'Builder DNA' },
                { icon: '👥', label: 'Tribe' },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.18, duration: 0.4 }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '10px 18px', marginBottom: 8,
                    borderRadius: 12, background: 'rgba(255,230,0,0.12)',
                    border: '1.5px solid var(--goa-yellow)',
                    color: 'var(--goa-yellow)', fontSize: 15, fontWeight: 700,
                    justifyContent: 'center',
                  }}
                >
                  <span>{item.icon}</span>
                  <span>✓ {item.label}</span>
                </motion.div>
              ))}
            </div>

            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 'clamp(20px, 5vw, 30px)', fontWeight: 800,
                letterSpacing: '-0.01em', marginBottom: 8,
                color: 'var(--text-muted)',
              }}
            >
              Your Goan mystery journey is complete.
            </motion.h2>
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="goa-title-serif"
              style={{
                fontSize: 'clamp(32px, 7vw, 54px)',
                letterSpacing: '-0.02em',
              }}
            >
              Meet your Builder Identity.
            </motion.h1>
          </motion.div>
        ) : (
          <motion.div
            key="card"
            initial={{ opacity: 0, y: 40, scale: 0.88 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 22 }}
            style={{ width: '100%', maxWidth: 520, display: 'flex', flexDirection: 'column', gap: 0, alignItems: 'center', position: 'relative', zIndex: 1 }}
          >
            {/* RISING SUN SEA VIEW GRAPHIC BACKDROP */}
            <div style={{ width: '100%', maxWidth: 440, marginBottom: -40, position: 'relative', zIndex: 0, opacity: 0.85 }}>
              <svg viewBox="0 0 500 200" style={{ width: '100%', height: 'auto', display: 'block' }}>
                <defs>
                  <linearGradient id="revealSunGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#FFE600" />
                    <stop offset="100%" stopColor="#FF8000" />
                  </linearGradient>
                </defs>
                {/* Sunburst rays */}
                <g stroke="#FFE600" strokeWidth="2" opacity="0.6">
                  <line x1="250" y1="140" x2="250" y2="20" />
                  <line x1="250" y1="140" x2="160" y2="40" />
                  <line x1="250" y1="140" x2="340" y2="40" />
                  <line x1="250" y1="140" x2="80" y2="80" />
                  <line x1="250" y1="140" x2="420" y2="80" />
                </g>
                {/* Rising Sun */}
                <circle cx="250" cy="140" r="65" fill="url(#revealSunGrad)" />
                {/* Sea Horizon */}
                <path d="M0 140 Q125 135 250 140 T500 140 L500 200 L0 200 Z" fill="#04381d" opacity="0.7" />
                <path d="M0 160 Q125 155 250 160 T500 160 L500 200 L0 200 Z" fill="#075932" opacity="0.9" />
              </svg>
            </div>

            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: 24, position: 'relative', zIndex: 2 }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '6px 16px', borderRadius: 999, marginBottom: 14,
                background: 'var(--goa-pink)', border: '2px solid var(--goa-yellow)',
                color: '#ffffff', fontSize: 13, fontWeight: 800,
              }}>
                ✓ Identity Unlocked
              </div>
              <h2 className="goa-title-serif" style={{
                fontSize: 'clamp(26px, 6vw, 38px)',
                letterSpacing: '-0.02em', marginBottom: 4,
              }}>
                Your Builder Card
              </h2>
              <p className="goa-retro-mono" style={{ color: 'var(--goa-yellow)', fontSize: 13 }}>
                {profile.builderClassEmoji} {profile.builderClass} · {profile.primaryRole}
              </p>
            </div>

            {/* 3D card */}
            <div style={{ position: 'relative', zIndex: 2, width: '100%' }}>
              <Card3DPreview profile={profile} />
            </div>

            {/* DOWNLOAD BOTH BUTTON (Primary) */}
            <button
              id="download-both-btn"
              className="btn-journey"
              onClick={handleDownloadBoth}
              disabled={downloading}
              style={{ width: '100%', fontSize: 16, padding: '16px 24px', marginTop: 28, marginBottom: 10, position: 'relative', zIndex: 2 }}
            >
              {downloading && downloadFace === 'both' ? (
                <><div className="spinner" style={{ width: 18, height: 18, borderWidth: 2, borderTopColor: '#000', borderColor: 'rgba(0,0,0,0.2)' }} /> Rendering Both PNGs…</>
              ) : '📥 DOWNLOAD BOTH (FRONT & BACK)'}
            </button>

            {/* Individual Download buttons */}
            <div style={{ display: 'flex', gap: 10, width: '100%', marginBottom: 14, position: 'relative', zIndex: 2 }}>
              <button
                id="download-front-btn"
                className="btn-ghost"
                onClick={() => handleDownload('front')}
                disabled={downloading}
                style={{ flex: 1, fontSize: 13, padding: '11px 14px' }}
              >
                {downloading && downloadFace === 'front' ? 'Rendering…' : 'Download Front'}
              </button>
              <button
                id="download-back-btn"
                className="btn-ghost"
                onClick={() => handleDownload('back')}
                disabled={downloading}
                style={{ flex: 1, fontSize: 13, padding: '11px 14px' }}
              >
                {downloading && downloadFace === 'back' ? 'Rendering…' : 'Download Back'}
              </button>
            </div>

            {/* REFER A FRIEND BUTTON */}
            <button
              id="refer-friend-btn"
              className="btn-ghost"
              onClick={handleReferFriend}
              style={{
                width: '100%', marginBottom: 10, fontSize: 14, fontWeight: 800,
                borderColor: 'var(--goa-pink)', color: '#ffffff', background: 'rgba(255,0,122,0.15)',
                position: 'relative', zIndex: 2,
              }}
            >
              {referStatus === 'copied' ? '✓ REFERRAL LINK COPIED!' : '👥 REFER A FRIEND TO THE HOUSE'}
            </button>

            {/* Share to X */}
            <button
              id="share-x-btn"
              className="btn-x"
              onClick={handleShareX}
              style={{ width: '100%', marginBottom: 10, fontSize: 14, position: 'relative', zIndex: 2 }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
              </svg>
              SHARE MY IDENTITY · #FrameInGoa
            </button>

            {/* Copy link */}
            <button
              id="copy-link-btn"
              onClick={handleCopy}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: shareStatus === 'copied' ? 'var(--goa-yellow)' : 'var(--text-muted)',
                fontSize: 12, marginTop: 4, display: 'flex', alignItems: 'center', gap: 5, letterSpacing: '0.04em',
                position: 'relative', zIndex: 2,
              }}
            >
              {shareStatus === 'copied' ? '✓ LINK COPIED' : '🔗 Copy shareable link'}
            </button>

            {/* Divider */}
            <div style={{
              width: '100%', height: 2, margin: '24px 0',
              background: 'linear-gradient(90deg, transparent, var(--goa-yellow), transparent)',
              position: 'relative', zIndex: 2,
            }} />

            {/* Enter the House — Links to https://hhgoa.com/ */}
            <div style={{ textAlign: 'center', width: '100%', position: 'relative', zIndex: 2 }}>
              <p className="goa-retro-mono" style={{ fontSize: 11, color: 'var(--goa-yellow)', marginBottom: 16, textTransform: 'uppercase' }}>
                Your Goan Builder identity is sealed.
              </p>
              <a
                id="enter-house-btn"
                href={MAIN_SITE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-pink"
                style={{ width: '100%', fontSize: 18, padding: '20px 40px', letterSpacing: '0.08em', textDecoration: 'none', display: 'inline-flex' }}
              >
                ENTER THE HOUSE →
              </a>
              <p style={{ marginTop: 10, fontSize: 12, color: 'var(--text-muted)' }}>
                hhgoa.com
              </p>
            </div>

            {/* Edit */}
            <button onClick={onRebuild} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--text-muted)', fontSize: 12, marginTop: 16,
              textDecoration: 'underline', position: 'relative', zIndex: 2,
            }}>
              ← Edit my card
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
