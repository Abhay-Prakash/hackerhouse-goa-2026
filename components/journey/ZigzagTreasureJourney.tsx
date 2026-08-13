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
import SafariCap3D from '@/components/3d/SafariCap3D';
import CoconutTree3D from '@/components/3d/CoconutTree3D';
import BeachChair3D from '@/components/3d/BeachChair3D';
import TreasureChest3D from '@/components/3d/TreasureChest3D';

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

export default function ZigzagTreasureJourney() {
  const [profile, setProfile] = useState<BuilderProfile>(() => ({
    builderId: `HH-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
    verified: true,
    name: '',
  }));

  // Stage unlocks
  const [photo, setPhoto] = useState<string | null>(null);
  const [rawPreview, setRawPreview] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [processingPhoto, setProcessingPhoto] = useState(false);

  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [selectedStack, setSelectedStack] = useState<string[]>([]);

  const [tribeChoice, setTribeChoice] = useState<'solo' | 'team' | null>(null);
  const [teamName, setTeamName] = useState('');

  const [downloading, setDownloading] = useState(false);
  const [downloadFace, setDownloadFace] = useState<'front' | 'back' | 'both'>('front');
  const [shareStatus, setShareStatus] = useState<'idle' | 'copied'>('idle');
  const [referStatus, setReferStatus] = useState<'idle' | 'copied'>('idle');

  // 3D Gamification Locks
  const [step1Locked, setStep1Locked] = useState(false);
  const [step2Locked, setStep2Locked] = useState(false);
  const [step3Locked, setStep3Locked] = useState(false);
  const [treasureOpen, setTreasureOpen] = useState(false);

  // Refs for smooth scroll target sections
  const stepDnaRef = useRef<HTMLDivElement>(null);
  const stepTribeRef = useRef<HTMLDivElement>(null);
  const stepClassRef = useRef<HTMLDivElement>(null);
  const stepRevealRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // Photo handler
  const handleFile = useCallback(async (file: File) => {
    setProcessingPhoto(true);
    const raw = URL.createObjectURL(file);
    setRawPreview(raw);
    try {
      const result = await processPhoto(file);
      setPhoto(result.dataUrl);
      setRawPreview(result.dataUrl);
      setProfile((p) => ({ ...p, photo: result.dataUrl }));
    } catch {
      alert('Could not process photo. Try another.');
    } finally {
      setProcessingPhoto(false);
    }
  }, []);

  const handleNameChange = (newName: string) => {
    setName(newName);
    setProfile((p) => ({ ...p, name: newName }));
  };

  const handlePortraitComplete = () => {
    if (!photo || !name.trim()) return;
    setStep1Locked(true);
    setTimeout(() => {
      stepDnaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 1000); // Wait 1s so user sees the 3D Cap emerge!
  };

  const handleRoleSelect = (roleId: string) => {
    const isNew = selectedRole !== roleId;
    const newRole = isNew ? roleId : null;
    setSelectedRole(newRole);
    setProfile((p) => ({ ...p, primaryRole: newRole ?? undefined }));
  };

  const toggleStack = (s: string) => {
    setSelectedStack((prev) => {
      const next = prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s];
      setProfile((p) => ({ ...p, stack: next }));
      return next;
    });
  };

  const handleDnaComplete = () => {
    if (!selectedRole || selectedStack.length === 0) return;
    setStep2Locked(true);
    setTimeout(() => {
      stepTribeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 1000); // Wait 1s for 3D Coconut Tree
  };

  const handleTribeSelect = (choice: 'solo' | 'team', tName?: string) => {
    setTribeChoice(choice);
    if (choice === 'team') setTeamName(tName ?? '');
    
    // Only proceed if Solo, or if Team AND they provided a team name via button click
    const isTeamWithValidName = choice === 'team' && (tName || teamName);
    
    if (choice === 'solo' || isTeamWithValidName) {
      const cls = determineBuilderClass(selectedRole ?? undefined, selectedStack);
      setProfile((p) => ({
        ...p,
        tribe: choice,
        teamName: choice === 'team' ? (tName ?? teamName) : undefined,
        builderClass: cls.name,
        builderClassEmoji: cls.emoji,
        builderClassDescription: cls.description,
      }));
      setStep3Locked(true);
      setTimeout(() => {
        stepClassRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 1000); // Wait 1s for 3D Beach Chair
    }
  };

  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/card/${profile.cardId ?? ''}`
    : 'https://hackerhousegoa.com';

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
    const msg = `Hey! I just generated my official Builder ID Card for HackerHouse Goa 2026 🌴\n\nGenerate yours & join the House: ${shareUrl}\n\n#FrameInGoa #HackerHouseGoa2026`;
    if (navigator.share) {
      navigator.share({ title: 'HackerHouse Goa 2026', text: msg, url: shareUrl }).catch(() => {});
    } else {
      navigator.clipboard.writeText(msg);
      setReferStatus('copied');
      setTimeout(() => setReferStatus('idle'), 2000);
    }
  }, [shareUrl]);

  const isPortraitDone = !!photo && !!name.trim();
  const isDnaDone = !!selectedRole && selectedStack.length > 0;
  const isTribeDone = !!tribeChoice && (tribeChoice === 'solo' || teamName.trim().length > 0);

  return (
    <div style={{
      background: 'linear-gradient(180deg, #075932 0%, #064e29 30%, #04381d 70%, #032814 100%)',
      minHeight: '100vh',
      color: '#ffffff',
      position: 'relative',
      overflowX: 'hidden',
    }}>
      {/* ── TOP HEADER BAR (Exact 2:47 PM STUDIO & APPLY layout) ──────────────── */}
      <div style={{
        position: 'sticky', top: 0, left: 0, right: 0, zIndex: 100,
        padding: '12px 24px',
        background: 'linear-gradient(to bottom, rgba(7,89,50,0.96) 80%, transparent)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,230,0,0.2)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div className="goa-retro-mono" style={{ fontSize: 14, color: 'var(--goa-yellow)' }}>
          2:47<span style={{ fontSize: 9 }}>PM</span> STUDIO
        </div>

        {/* Live Milestone Trail */}
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <span style={{
            fontSize: 10, fontWeight: 800, padding: '3px 10px', borderRadius: 999,
            background: isPortraitDone ? 'var(--goa-yellow)' : 'rgba(255,255,255,0.1)',
            color: isPortraitDone ? '#000' : '#fff',
          }}>📸 PORTRAIT {isPortraitDone ? '✓' : ''}</span>

          <span style={{
            fontSize: 10, fontWeight: 800, padding: '3px 10px', borderRadius: 999,
            background: isDnaDone ? 'var(--goa-yellow)' : 'rgba(255,255,255,0.1)',
            color: isDnaDone ? '#000' : '#fff',
          }}>🧬 DNA {isDnaDone ? '✓' : ''}</span>

          <span style={{
            fontSize: 10, fontWeight: 800, padding: '3px 10px', borderRadius: 999,
            background: isTribeDone ? 'var(--goa-yellow)' : 'rgba(255,255,255,0.1)',
            color: isTribeDone ? '#000' : '#fff',
          }}>👥 TRIBE {isTribeDone ? '✓' : ''}</span>
        </div>

        {/* APPLY Link button */}
        <a
          href={MAIN_SITE_URL}
          target="_blank" rel="noopener noreferrer"
          className="btn-journey"
          style={{ padding: '8px 20px', fontSize: 13, textDecoration: 'none' }}
        >
          APPLY
        </a>
      </div>

      {/* ── HERO SECTION ──────────────────────────────────────────────────────── */}
      <div style={{
        textAlign: 'center', paddingTop: 40, paddingBottom: 40,
        paddingLeft: 20, paddingRight: 20,
        maxWidth: 900, margin: '0 auto', position: 'relative', zIndex: 2,
      }}>
        <div className="goa-retro-mono" style={{ fontSize: 11, color: 'var(--goa-yellow)', letterSpacing: '0.2em', marginBottom: 12 }}>
          HACKERHOUSE GOA 2026 · TREASURE HUNT SIMULATION
        </div>

        <div style={{ position: 'relative', display: 'inline-block', marginBottom: 16 }}>
          <h1 className="goa-title-serif" style={{
            fontSize: 'clamp(46px, 11vw, 115px)', lineHeight: 0.92, letterSpacing: '-0.02em', margin: 0,
          }}>
            HACKER<span style={{ display: 'inline-block', width: '0.2em' }} />HOUSE
          </h1>
          <div className="goa-hindi-badge" style={{
            position: 'absolute', top: '34%', left: '46%', transform: 'translate(-50%, -50%) rotate(-4deg)',
            fontSize: 'clamp(24px, 5.5vw, 56px)', zIndex: 10,
          }}>
            गोवा
          </div>
        </div>

        <div className="goa-retro-mono" style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          maxWidth: 720, margin: '14px auto 32px', color: 'var(--goa-yellow)', fontSize: 12,
        }}>
          <span>GOA, INDIA · 28 - 31 OCT 2026</span>
          <span>2:47 PM STUDIO</span>
        </div>

        {/* Goan Beach Sunset Illustration */}
        <div style={{ maxWidth: 740, margin: '0 auto 30px' }}>
          <svg viewBox="0 0 800 320" style={{ width: '100%', height: 'auto', display: 'block' }}>
            <defs>
              <linearGradient id="heroSun" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FFE600" />
                <stop offset="100%" stopColor="#FF8000" />
              </linearGradient>
            </defs>
            <g stroke="#FFE600" strokeWidth="3" opacity="0.6">
              <line x1="400" y1="160" x2="400" y2="20" />
              <line x1="400" y1="160" x2="280" y2="50" />
              <line x1="400" y1="160" x2="520" y2="50" />
              <line x1="400" y1="160" x2="180" y2="100" />
              <line x1="400" y1="160" x2="620" y2="100" />
            </g>
            <circle cx="400" cy="160" r="75" fill="url(#heroSun)" />
            <path d="M0 190 Q200 180 400 190 T800 190 L800 320 L0 320 Z" fill="#04381d" opacity="0.7" />
            <path d="M0 210 Q200 200 400 210 T800 210 L800 320 L0 320 Z" fill="#075932" fillOpacity="0.9" />
            <path d="M0 230 Q200 220 400 230 T800 230 L800 320 L0 320 Z" fill="#f4fbf7" />

            {/* Shack */}
            <g transform="translate(520, 170)">
              <rect x="0" y="25" width="90" height="55" fill="#075932" stroke="#ffffff" strokeWidth="2" />
              <polygon points="-10,25 45,-5 100,25" fill="#FF007A" stroke="#FFE600" strokeWidth="3" />
              <text x="45" y="14" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">GOA BEACH</text>
            </g>
          </svg>
        </div>

        <p className="goa-retro-mono" style={{ fontSize: 13, color: 'var(--goa-yellow)', marginBottom: 24 }}>
          ↓ SCROLL DOWN TO EXPLORE THE BEACH & DISCOVER YOUR IDENTITY ↓
        </p>
      </div>

      {/* ── WINDING ZIGZAG TREASURE TRAIL SVG OVERLAY ────────────────────────── */}
      <div style={{ position: 'relative', maxWidth: 900, margin: '0 auto', padding: '0 20px' }}>

        {/* ── CHECKPOINT 01 (LEFT ZIGZAG): THE PORTRAIT ─────────────────────── */}
        <div style={{ position: 'relative', maxWidth: 520, margin: '0 auto 80px 0' }}>
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{
              background: 'rgba(3,38,21,0.92)',
              border: '2px solid var(--goa-yellow)',
              borderRadius: 24, padding: '32px 24px',
              boxShadow: '0 12px 40px rgba(0,0,0,0.4)',
              position: 'relative', zIndex: 3,
              filter: step1Locked ? 'blur(12px)' : 'none',
              opacity: step1Locked ? 0.4 : 1,
              pointerEvents: step1Locked ? 'none' : 'auto',
              transition: 'all 0.8s ease',
            }}
          >
          <div className="goa-retro-mono" style={{ fontSize: 10, color: 'var(--goa-yellow)', letterSpacing: '0.2em', marginBottom: 8 }}>
            CHECKPOINT 01 — THE PORTRAIT
          </div>
          <h2 className="goa-title-serif" style={{ fontSize: 32, marginBottom: 6 }}>
            Put a face to the builder.
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 24 }}>
            Choose the photo that represents you.
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
            <div className="polaroid-frame" style={{ width: 190, height: 210 }}>
              <div style={{ width: 162, height: 162, background: '#e8e0d0', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {rawPreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={rawPreview} alt="portrait" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ textAlign: 'center', color: '#8a7f6e' }}>
                    <div style={{ fontSize: 32 }}>📷</div>
                    <div style={{ fontSize: 11, fontWeight: 700 }}>TAP TO UPLOAD</div>
                  </div>
                )}
              </div>
              <div style={{ height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800, color: '#8a7f6e' }}>
                {photo ? '✓ PORTRAIT CAPTURED' : 'YOUR PORTRAIT'}
              </div>
            </div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label className="goa-retro-mono" style={{ display: 'block', marginBottom: 6, fontSize: 11, color: 'var(--goa-yellow)' }}>
              YOUR NAME (FOR THE CARD)
            </label>
            <input
              className="input-field"
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
            />
          </div>

          <button
            className="btn-pink"
            onClick={handlePortraitComplete}
            disabled={!isPortraitDone}
            style={{ width: '100%', opacity: isPortraitDone ? 1 : 0.45 }}
          >
            {isPortraitDone ? 'NEXT CHECKPOINT ↓' : 'Upload photo & name to unlock path'}
          </button>
        </motion.div>

          {/* 3D Asset Overlay for Checkpoint 1 */}
          <AnimatePresence>
            {step1Locked && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: 'spring', bounce: 0.5, duration: 1 }}
                style={{ position: 'absolute', inset: 0, zIndex: 10 }}
              >
                <Canvas camera={{ position: [0, 1, 4.5], fov: 45 }}>
                  <ambientLight intensity={1.5} />
                  <directionalLight position={[5, 10, 5]} intensity={2} />
                  <Environment preset="city" />
                  <SafariCap3D />
                </Canvas>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── CHECKPOINT 02 (RIGHT ZIGZAG): BUILDER DNA ────────────────────── */}
        <div ref={stepDnaRef} style={{ position: 'relative', maxWidth: 560, margin: '0 0 80px auto' }}>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{
              background: 'rgba(3,38,21,0.92)',
              border: '2px solid var(--goa-yellow)',
              borderRadius: 24, padding: '32px 24px',
              boxShadow: '0 12px 40px rgba(0,0,0,0.4)',
              position: 'relative', zIndex: 3,
              filter: step2Locked ? 'blur(12px)' : 'none',
              opacity: step2Locked ? 0.4 : 1,
              pointerEvents: step2Locked ? 'none' : 'auto',
              transition: 'all 0.8s ease',
            }}
          >
            <div className="goa-retro-mono" style={{ fontSize: 10, color: 'var(--goa-yellow)', letterSpacing: '0.2em', marginBottom: 8 }}>
              CHECKPOINT 02 — BUILDER DNA
            </div>
            <h2 className="goa-title-serif" style={{ fontSize: 32, marginBottom: 6 }}>
              What do you build?
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 18 }}>
              Select your primary build domain.
            </p>

            {/* Roles */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(96px, 1fr))', gap: 10, marginBottom: 28 }}>
              {ROLES.map((role) => (
                <button
                  key={role.id}
                  className={`dna-tile ${selectedRole === role.id ? 'selected' : ''}`}
                  onClick={() => handleRoleSelect(role.id)}
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
                  Select all tools you use.
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
                  {STACKS.map((s) => (
                    <button
                      key={s}
                      className={`stack-chip ${selectedStack.includes(s) ? 'selected' : ''}`}
                      onClick={() => toggleStack(s)}
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
              onClick={handleDnaComplete}
              disabled={!isDnaDone}
              style={{ width: '100%', opacity: isDnaDone ? 1 : 0.45 }}
            >
              {isDnaDone ? 'NEXT CHECKPOINT ↓' : selectedRole ? 'Select at least 1 tool' : 'Select a domain'}
            </button>
          </motion.div>

          {/* 3D Asset Overlay for Checkpoint 2 */}
          <AnimatePresence>
            {step2Locked && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: 'spring', bounce: 0.5, duration: 1 }}
                style={{ position: 'absolute', inset: 0, zIndex: 10 }}
              >
                <Canvas camera={{ position: [0, 1.5, 6], fov: 45 }}>
                  <ambientLight intensity={1.5} />
                  <directionalLight position={[5, 10, 5]} intensity={2} />
                  <Environment preset="city" />
                  <CoconutTree3D />
                </Canvas>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── CHECKPOINT 03 (LEFT ZIGZAG): YOUR TRIBE ──────────────────────── */}
        <div ref={stepTribeRef} style={{ position: 'relative', maxWidth: 520, margin: '0 auto 80px 0' }}>
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{
              background: 'rgba(3,38,21,0.92)',
              border: '2px solid var(--goa-yellow)',
              borderRadius: 24, padding: '32px 24px',
              boxShadow: '0 12px 40px rgba(0,0,0,0.4)',
              position: 'relative', zIndex: 3,
              filter: step3Locked ? 'blur(12px)' : 'none',
              opacity: step3Locked ? 0.4 : 1,
              pointerEvents: step3Locked ? 'none' : 'auto',
              transition: 'all 0.8s ease',
            }}
          >
            <div className="goa-retro-mono" style={{ fontSize: 10, color: 'var(--goa-yellow)', letterSpacing: '0.2em', marginBottom: 8 }}>
              CHECKPOINT 03 — YOUR TRIBE
            </div>
            <h2 className="goa-title-serif" style={{ fontSize: 32, marginBottom: 6 }}>
              Who are you building with?
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 24 }}>
              Solo adventurer or crew squad?
            </p>

            <div style={{ display: 'flex', gap: 14, marginBottom: 24 }}>
              <button
                className={`tribe-card ${tribeChoice === 'solo' ? 'selected' : ''}`}
                onClick={() => handleTribeSelect('solo')}
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
                <button
                  className="btn-pink"
                  onClick={() => handleTribeSelect('team', teamName)}
                  disabled={!teamName.trim()}
                  style={{ width: '100%', marginTop: 14 }}
                >
                  UNLOCK MY CLASS ↓
                </button>
              </div>
            )}
          </motion.div>

          {/* 3D Asset Overlay for Checkpoint 3 */}
          <AnimatePresence>
            {step3Locked && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: 'spring', bounce: 0.5, duration: 1 }}
                style={{ position: 'absolute', inset: 0, zIndex: 10 }}
              >
                <Canvas camera={{ position: [0, 0.5, 5], fov: 45 }}>
                  <ambientLight intensity={1.5} />
                  <directionalLight position={[5, 10, 5]} intensity={2} />
                  <Environment preset="city" />
                  <BeachChair3D />
                </Canvas>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── CHECKPOINT 04 (CENTER): BUILDER CLASS REVEAL ────────────────── */}
        <div ref={stepClassRef}>
          {isTribeDone && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              style={{
                maxWidth: 580, margin: '0 auto 90px', textAlign: 'center',
                background: 'radial-gradient(ellipse at 50% 50%, rgba(255,0,122,0.2) 0%, rgba(3,38,21,0.95) 70%)',
                border: '3px solid var(--goa-yellow)',
                borderRadius: 28, padding: '40px 28px',
                boxShadow: '0 16px 50px rgba(0,0,0,0.5), 0 0 30px rgba(255,230,0,0.3)',
                position: 'relative', zIndex: 3,
              }}
            >
              <div className="goa-retro-mono" style={{ fontSize: 11, color: 'var(--goa-yellow)', letterSpacing: '0.22em', marginBottom: 12 }}>
                🔮 BUILDER ALCHEMY REVEAL
              </div>

              <div style={{ fontSize: 72, marginBottom: 14 }}>
                {profile.builderClassEmoji ?? '⚡'}
              </div>

              <h1 className="goa-title-serif" style={{ fontSize: 'clamp(36px, 8vw, 56px)', marginBottom: 12 }}>
                {profile.builderClass ?? 'The Builder'}
              </h1>

              <p style={{ fontSize: 16, color: 'var(--text-muted)', marginBottom: 28 }}>
                {profile.builderClassDescription}
              </p>

              <button
                className="btn-journey"
                onClick={() => {
                  setTreasureOpen(true);
                  stepRevealRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                style={{ fontSize: 17, padding: '18px 44px' }}
              >
                VIEW MY CARD & RISING SUN ↓
              </button>
            </motion.div>
          )}
        </div>

        {/* ── CLIMAX DESTINATION: SEA VIEW OF RISING SUN & BUILDER CARD ──────── */}
        <div ref={stepRevealRef}>
          {isTribeDone && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              style={{
                maxWidth: 640, margin: '0 auto 60px', textAlign: 'center',
                background: 'radial-gradient(ellipse at 50% 40%, rgba(255,230,0,0.15) 0%, rgba(3,38,21,0.98) 75%)',
                border: '3px solid var(--goa-yellow)',
                borderRadius: 32, padding: '44px 24px',
                boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
                position: 'relative', zIndex: 3,
              }}
            >
              {/* FULL SEA VIEW OF THE RISING SUN ILLUSTRATION (Matching Inspiration Image) */}
              <div style={{ maxWidth: 580, margin: '0 auto 20px' }}>
                <svg viewBox="0 0 800 340" style={{ width: '100%', height: 'auto', display: 'block' }}>
                  <defs>
                    <linearGradient id="climaxSunGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#FFE600" />
                      <stop offset="100%" stopColor="#FF8000" />
                    </linearGradient>
                  </defs>
                  {/* Sunburst Rays */}
                  <g stroke="#FFE600" strokeWidth="3" opacity="0.7">
                    <line x1="400" y1="170" x2="400" y2="20" />
                    <line x1="400" y1="170" x2="270" y2="50" />
                    <line x1="400" y1="170" x2="530" y2="50" />
                    <line x1="400" y1="170" x2="160" y2="100" />
                    <line x1="400" y1="170" x2="640" y2="100" />
                  </g>
                  {/* Rising Sun */}
                  <circle cx="400" cy="170" r="80" fill="url(#climaxSunGrad)" />
                  {/* Ocean Waves */}
                  <path d="M0 200 Q200 190 400 200 T800 200 L800 340 L0 340 Z" fill="#04381d" opacity="0.8" />
                  <path d="M0 220 Q200 210 400 220 T800 220 L800 340 L0 340 Z" fill="#075932" opacity="0.9" />
                  <path d="M0 240 Q200 230 400 240 T800 240 L800 340 L0 340 Z" fill="#f4fbf7" />

                  {/* Beach Shack */}
                  <g transform="translate(520, 185)">
                    <rect x="0" y="25" width="90" height="55" fill="#075932" stroke="#ffffff" strokeWidth="2" />
                    <polygon points="-10,25 45,-5 100,25" fill="#FF007A" stroke="#FFE600" strokeWidth="3" />
                    <text x="45" y="14" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">GOA BEACH</text>
                  </g>
                </svg>
              </div>

              <div className="goa-hindi-badge" style={{ fontSize: 18, marginBottom: 12 }}>
                ✓ IDENTITY SEALED
              </div>

              <h1 className="goa-title-serif" style={{ fontSize: 'clamp(32px, 7vw, 48px)', marginBottom: 6 }}>
                Your Builder ID Card
              </h1>
              <p className="goa-retro-mono" style={{ color: 'var(--goa-yellow)', fontSize: 14, marginBottom: 28 }}>
                {profile.builderClassEmoji} {profile.builderClass} · {profile.primaryRole}
              </p>

              {/* 3D Treasure Chest and Card Reveal Preview */}
              <div style={{ marginBottom: 32, position: 'relative', height: 420 }}>
                {/* Treasure Chest */}
                <div style={{ position: 'absolute', inset: 0, zIndex: 1, transform: 'translateY(120px)' }}>
                  <Canvas camera={{ position: [0, 2, 7], fov: 45 }}>
                    <ambientLight intensity={2} />
                    <directionalLight position={[0, 10, 10]} intensity={2} />
                    <Environment preset="city" />
                    <TreasureChest3D isOpen={treasureOpen} />
                  </Canvas>
                </div>
                
                {/* 3D Card rising from Chest */}
                <motion.div
                  initial={{ opacity: 0, y: 150, scale: 0.2 }}
                  animate={treasureOpen ? { opacity: 1, y: 0, scale: 1 } : {}}
                  transition={{ delay: 0.5, duration: 1.5, type: 'spring', bounce: 0.3 }}
                  style={{ position: 'relative', zIndex: 2, height: '100%' }}
                >
                  <Card3DPreview profile={profile} />
                </motion.div>
              </div>

              {/* 📥 DOWNLOAD BOTH BUTTON (Primary) */}
              <button
                className="btn-journey"
                onClick={handleDownloadBoth}
                disabled={downloading}
                style={{ width: '100%', fontSize: 17, padding: '18px 24px', marginBottom: 12 }}
              >
                {downloading && downloadFace === 'both' ? (
                  <><div className="spinner" style={{ width: 18, height: 18, borderWidth: 2, borderTopColor: '#000' }} /> Rendering Both PNGs…</>
                ) : '📥 DOWNLOAD BOTH (FRONT & BACK)'}
              </button>

              {/* Individual Download buttons */}
              <div style={{ display: 'flex', gap: 10, width: '100%', marginBottom: 14 }}>
                <button className="btn-ghost" onClick={() => handleDownloadSingle('front')} disabled={downloading} style={{ flex: 1, fontSize: 13 }}>
                  Download Front
                </button>
                <button className="btn-ghost" onClick={() => handleDownloadSingle('back')} disabled={downloading} style={{ flex: 1, fontSize: 13 }}>
                  Download Back
                </button>
              </div>

              {/* 👥 REFER A FRIEND BUTTON */}
              <button
                className="btn-ghost"
                onClick={handleReferFriend}
                style={{
                  width: '100%', marginBottom: 12, fontSize: 15, fontWeight: 800,
                  borderColor: 'var(--goa-pink)', color: '#ffffff', background: 'rgba(255,0,122,0.18)',
                }}
              >
                {referStatus === 'copied' ? '✓ REFERRAL LINK COPIED!' : '👥 REFER A FRIEND TO THE HOUSE'}
              </button>

              {/* SHARE TO X */}
              <button className="btn-x" onClick={handleShareX} style={{ width: '100%', marginBottom: 24, fontSize: 14 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="white" style={{ marginRight: 6 }}>
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
                </svg>
                SHARE MY IDENTITY · #FrameInGoa
              </button>

              <div style={{ width: '100%', height: 2, background: 'linear-gradient(90deg, transparent, var(--goa-yellow), transparent)', margin: '24px 0' }} />

              {/* 🏠 ENTER THE HOUSE — Links directly to https://hhgoa.com/ */}
              <div style={{ textAlign: 'center' }}>
                <p className="goa-retro-mono" style={{ fontSize: 12, color: 'var(--goa-yellow)', marginBottom: 16 }}>
                  YOU MADE THE JOURNEY TO THE HOUSE.
                </p>
                <a
                  href={MAIN_SITE_URL}
                  target="_blank" rel="noopener noreferrer"
                  className="btn-pink"
                  style={{
                    display: 'inline-flex', width: '100%', justifyContent: 'center',
                    fontSize: 20, padding: '22px 40px', letterSpacing: '0.08em',
                    textDecoration: 'none', borderRadius: 18,
                  }}
                >
                  ENTER THE HOUSE →
                </a>
                <p style={{ marginTop: 10, fontSize: 12, color: 'var(--text-muted)' }}>
                  https://hhgoa.com/
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
