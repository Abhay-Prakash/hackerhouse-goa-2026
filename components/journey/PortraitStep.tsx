'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { processPhoto } from '@/lib/imageProcessor';

interface Props {
  initialName: string;
  onComplete: (photo: string, name: string) => void;
  onBack: () => void;
}

export default function PortraitStep({ initialName, onComplete, onBack }: Props) {
  const [name, setName] = useState(initialName);
  const [photo, setPhoto] = useState<string | null>(null);
  const [rawPreview, setRawPreview] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (file: File) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];
    const isHeic = file.name.toLowerCase().match(/\.(heic|heif)$/);
    if (!allowed.includes(file.type) && !isHeic) {
      setError('Please upload a JPG, PNG, WEBP or HEIC photo.');
      return;
    }
    setError('');
    setProcessing(true);
    const raw = URL.createObjectURL(file);
    setRawPreview(raw);
    try {
      const result = await processPhoto(file);
      setPhoto(result.dataUrl);
      setRawPreview(result.dataUrl);
    } catch {
      setError('Could not process this image. Try another.');
    } finally {
      setProcessing(false);
    }
  }, []);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <div
      className="journey-stage"
      style={{
        paddingTop: 80,
        background: 'radial-gradient(ellipse at 70% 30%, rgba(255,209,102,0.05) 0%, transparent 55%), var(--bg-void)',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        style={{ width: '100%', maxWidth: 460, textAlign: 'center', position: 'relative', zIndex: 1 }}
      >
        {/* Back */}
        <button onClick={onBack} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'var(--text-muted)', fontSize: 13,
          display: 'flex', alignItems: 'center', gap: 6,
          marginBottom: 28, padding: 0, letterSpacing: '0.04em',
        }}>
          ← BACK
        </button>

        {/* Eyebrow */}
        <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.2em', color: 'var(--accent-gold)', textTransform: 'uppercase', marginBottom: 12 }}>
          01 — THE PORTRAIT
        </div>

        <h2 style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 'clamp(26px, 6vw, 40px)', fontWeight: 800,
          letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: 8,
        }}>
          Put a face to the builder.
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: 15, lineHeight: 1.6, marginBottom: 32 }}>
          Choose the photo that represents you.
        </p>

        {/* Polaroid upload */}
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/heic,image/heif,.heic,.heif"
          style={{ display: 'none' }}
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          id="photo-file-input"
        />

        <div
          style={{ display: 'flex', justifyContent: 'center', marginBottom: 28, cursor: 'pointer' }}
          onClick={() => fileRef.current?.click()}
        >
          <div
            className={`polaroid-frame ${dragOver ? 'drag-over' : ''}`}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            style={{
              width: 200, height: 220,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexDirection: 'column',
            }}
          >
            {/* Photo area */}
            <div style={{
              width: 172, height: 172,
              background: photo ? 'transparent' : '#e8e0d0',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              overflow: 'hidden', position: 'relative',
            }}>
              {rawPreview ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={rawPreview} alt="portrait" style={{
                    width: '100%', height: '100%', objectFit: 'cover',
                    filter: processing ? 'brightness(0.5)' : 'none',
                    transition: 'filter 0.3s',
                  }} />
                  {processing && (
                    <div style={{
                      position: 'absolute', inset: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexDirection: 'column', gap: 8, color: '#fff', fontSize: 12,
                    }}>
                      <div className="spinner" />
                      Processing…
                    </div>
                  )}
                </>
              ) : (
                <div style={{ textAlign: 'center', color: '#9b9280' }}>
                  <div style={{ fontSize: 32, marginBottom: 6 }}>📷</div>
                  <div style={{ fontSize: 11, fontWeight: 600 }}>TAP TO UPLOAD</div>
                </div>
              )}
            </div>
            {/* Polaroid label */}
            <div style={{
              height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 10, fontWeight: 700, color: '#8a7f6e', letterSpacing: '0.15em',
              textTransform: 'uppercase',
            }}>
              {photo ? '✓ PORTRAIT CAPTURED' : 'YOUR PORTRAIT'}
            </div>
          </div>
        </div>

        {/* Formats */}
        <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 24, letterSpacing: '0.06em' }}>
          JPG · PNG · WEBP · HEIC — auto-cropped & centred
        </p>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ color: '#f87171', fontSize: 12, marginBottom: 16 }}
            >{error}</motion.div>
          )}
        </AnimatePresence>

        {/* Name confirm */}
        <div style={{ marginBottom: 24, textAlign: 'left' }}>
          <label style={{
            display: 'block', marginBottom: 8,
            fontSize: 10, fontWeight: 800, letterSpacing: '0.18em',
            color: 'var(--text-muted)', textTransform: 'uppercase',
          }}>
            Your Name (for the card)
          </label>
          <input
            id="portrait-name-input"
            className="input-field"
            type="text"
            placeholder="Your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* Sticky/Fixed Action Dock */}
        <div style={{
          position: 'fixed',
          bottom: 16,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'calc(100% - 32px)',
          maxWidth: 460,
          zIndex: 1000,
          padding: '10px 14px',
          borderRadius: 20,
          background: 'rgba(3,38,21,0.94)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '2px solid var(--goa-yellow)',
          boxShadow: '0 12px 40px rgba(0,0,0,0.6)',
        }}>
          <button
            id="portrait-continue-btn"
            className="btn-pink"
            onClick={() => photo && name.trim() && onComplete(photo, name.trim())}
            disabled={!photo || !name.trim() || processing}
            style={{ width: '100%', opacity: photo && name.trim() && !processing ? 1 : 0.45, fontSize: 16 }}
          >
            KEEP GOING ↓
          </button>
          {!photo && (
            <p style={{ marginTop: 6, fontSize: 11, color: 'var(--goa-yellow)', textAlign: 'center' }}>
              Upload your portrait to continue
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
