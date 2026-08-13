'use client';

import React, { useEffect, useState } from 'react';
import type { BuilderProfile } from '@/lib/types';
import { QRCodeSVG } from 'qrcode.react';
import TribalBorder from './TribalBorder';

interface Props { profile: BuilderProfile; shareUrl?: string; }

export default function BuilderCardBack({ profile, shareUrl }: Props) {
  const [url, setUrl] = useState(shareUrl || 'https://hackerhousegoa.com');

  useEffect(() => {
    if (!shareUrl && typeof window !== 'undefined') {
      setUrl(`${window.location.origin}/card/${profile.cardId ?? ''}`);
    }
  }, [shareUrl, profile.cardId]);

  const qr_size = 460;
  const qr_x = (874 - qr_size) / 2; // 207
  const qr_y = 350;
  
  const text_x = 160;
  const start_y = 920;
  const line_spacing = 42;

  return (
    <div
      style={{
        width: 874,
        height: 1240,
        backgroundColor: 'rgb(18, 70, 48)', // Dark Goa Forest Green
        position: 'relative',
        overflow: 'hidden',
        fontFamily: "'Space Mono', monospace",
      }}
    >
      {/* 1. Tribal Pattern Border (Top & Left) */}
      <TribalBorder orientation="horizontal" size={32} length={874} />
      <TribalBorder orientation="vertical" size={32} length={1240} />

      {/* 2. Glowing Designer QR Container */}
      {/* Cyan Outer Neon Glow Frame */}
      <div style={{
        position: 'absolute',
        top: qr_y - 12,
        left: qr_x - 12,
        width: qr_size + 24,
        height: qr_size + 24,
        borderRadius: 36,
        border: '5px solid rgb(80, 230, 240)',
        boxShadow: '0 0 20px rgba(80, 230, 240, 0.6), inset 0 0 20px rgba(80, 230, 240, 0.6)',
        zIndex: 1,
      }} />

      {/* White Rounded QR Base Box */}
      <div style={{
        position: 'absolute',
        top: qr_y,
        left: qr_x,
        width: qr_size,
        height: qr_size,
        backgroundColor: 'rgb(248, 246, 240)',
        borderRadius: 32,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2,
      }}>
        {/* Real Scannable QR Code */}
        <QRCodeSVG
          value={url}
          size={380}
          level="H"
          includeMargin={false}
          fgColor="rgb(18, 70, 48)"
          bgColor="transparent"
        />
      </div>

      {/* 3. Bottom Guide Info Typography */}
      <div style={{
        position: 'absolute',
        top: 860, // Moved up closer to the QR code (810 is bottom of QR)
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        zIndex: 3,
      }}>
        <div style={{
          color: 'rgb(240, 220, 80)', // Warm Gold/Yellow
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center', // Centers the text itself
          gap: 15,
        }}>
          <div style={{ fontSize: 26, fontWeight: 'bold', marginBottom: 6, letterSpacing: '0.05em' }}>
            GOA  |  CAMP GUIDE INFO:
          </div>
          <div style={{ fontSize: 22, opacity: 0.9 }}>* WiFi Network & Password</div>
          <div style={{ fontSize: 22, opacity: 0.9 }}>* Main Camp Area Map</div>
          <div style={{ fontSize: 22, opacity: 0.9 }}>* Point of Interest Directory</div>
        </div>
      </div>
    </div>
  );
}
