'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { BuilderProfile } from '@/lib/types';
import { processPhoto } from '@/lib/imageProcessor';
import { determineBuilderClass } from '@/lib/builderClass';
import Card3DPreview from '@/components/card/Card3DPreview';
import { renderCardFront, renderCardBack } from '@/lib/cardRenderer';
import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import CapPop from '@/components/gamified/CapPop';
import TreePop from '@/components/gamified/TreePop';
import ChairPop from '@/components/gamified/ChairPop';
import TreasureChest3D from '@/components/3d/TreasureChest3D';
import { verifyPortrait } from '@/lib/portrait-verification';

const MAIN_SITE_URL = 'https://hhgoa.com/';

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

export default function GamifiedTreasureJourney() {
  const [profile, setProfile] = useState<BuilderProfile>(() => ({
    builderId: `HH-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
    verified: true,
    name: '',
  }));

  // Progressive Unlocks
  const [mapUnlocked, setMapUnlocked] = useState(false);
  const [unlockedStep, setUnlockedStep] = useState<1 | 2 | 3 | 4>(1);
  const [earnedItems, setEarnedItems] = useState<{
    safariCap: boolean;
    coconutPalm: boolean;
    beachChair: boolean;
    treasureCard: boolean;
  }>({
    safariCap: false,
    coconutPalm: false,
    beachChair: false,
    treasureCard: false,
  });

  // Recent Unlocked Item Banner state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form Inputs
  const [photo, setPhoto] = useState<string | null>(null);
  const [rawPreview, setRawPreview] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [processingPhoto, setProcessingPhoto] = useState(false);

  // Portrait Scan State
  const [scanState, setScanState] = useState<'idle' | 'scanning' | 'verified' | 'rejected'>('idle');
  const [scanReason, setScanReason] = useState<string>('');

  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [selectedStack, setSelectedStack] = useState<string[]>([]);

  const [tribeChoice, setTribeChoice] = useState<'solo' | 'team' | null>(null);
  const [teamName, setTeamName] = useState('');

  // Climax state
  const [chestOpened, setChestOpened] = useState(false);
  const [isPersisting, setIsPersisting] = useState(false);

  // Download & Share
  const [downloading, setDownloading] = useState(false);
  const [downloadFace, setDownloadFace] = useState<'front' | 'back' | 'both'>('front');
  const [shareStatus, setShareStatus] = useState<'idle' | 'copied'>('idle');
  const [referStatus, setReferStatus] = useState<'idle' | 'copied'>('idle');

  // Scroll Refs
  const step01Ref = useRef<HTMLDivElement>(null);
  const step02Ref = useRef<HTMLDivElement>(null);
  const step03Ref = useRef<HTMLDivElement>(null);
  const step04Ref = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Step 1 Complete: Portrait & Name
  const handleCompletePortrait = () => {
    if (!photo || !name.trim()) return;
    setEarnedItems((prev) => ({ ...prev, safariCap: true }));
    setUnlockedStep(2);
    triggerToast('🤠 UNLOCKED: Safari Explorer Cap!');
    setTimeout(() => {
      step02Ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 1200);
  };

  // Step 2 Complete: Builder DNA
  const handleCompleteDna = () => {
    if (!selectedRole || selectedStack.length === 0) return;
    setEarnedItems((prev) => ({ ...prev, coconutPalm: true }));
    setUnlockedStep(3);
    triggerToast('🌴 UNLOCKED: Goan Coconut Palm!');
    setTimeout(() => {
      step03Ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 1200);
  };

  // Step 3 Complete: Tribe
  const handleCompleteTribe = () => {
    if (!tribeChoice || (tribeChoice === 'team' && !teamName.trim())) return;
    const cls = determineBuilderClass(selectedRole ?? undefined, selectedStack);
    setProfile((p) => ({
      ...p,
      tribe: tribeChoice,
      teamName: tribeChoice === 'team' ? teamName : undefined,
      builderClass: cls.name,
      builderClassEmoji: cls.emoji,
      builderClassDescription: cls.description,
    }));
    setEarnedItems((prev) => ({ ...prev, beachChair: true }));
    setUnlockedStep(4);
    triggerToast('🏖️ UNLOCKED: Goan Beach Lounge Chair!');
    setTimeout(() => {
      step04Ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 1200);
  };

  const handleOpenChest = async () => {
    if (isPersisting) return;
    setIsPersisting(true);
    try {
      const frontBase64 = await renderCardFront(profile);
      const backBase64 = await renderCardBack(profile, shareUrl);

      const res = await fetch('/api/cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile, frontBase64, backBase64 })
      });
      
      if (!res.ok) throw new Error('Failed to save card');

      setChestOpened(true);
      setEarnedItems((prev) => ({ ...prev, treasureCard: true }));
      triggerToast('🎁 TREASURE OPENED: Your Builder ID Card!');
    } catch (error) {
      console.error(error);
      triggerToast('❌ We couldn\'t save your Builder Card. Please try again.');
    } finally {
      setIsPersisting(false);
    }
  };

  // Photo Upload Handler
  const handleFile = useCallback(async (file: File) => {
    setProcessingPhoto(true);
    setScanState('scanning');
    setScanReason('');
    
    const raw = URL.createObjectURL(file);
    setRawPreview(raw);
    
    try {
      const result = await processPhoto(file);
      const dataUrl = result.dataUrl;

      // Run Verification
      const verification = await verifyPortrait(dataUrl);

      if (!verification.isValid) {
        setScanState('rejected');
        setScanReason(verification.reason || 'Portrait scan failed. Please try another photo.');
        setProcessingPhoto(false);
        // Clear photo so they have to upload again to proceed
        setPhoto(null);
        return;
      }

      setScanState('verified');
      setPhoto(dataUrl);
      setProfile((p) => ({ ...p, photo: dataUrl }));
      triggerToast('✓ PORTRAIT VERIFIED');
    } catch {
      setScanState('rejected');
      setScanReason('Could not process image. Please try another.');
      setPhoto(null);
    } finally {
      setProcessingPhoto(false);
    }
  }, []);

  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/card/${profile.cardId ?? ''}`
    : 'https://hackerhousegoa.com';

  // Download both PNGs
  const handleDownloadBoth = useCallback(async () => {
    setDownloading(true);
    setDownloadFace('both');
    try {
      const frontDataUrl = await renderCardFront(profile);
      const backDataUrl = await renderCardBack(profile, shareUrl);
      const safeName = profile.name.replace(/\s+/g, '-').toLowerCase() || 'builder';

      const aFront = document.createElement('a');
      aFront.href = frontDataUrl;
      aFront.download = `hh-goa-2026-front-${safeName}.png`;
      document.body.appendChild(aFront);
      aFront.click();
      document.body.removeChild(aFront);

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

  // Download single PNG
  const handleDownloadSingle = useCallback(async (face: 'front' | 'back') => {
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

  const handleShareX = useCallback(() => {
    const text = `Officially framed for HackerHouse Goa 2026 🌴\n\n${shareUrl}\n\n#FrameInGoa #HackerHouseGoa2026`;
    window.open(`https://x.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank', 'noopener,width=600,height=500');
  }, [shareUrl]);

  const handleReferFriend = useCallback(() => {
    const msg = `Hey! I just unlocked my official Builder ID Card for HackerHouse Goa 2026 🌴\n\nUnlock yours & join the House: ${shareUrl}\n\n#FrameInGoa #HackerHouseGoa2026`;
    if (navigator.share) {
      navigator.share({ title: 'HackerHouse Goa 2026', text: msg, url: shareUrl }).catch(() => {});
    } else {
      navigator.clipboard.writeText(msg);
      setReferStatus('copied');
      setTimeout(() => setReferStatus('idle'), 2000);
    }
  }, [shareUrl]);

  return (
    <div style={{
      background: 'linear-gradient(180deg, #075932 0%, #064e29 35%, #04381d 70%, #032814 100%)',
      minHeight: '100vh', color: '#ffffff', position: 'relative', overflowX: 'hidden',
    }}>

      {/* ── UNLOCKED ITEM TOAST NOTIFICATION ──────────────────────────────────── */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.8 }}
            style={{
              position: 'fixed', top: 70, left: '50%', transform: 'translateX(-50%)',
              zIndex: 2000, padding: '12px 28px', borderRadius: 999,
              background: 'linear-gradient(135deg, #FF007A, #FFE600)',
              color: '#000000', fontWeight: 900, fontSize: 15,
              boxShadow: '0 10px 30px rgba(255,0,122,0.5), 0 0 20px rgba(255,230,0,0.4)',
              border: '2px solid #ffffff', textTransform: 'uppercase', letterSpacing: '0.04em',
            }}
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── TOP STICKY HEADER BAR (2:47 PM STUDIO & INVENTORY BADGES) ────────── */}
      <div style={{
        position: 'sticky', top: 0, left: 0, right: 0, zIndex: 100,
        padding: '12px 24px',
        background: 'rgba(12,45,31,0.92)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255,230,0,0.3)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div className="goa-retro-mono" style={{ fontSize: 14, color: 'var(--goa-yellow)', fontWeight: 800 }}>
          2:47<span style={{ fontSize: 9 }}>PM</span> STUDIO
          <span style={{ color: 'var(--goa-pink)', margin: '0 6px' }}>•</span>
          <span style={{ fontSize: 11, color: '#00F0FF' }}>GOA 2026</span>
        </div>

        {/* GAMIFIED INVENTORY / EARNED ITEMS BAR WITH BOUNCE ANIMATION */}
        <div style={{
          display: 'flex', gap: 12, alignItems: 'center',
          background: 'rgba(6,78,41,0.85)', padding: '6px 16px', borderRadius: 999,
          border: '1.5px solid var(--goa-yellow)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
        }}>
          <span style={{ fontSize: 10, fontWeight: 900, color: 'var(--goa-yellow)', letterSpacing: '0.08em' }}>
            INVENTORY:
          </span>
          <motion.span
            animate={{ scale: earnedItems.safariCap ? [1, 1.4, 1] : 1 }}
            transition={{ duration: 0.3 }}
            style={{ opacity: earnedItems.safariCap ? 1 : 0.3, fontSize: 18, filter: earnedItems.safariCap ? 'drop-shadow(0 0 6px #00F0FF)' : 'grayscale(1)' }}
            title="Safari Cap"
          >
            🤠
          </motion.span>
          <motion.span
            animate={{ scale: earnedItems.coconutPalm ? [1, 1.4, 1] : 1 }}
            transition={{ duration: 0.3 }}
            style={{ opacity: earnedItems.coconutPalm ? 1 : 0.3, fontSize: 18, filter: earnedItems.coconutPalm ? 'drop-shadow(0 0 6px #00F0FF)' : 'grayscale(1)' }}
            title="Coconut Palm"
          >
            🌴
          </motion.span>
          <motion.span
            animate={{ scale: earnedItems.beachChair ? [1, 1.4, 1] : 1 }}
            transition={{ duration: 0.3 }}
            style={{ opacity: earnedItems.beachChair ? 1 : 0.3, fontSize: 18, filter: earnedItems.beachChair ? 'drop-shadow(0 0 6px #00F0FF)' : 'grayscale(1)' }}
            title="Beach Chair"
          >
            🏖️
          </motion.span>
          <motion.span
            animate={{ scale: earnedItems.treasureCard ? [1, 1.5, 1] : 1 }}
            transition={{ duration: 0.3 }}
            style={{ opacity: earnedItems.treasureCard ? 1 : 0.3, fontSize: 18, filter: earnedItems.treasureCard ? 'drop-shadow(0 0 8px #FFE600)' : 'grayscale(1)' }}
            title="Builder Card"
          >
            💎
          </motion.span>
        </div>

        <a
          href={MAIN_SITE_URL}
          target="_blank" rel="noopener noreferrer"
          className="btn-journey"
          style={{ padding: '8px 20px', fontSize: 13, textDecoration: 'none' }}
        >
          APPLY
        </a>
      </div>

      {/* ── HERO LANDING HEADER (WITH MOVING TEMPLATE ELEMENTS) ─────────────── */}
      <div style={{
        textAlign: 'center', paddingTop: 36, paddingBottom: 40,
        paddingLeft: 20, paddingRight: 20, maxWidth: 900, margin: '0 auto', position: 'relative', zIndex: 2,
      }}>
        <div className="goa-retro-mono" style={{ fontSize: 11, color: 'var(--goa-yellow)', letterSpacing: '0.2em', marginBottom: 12, textTransform: 'uppercase' }}>
          The official treasure hunt of your ID Card. Play smart. Be Fun.
        </div>

        {/* Animated Main Title */}
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          style={{ position: 'relative', display: 'inline-block', marginBottom: 16 }}
        >
          <h1 className="goa-title-serif" style={{
            fontSize: 'clamp(46px, 11vw, 115px)', lineHeight: 0.92, letterSpacing: '-0.02em', margin: 0,
          }}>
            HACKER<span style={{ display: 'inline-block', width: '0.2em' }} />HOUSE
          </h1>

          {/* Floating Devanagari Goa Badge */}
          <motion.div
            animate={{ rotate: [-4, 2, -4], scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="goa-hindi-badge"
            style={{
              position: 'absolute', top: '34%', left: '46%', transform: 'translate(-50%, -50%)',
              fontSize: 'clamp(24px, 5.5vw, 56px)', zIndex: 10,
            }}
          >
            गोवा
          </motion.div>
        </motion.div>

        <div className="goa-retro-mono" style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          maxWidth: 720, margin: '14px auto 28px', color: 'var(--goa-yellow)', fontSize: 12,
        }}>
          <span>GOA, INDIA · 28 - 31 OCT 2026</span>
          <span>2:47 PM STUDIO</span>
        </div>

        {/* ANIMATED BEACH TEMPLATE ILLUSTRATION (Moving Sun & Waves) */}
        <div style={{ maxWidth: 740, margin: '0 auto 28px', position: 'relative' }}>
          <svg viewBox="0 0 800 320" style={{ width: '100%', height: 'auto', display: 'block' }}>
            <defs>
              <linearGradient id="animSunGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FFE600" />
                <stop offset="100%" stopColor="#FF8000" />
              </linearGradient>
            </defs>

            {/* Pulsing Sun Rays */}
            <motion.g
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 2.5, repeat: Infinity }}
              stroke="#FFE600" strokeWidth="3"
            >
              <line x1="400" y1="160" x2="400" y2="10" />
              <line x1="400" y1="160" x2="270" y2="40" />
              <line x1="400" y1="160" x2="530" y2="40" />
              <line x1="400" y1="160" x2="160" y2="90" />
              <line x1="400" y1="160" x2="640" y2="90" />
            </motion.g>

            {/* Sun */}
            <circle cx="400" cy="160" r="75" fill="url(#animSunGrad)" style={{ filter: 'drop-shadow(0 0 35px rgba(255,230,0,0.8))' }} />

            {/* Swaying Ocean Waves */}
            <motion.path
              animate={{ d: [
                "M0 190 Q200 180 400 190 T800 190 L800 320 L0 320 Z",
                "M0 190 Q200 200 400 185 T800 195 L800 320 L0 320 Z",
                "M0 190 Q200 180 400 190 T800 190 L800 320 L0 320 Z"
              ] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              fill="#04381d" opacity="0.7"
            />
            <path d="M0 210 Q200 200 400 210 T800 210 L800 320 L0 320 Z" fill="#075932" fillOpacity="0.9" />
            <path d="M0 230 Q200 220 400 230 T800 230 L800 320 L0 320 Z" fill="var(--goa-yellow)" />

            {/* Beach Shack */}
            <g transform="translate(520, 170)">
              <rect x="0" y="25" width="90" height="55" fill="#075932" stroke="#ffffff" strokeWidth="2" />
              <polygon points="-10,25 45,-5 100,25" fill="#FFE600" stroke="#FFE600" strokeWidth="3" />
            </g>

            {/* UNLOCKED ITEMS PLACED ON BEACH ILLUSTRATION */}
            {earnedItems.coconutPalm && (
              <image href="/tree.png" x="140" y="100" width="100" height="130" />
            )}

            {earnedItems.beachChair && (
              <image href="/chair.png" x="300" y="220" width="70" height="70" />
            )}
          </svg>

          {/* 🚀 CTA & SCROLL INDICATOR OVERLAY (Resting on the yellow beach) */}
          <div style={{ position: 'absolute', bottom: -30, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 10 }}>
            {!mapUnlocked ? (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="btn-pink"
                onClick={() => {
                  setMapUnlocked(true);
                  triggerToast("🗺️ Map Acquired! The journey begins...");
                  setTimeout(() => {
                    step01Ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }, 400);
                }}
                style={{ fontSize: 18, padding: '22px 52px', letterSpacing: '0.06em', boxShadow: '0 10px 30px rgba(0,0,0,0.4)' }}
              >
                Click to get your treasure ID
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="btn-pink"
                onClick={() => {
                  step01Ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }}
                style={{ fontSize: 18, padding: '22px 52px', letterSpacing: '0.06em', boxShadow: '0 10px 30px rgba(0,0,0,0.4)' }}
              >
                CONTINUE YOUR JOURNEY ↓
              </motion.button>
            )}

            {/* ⬇️ BOUNCING SCROLL INDICATOR */}
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              style={{ marginTop: 24, opacity: 0.9, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
              onClick={() => step01Ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
            >
              <div className="goa-retro-mono" style={{ fontSize: 10, letterSpacing: '0.2em', color: 'var(--goa-yellow)', marginBottom: 8, textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
                {mapUnlocked ? "SCROLL DOWN" : "EXPLORE THE TRAIL"}
              </div>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--goa-yellow)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.8))' }}>
                <path d="M12 5v14M19 12l-7 7-7-7" />
              </svg>
            </motion.div>
          </div>
        </div>
      </div>


      {/* ── ZIGZAG TREASURE HUNT TRAIL WITH CONNECTING DASHED PATH LINE ───── */}
      <div style={{ maxWidth: 900, margin: '40px auto 80px', padding: '0 20px', position: 'relative' }}>

        {/* CONNECTING DASHED TRAIL LINE */}
        <div style={{
          position: 'absolute', left: '50%', top: 0, bottom: 0, width: 2,
          borderLeft: '2px dashed rgba(255,230,0,0.35)', transform: 'translateX(-50%)',
          pointerEvents: 'none', zIndex: 1,
        }} />

        {/* ── CHECKPOINT 01 (LEFT): PORTRAIT & NAME ────────────────────────── */}
        <div ref={step01Ref} style={{ position: 'relative', maxWidth: 520, margin: '0 auto 80px 0' }}>
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{
              background: mapUnlocked ? 'rgba(12,45,31,0.95)' : 'rgba(12,45,31,0.5)',
              border: earnedItems.safariCap ? '3px solid #00F0FF' : (mapUnlocked ? '3px solid var(--goa-yellow)' : '2px dashed rgba(255,230,0,0.25)'),
              boxShadow: earnedItems.safariCap ? '0 0 25px rgba(0,240,255,0.3)' : (mapUnlocked ? '0 16px 50px rgba(0,0,0,0.5)' : 'none'),
              borderRadius: 28, padding: '36px 28px',
              position: 'relative', zIndex: 3,
              filter: earnedItems.safariCap ? 'blur(12px)' : (mapUnlocked ? 'none' : 'grayscale(0.7)'),
              opacity: earnedItems.safariCap ? 0.4 : 1,
              pointerEvents: earnedItems.safariCap || !mapUnlocked ? 'none' : 'auto',
              transition: 'all 0.8s ease',
            }}
          >
            {!mapUnlocked && (
              <div style={{
                position: 'absolute', inset: 0, borderRadius: 28, zIndex: 20,
                background: 'rgba(12,45,31,0.88)', backdropFilter: 'blur(6px)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12,
                pointerEvents: 'auto'
              }}>
                <div style={{ fontSize: 48 }}>🔒</div>
                <div className="goa-title-serif" style={{ fontSize: 24, color: 'var(--goa-yellow)' }}>
                  CHECKPOINT 01 LOCKED
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>
                  Click &quot;GET A MAP&quot; above to start!
                </p>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span className="goa-retro-mono" style={{ fontSize: 10, color: 'var(--goa-yellow)', letterSpacing: '0.2em' }}>
                CHECKPOINT 01 — THE PORTRAIT
              </span>
              {earnedItems.safariCap ? (
                <span style={{ fontSize: 12, fontWeight: 900, color: '#00F0FF', background: 'rgba(0,240,255,0.15)', padding: '4px 10px', borderRadius: 999, border: '1px solid #00F0FF' }}>
                  🤠 SAFARI CAP EARNED ✓
                </span>
              ) : (
                <span style={{ fontSize: 11, color: 'var(--goa-yellow)', opacity: 0.8 }}>REWARD: 🤠 Safari Cap</span>
              )}
            </div>

            <h2 className="goa-title-serif" style={{ fontSize: 34, marginBottom: 6 }}>
              Put a face to the builder.
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 24 }}>
              Choose the photo that represents you in the Goan hunt.
            </p>

            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/heic,image/heif,.heic,.heif"
              style={{ display: 'none' }}
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />

            <div
              onClick={() => fileRef.current?.click()}
              style={{ display: 'flex', justifyContent: 'center', marginBottom: 24, cursor: 'pointer' }}
            >
              <div className="polaroid-frame" style={{ width: 190, height: 210, position: 'relative' }}>
                {earnedItems.safariCap && (
                  <div style={{ position: 'absolute', top: -16, right: -16, fontSize: 36, zIndex: 10 }}>
                    🤠
                  </div>
                )}
                <div style={{ width: 162, height: 162, background: '#e8e0d0', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                  {rawPreview ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={rawPreview} alt="portrait" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: scanState === 'scanning' ? 'blur(4px) grayscale(0.5)' : 'none', transition: 'all 0.3s' }} />
                      
                      {/* SCANNING OVERLAY */}
                      {scanState === 'scanning' && (
                        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,240,255,0.1)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                          <motion.div
                            animate={{ y: [-80, 80, -80] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                            style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 2, background: '#00F0FF', boxShadow: '0 0 10px #00F0FF' }}
                          />
                          <div style={{ background: 'rgba(0,0,0,0.6)', padding: '4px 10px', borderRadius: 6, fontSize: 10, fontWeight: 800, color: '#00F0FF', letterSpacing: '0.1em' }}>
                            SCANNING PORTRAIT...
                          </div>
                        </div>
                      )}

                      {/* VERIFIED OVERLAY */}
                      {scanState === 'verified' && !earnedItems.safariCap && (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ position: 'absolute', top: 8, right: 8, background: '#10B981', color: 'white', padding: 4, borderRadius: '50%', boxShadow: '0 0 10px rgba(16,185,129,0.5)' }}>
                          ✓
                        </motion.div>
                      )}
                    </>
                  ) : (
                    <div style={{ textAlign: 'center', color: '#8a7f6e' }}>
                      <div style={{ fontSize: 32 }}>📷</div>
                      <div style={{ fontSize: 11, fontWeight: 700 }}>TAP TO UPLOAD</div>
                    </div>
                  )}
                </div>
                <div style={{ height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800, color: '#8a7f6e', letterSpacing: '0.05em' }}>
                  {scanState === 'verified' ? '✓ PORTRAIT VERIFIED' : scanState === 'scanning' ? 'ANALYZING...' : 'YOUR PORTRAIT'}
                </div>
              </div>
            </div>

            {/* SCAN REJECTED ERROR MESSAGE */}
            <AnimatePresence>
              {scanState === 'rejected' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{ marginBottom: 24, overflow: 'hidden' }}
                >
                  <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #EF4444', borderRadius: 12, padding: 16 }}>
                    <div style={{ color: '#EF4444', fontSize: 11, fontWeight: 900, letterSpacing: '0.1em', marginBottom: 6 }}>
                      ⚠️ PORTRAIT SCAN FAILED
                    </div>
                    <div style={{ color: '#FCA5A5', fontSize: 13, lineHeight: 1.4, marginBottom: 12 }}>
                      {scanReason}
                    </div>
                    <button
                      onClick={() => fileRef.current?.click()}
                      style={{ background: 'transparent', border: '1px solid #EF4444', color: '#EF4444', padding: '6px 16px', borderRadius: 8, fontSize: 12, fontWeight: 700 }}
                    >
                      TRY ANOTHER PHOTO
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div style={{ marginBottom: 20 }}>
              <label className="goa-retro-mono" style={{ display: 'block', marginBottom: 6, fontSize: 11, color: 'var(--goa-yellow)' }}>
                YOUR NAME (FOR THE CARD)
              </label>
              <input
                className="input-field"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setProfile((p) => ({ ...p, name: e.target.value }));
                }}
              />
            </div>

            <button
              className="btn-pink"
              onClick={handleCompletePortrait}
              disabled={!photo || !name.trim()}
              style={{ width: '100%', opacity: photo && name.trim() ? 1 : 0.45 }}
            >
              {earnedItems.safariCap ? '✓ SAFARI CAP EARNED — NEXT STEP ↓' : 'CLAIM SAFARI CAP 🤠 & UNLOCK DNA ↓'}
            </button>
          </motion.div>

          {/* 3D Asset Overlay for Checkpoint 1 */}
          <AnimatePresence>
            {earnedItems.safariCap && (
              <div style={{ position: 'absolute', inset: 0, zIndex: 10, pointerEvents: 'none' }}>
                <CapPop photo={photo} />
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* ── CHECKPOINT 02 (RIGHT): BUILDER DNA (LOCKED UNTIL CHKPT 1 DONE) ── */}
        <div ref={step02Ref} style={{ position: 'relative', maxWidth: 560, margin: '0 0 80px auto' }}>
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{
              background: unlockedStep >= 2 ? 'rgba(12,45,31,0.95)' : 'rgba(12,45,31,0.5)',
              border: earnedItems.coconutPalm
                ? '3px solid #00F0FF'
                : unlockedStep >= 2
                ? '3px solid var(--goa-yellow)'
                : '2px dashed rgba(255,230,0,0.25)',
              boxShadow: earnedItems.coconutPalm ? '0 0 25px rgba(0,240,255,0.3)' : '0 16px 50px rgba(0,0,0,0.5)',
              borderRadius: 28, padding: '36px 28px',
              position: 'relative', zIndex: 3,
              filter: earnedItems.coconutPalm ? 'blur(12px)' : (unlockedStep >= 2 ? 'none' : 'grayscale(0.7)'),
              opacity: earnedItems.coconutPalm ? 0.4 : 1,
              pointerEvents: earnedItems.coconutPalm ? 'none' : 'auto',
              transition: 'all 0.8s ease',
            }}
          >
            {unlockedStep < 2 && (
              <div style={{
                position: 'absolute', inset: 0, borderRadius: 28, zIndex: 20,
                background: 'rgba(12,45,31,0.88)', backdropFilter: 'blur(6px)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12,
              }}>
                <div style={{ fontSize: 48 }}>🔒</div>
                <div className="goa-title-serif" style={{ fontSize: 24, color: 'var(--goa-yellow)' }}>
                  CHECKPOINT 02 LOCKED
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>
                  Complete Checkpoint 01 & claim your Safari Cap to unlock!
                </p>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span className="goa-retro-mono" style={{ fontSize: 10, color: '#00F0FF', letterSpacing: '0.2em', fontWeight: 800 }}>
                CHECKPOINT 02 — BUILDER DNA
              </span>
              {earnedItems.coconutPalm ? (
                <span style={{ fontSize: 12, fontWeight: 900, color: '#00F0FF', background: 'rgba(0,240,255,0.15)', padding: '4px 10px', borderRadius: 999, border: '1px solid #00F0FF' }}>
                  🌴 COCONUT PALM EARNED ✓
                </span>
              ) : (
                <span style={{ fontSize: 11, color: 'var(--goa-yellow)', opacity: 0.8 }}>REWARD: 🌴 Coconut Palm</span>
              )}
            </div>

            <h2 className="goa-title-serif" style={{ fontSize: 34, marginBottom: 6 }}>
              What do you build?
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 18 }}>
              Select your builder domain & tools.
            </p>

            {/* Roles */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(96px, 1fr))', gap: 10, marginBottom: 28 }}>
              {ROLES.map((role) => (
                <button
                  key={role.id}
                  className={`dna-tile ${selectedRole === role.id ? 'selected' : ''}`}
                  onClick={() => {
                    setSelectedRole(role.id);
                    setProfile((p) => ({ ...p, primaryRole: role.id }));
                  }}
                >
                  <span style={{ fontSize: 24 }}>{role.icon}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: selectedRole === role.id ? 'var(--goa-yellow)' : 'var(--text-muted)' }}>
                    {role.label}
                  </span>
                </button>
              ))}
            </div>

            {selectedRole && (
              <div>
                <h3 className="goa-title-serif" style={{ fontSize: 24, marginBottom: 6 }}>
                  What&apos;s in your toolkit?
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 14 }}>
                  Select all tools apply.
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
                  {STACKS.map((s) => (
                    <button
                      key={s}
                      className={`stack-chip ${selectedStack.includes(s) ? 'selected' : ''}`}
                      onClick={() => {
                        const next = selectedStack.includes(s) ? selectedStack.filter((x) => x !== s) : [...selectedStack, s];
                        setSelectedStack(next);
                        setProfile((p) => ({ ...p, stack: next }));
                      }}
                    >
                      {selectedStack.includes(s) && <span>✓</span>}
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              className="btn-pink"
              onClick={handleCompleteDna}
              disabled={!selectedRole || selectedStack.length === 0}
              style={{ width: '100%', opacity: selectedRole && selectedStack.length > 0 ? 1 : 0.45 }}
            >
              {earnedItems.coconutPalm ? '✓ COCONUT PALM EARNED — NEXT STEP ↓' : 'CLAIM COCONUT PALM 🌴 & UNLOCK TRIBE ↓'}
            </button>
          </motion.div>

          {/* 3D Asset Overlay for Checkpoint 2 */}
          <AnimatePresence>
            {earnedItems.coconutPalm && (
              <div style={{ position: 'absolute', inset: 0, zIndex: 10, pointerEvents: 'none' }}>
                <TreePop photo={photo} />
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* ── CHECKPOINT 03 (LEFT): YOUR TRIBE (LOCKED UNTIL CHKPT 2 DONE) ─── */}
        <div ref={step03Ref} style={{ position: 'relative', maxWidth: 520, margin: '0 auto 80px 0' }}>
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{
              background: unlockedStep >= 3 ? 'rgba(12,45,31,0.95)' : 'rgba(12,45,31,0.5)',
              border: earnedItems.beachChair
                ? '3px solid #00F0FF'
                : unlockedStep >= 3
                ? '3px solid var(--goa-yellow)'
                : '2px dashed rgba(255,230,0,0.25)',
              boxShadow: earnedItems.beachChair ? '0 0 25px rgba(0,240,255,0.3)' : '0 16px 50px rgba(0,0,0,0.5)',
              borderRadius: 28, padding: '36px 28px',
              position: 'relative', zIndex: 3,
              filter: earnedItems.beachChair ? 'blur(12px)' : (unlockedStep >= 3 ? 'none' : 'grayscale(0.7)'),
              opacity: earnedItems.beachChair ? 0.4 : 1,
              pointerEvents: earnedItems.beachChair ? 'none' : 'auto',
              transition: 'all 0.8s ease',
            }}
          >
            {unlockedStep < 3 && (
              <div style={{
                position: 'absolute', inset: 0, borderRadius: 28, zIndex: 20,
                background: 'rgba(12,45,31,0.88)', backdropFilter: 'blur(6px)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12,
              }}>
                <div style={{ fontSize: 48 }}>🔒</div>
                <div className="goa-title-serif" style={{ fontSize: 24, color: 'var(--goa-yellow)' }}>
                  CHECKPOINT 03 LOCKED
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>
                  Complete Builder DNA & claim your Coconut Palm to unlock!
                </p>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span className="goa-retro-mono" style={{ fontSize: 10, color: 'var(--goa-yellow)', letterSpacing: '0.2em' }}>
                CHECKPOINT 03 — YOUR TRIBE
              </span>
              {earnedItems.beachChair ? (
                <span style={{ fontSize: 12, fontWeight: 900, color: '#00F0FF', background: 'rgba(0,240,255,0.15)', padding: '4px 10px', borderRadius: 999, border: '1px solid #00F0FF' }}>
                  🏖️ BEACH CHAIR EARNED ✓
                </span>
              ) : (
                <span style={{ fontSize: 11, color: 'var(--goa-yellow)', opacity: 0.8 }}>REWARD: 🏖️ Beach Lounge Chair</span>
              )}
            </div>

            <h2 className="goa-title-serif" style={{ fontSize: 34, marginBottom: 6 }}>
              Who are you building with?
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 24 }}>
              Solo adventurer or crew squad?
            </p>

            <div style={{ display: 'flex', gap: 14, marginBottom: 24 }}>
              <button
                className={`tribe-card ${tribeChoice === 'solo' ? 'selected' : ''}`}
                onClick={() => setTribeChoice('solo')}
              >
                <div style={{ fontSize: 40, marginBottom: 8 }}>🏄</div>
                <div style={{ fontSize: 16, fontWeight: 900, color: tribeChoice === 'solo' ? 'var(--goa-yellow)' : '#fff' }}>SOLO</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Rolling solo</div>
              </button>

              <button
                className={`tribe-card ${tribeChoice === 'team' ? 'selected' : ''}`}
                onClick={() => setTribeChoice('team')}
              >
                <div style={{ fontSize: 40, marginBottom: 8 }}>🛖</div>
                <div style={{ fontSize: 16, fontWeight: 900, color: tribeChoice === 'team' ? 'var(--goa-yellow)' : '#fff' }}>CREW</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Building with crew</div>
              </button>
            </div>

            {tribeChoice === 'team' && (
              <div style={{ marginBottom: 20 }}>
                <label className="goa-retro-mono" style={{ display: 'block', marginBottom: 6, fontSize: 11, color: 'var(--goa-yellow)' }}>
                  CREW NAME
                </label>
                <input
                  className="input-field"
                  type="text"
                  placeholder="e.g. Night Owls"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                />
              </div>
            )}

            <button
              className="btn-pink"
              onClick={handleCompleteTribe}
              disabled={!tribeChoice || (tribeChoice === 'team' && !teamName.trim())}
              style={{ width: '100%', opacity: tribeChoice && (tribeChoice === 'solo' || teamName.trim()) ? 1 : 0.45 }}
            >
              {earnedItems.beachChair ? '✓ BEACH CHAIR EARNED — UNLOCK MYSTERY CHEST ↓' : 'CLAIM BEACH CHAIR 🏖️ & UNLOCK MYSTERY CHEST ↓'}
            </button>
          </motion.div>

          {/* 3D Asset Overlay for Checkpoint 3 */}
          <AnimatePresence>
            {earnedItems.beachChair && (
              <div style={{ position: 'absolute', inset: 0, zIndex: 10, pointerEvents: 'none' }}>
                <ChairPop photo={photo} />
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* ── CHECKPOINT 04 (CENTER CLIMAX): RISING SUN & MYSTERY CHEST ────── */}
        <div ref={step04Ref}>
          {unlockedStep >= 4 && (
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              style={{
                maxWidth: 680, margin: '0 auto 60px', textAlign: 'center',
                background: 'radial-gradient(ellipse at 50% 30%, rgba(255,230,0,0.2) 0%, rgba(255,0,122,0.12) 45%, rgba(12,45,31,0.98) 80%)',
                border: '3px solid var(--goa-yellow)', borderRadius: 36, padding: '48px 28px',
                boxShadow: '0 24px 70px rgba(0,0,0,0.7), 0 0 40px rgba(255,230,0,0.4)',
                position: 'relative', zIndex: 3,
              }}
            >
              {/* 🌅 ANIMATED RISING SUN & SEA VIEW */}
              <div style={{ maxWidth: 600, margin: '0 auto 20px', position: 'relative' }}>
                <svg viewBox="0 0 800 340" style={{ width: '100%', height: 'auto', display: 'block' }}>
                  <defs>
                    <linearGradient id="climaxRisingSun" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#FFE600" />
                      <stop offset="100%" stopColor="#FF8000" />
                    </linearGradient>
                  </defs>

                  {/* Radiating Sun Rays */}
                  <motion.g
                    animate={{ opacity: [0.5, 0.9, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    stroke="#FFE600" strokeWidth="4"
                  >
                    <line x1="400" y1="160" x2="400" y2="10" />
                    <line x1="400" y1="160" x2="260" y2="35" />
                    <line x1="400" y1="160" x2="540" y2="35" />
                    <line x1="400" y1="160" x2="140" y2="90" />
                    <line x1="400" y1="160" x2="660" y2="90" />
                  </motion.g>

                  {/* Rising Sun */}
                  <motion.circle
                    initial={{ cy: 220 }}
                    animate={{ cy: chestOpened ? 150 : 190 }}
                    transition={{ duration: 2, type: 'spring', stiffness: 100 }}
                    cx="400" r="85" fill="url(#climaxRisingSun)"
                  />

                  {/* Ocean Horizon */}
                  <path d="M0 190 Q200 180 400 190 T800 190 L800 340 L0 340 Z" fill="#04381d" opacity="0.8" />
                  <path d="M0 210 Q200 200 400 210 T800 210 L800 340 L0 340 Z" fill="#075932" opacity="0.9" />
                  <path d="M0 230 Q200 220 400 230 T800 230 L800 340 L0 340 Z" fill="var(--goa-yellow)" />

                  {/* Goan Beach Shack */}
                  <g transform="translate(530, 180)">
                    <rect x="0" y="25" width="90" height="55" fill="#075932" stroke="#ffffff" strokeWidth="2" />
                    <polygon points="-10,25 45,-5 100,25" fill="#FFE600" stroke="#FFE600" strokeWidth="3" />
                  </g>
                </svg>
              </div>

              {/* 🎁 TAP-TO-UNBOX MYSTERY CHEST INTERACTION */}
              <div style={{ position: 'relative', margin: '20px auto 36px' }}>
                {!chestOpened ? (
                  <motion.div
                    whileHover={{ scale: 1.06, rotate: [-2, 2, -2] }}
                    whileTap={{ scale: isPersisting ? 1 : 0.94 }}
                    onClick={isPersisting ? undefined : handleOpenChest}
                    style={{
                      cursor: 'pointer', width: 220, height: 200, margin: '0 auto',
                      borderRadius: 28, background: 'linear-gradient(135deg, #7c3aed, #FF007A, #064e29)',
                      border: '4px solid #00F0FF',
                      boxShadow: '0 0 45px rgba(0,240,255,0.5), 0 10px 30px rgba(0,0,0,0.6)',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    <motion.div
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      style={{ fontSize: 64, marginBottom: 8 }}
                    >
                      📦
                    </motion.div>
                    <div style={{
                      fontSize: 12, fontWeight: 900, color: '#ffffff',
                      background: 'rgba(0,0,0,0.5)', padding: '6px 16px', borderRadius: 999,
                      border: '1.5px solid #FF007A', letterSpacing: '0.06em',
                      display: 'flex', alignItems: 'center', gap: 6,
                    }}>
                      {isPersisting ? (
                        <><div className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} /> UNLOCKING...</>
                      ) : (
                        'TAP TO UNBOX 🎁'
                      )}
                    </div>
                  </motion.div>
                ) : (
                  /* UNBOXED 3D BUILDER ID CARD EMERGES WITH PARTICLE BURST */
                  <motion.div
                    initial={{ scale: 0.3, y: 80, opacity: 0 }}
                    animate={{ scale: 1, y: 0, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 140, damping: 18 }}
                  >
                    <div className="goa-hindi-badge" style={{ fontSize: 18, marginBottom: 12 }}>
                      ✨ TREASURE UNLOCKED · BUILDER IDENTITY
                    </div>

                    <h1 className="goa-title-serif" style={{ fontSize: 'clamp(34px, 7vw, 54px)', marginBottom: 4 }}>
                      {profile.builderClass ?? 'The Builder'}
                    </h1>

                    <p className="goa-retro-mono" style={{ color: 'var(--goa-yellow)', fontSize: 14, marginBottom: 28 }}>
                      {profile.builderClassEmoji} {profile.builderClass} · {profile.primaryRole}
                    </p>

                    {/* 3D Card floating up from Treasure Chest and Chest rendering together */}
                    <div style={{ marginBottom: 32, position: 'relative', height: 380 }}>
                      <div style={{ position: 'absolute', inset: 0, zIndex: 1, transform: 'translateY(100px)' }}>
                        <Canvas camera={{ position: [0, 2, 7], fov: 45 }}>
                          <ambientLight intensity={2} />
                          <directionalLight position={[0, 10, 10]} intensity={2} />
                          <Environment preset="city" />
                          <TreasureChest3D isOpen={chestOpened} />
                        </Canvas>
                      </div>
                      
                      <motion.div
                        initial={{ opacity: 0, y: 150, scale: 0.2 }}
                        animate={chestOpened ? { opacity: 1, y: 0, scale: 1 } : {}}
                        transition={{ delay: 0.5, duration: 1.5, type: 'spring', bounce: 0.3 }}
                        style={{ position: 'relative', zIndex: 2, height: '100%' }}
                      >
                        <Card3DPreview profile={profile} />
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* DOWNLOAD & SHARE BUTTONS */}
              {chestOpened && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                  
                  {/* PRIMARY: ENTER THE HOUSE */}
                  <div style={{ textAlign: 'center', marginBottom: 24 }}>
                    <p className="goa-retro-mono" style={{ fontSize: 12, color: 'var(--goa-yellow)', marginBottom: 12 }}>
                      YOU MADE THE JOURNEY.
                    </p>
                    <a
                      href={MAIN_SITE_URL}
                      target="_blank" rel="noopener noreferrer"
                      className="btn-pink"
                      style={{
                        display: 'inline-flex', width: '100%', justifyContent: 'center',
                        fontSize: 20, padding: '22px 40px', letterSpacing: '0.08em',
                        textDecoration: 'none', borderRadius: 18,
                        boxShadow: '0 10px 30px rgba(255,0,122,0.4)',
                      }}
                    >
                      ENTER THE HOUSE →
                    </a>
                  </div>

                  <div style={{ width: '100%', height: 2, background: 'linear-gradient(90deg, transparent, var(--goa-yellow), transparent)', margin: '24px 0' }} />

                  {/* SECONDARY: SHARE TO X */}
                  <button className="btn-x" onClick={handleShareX} style={{ width: '100%', marginBottom: 16, fontSize: 15, padding: '16px' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="white" style={{ marginRight: 8 }}>
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
                    </svg>
                    SHARE MY IDENTITY → X
                  </button>

                  {/* TERTIARY: DOWNLOAD BOTH */}
                  <button
                    className="btn-ghost"
                    onClick={handleDownloadBoth}
                    disabled={downloading}
                    style={{ width: '100%', fontSize: 13, padding: '14px', border: '1px solid rgba(255,255,255,0.2)' }}
                  >
                    {downloading && downloadFace === 'both' ? 'Preparing your Builder Card...' : 'DOWNLOAD FRONT + BACK'}
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}
        </div>

      </div>
    </div>
  );
}
