'use client';

import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import { toPng } from 'html-to-image';
import { QRCodeSVG } from 'qrcode.react';
import type { BuilderProfile } from '@/lib/types';

interface CardExporterProps {
  profile: BuilderProfile;
  shareUrl: string;
}

export interface CardExporterRef {
  exportFront: () => Promise<string>;
  exportBack: () => Promise<string>;
}

// Fixed dimensions for exporting high-res PNG (matching the 1080x1080 template)
const CARD_SIZE = 1080;

const CardExporter = forwardRef<CardExporterRef, CardExporterProps>(
  ({ profile, shareUrl }, ref) => {
    const frontRef = useRef<HTMLDivElement>(null);
    const backRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(ref, () => ({
      exportFront: async () => {
        if (!frontRef.current) throw new Error('Front ref missing');
        return await toPng(frontRef.current, {
          pixelRatio: 2, // High resolution (3 is sometimes too large for Vercel 4.5MB limit, 2 is great for 1080p template)
          cacheBust: true,
          width: CARD_SIZE,
          height: CARD_SIZE,
        });
      },
      exportBack: async () => {
        if (!backRef.current) throw new Error('Back ref missing');
        return await toPng(backRef.current, {
          pixelRatio: 2,
          cacheBust: true,
          width: CARD_SIZE,
          height: CARD_SIZE,
        });
      },
    }));

    // The styling is absolute to perfectly match the 1080x1080 container
    return (
      <div
        style={{
          position: 'absolute',
          top: '-9999px',
          left: '-9999px',
          pointerEvents: 'none',
          opacity: 0,
        }}
      >
        {/* ─── FRONT CARD RENDER ─── */}
        <div
          ref={frontRef}
          style={{
            width: CARD_SIZE,
            height: CARD_SIZE,
            position: 'relative',
            backgroundImage: 'url(/frontsideID.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            overflow: 'hidden',
          }}
        >
          {/* 1. Avatar Square */}
          {profile.photo && (
            <img
              src={profile.photo}
              crossOrigin="anonymous"
              alt="Builder Portrait"
              style={{
                position: 'absolute',
                top: '28.5%',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '46%',
                height: '46%',
                objectFit: 'cover',
                objectPosition: 'center top',
                borderRadius: '3rem', // equivalent to rounded-2xl/3xl scaling
              }}
            />
          )}

          {/* 2. Text Stack: Builder's Name & Team Name */}
          <div
            style={{
              position: 'absolute',
              top: '65%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '80%',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px', // spacing between name and team
            }}
          >
            <div
              style={{
                color: '#EBB414',
                fontWeight: 900,
                fontSize: '48px', // Scaled for 1080px canvas
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              {profile.name}
            </div>
            <div
              style={{
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: '32px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              {profile.teamName || 'Solo Builder'}
            </div>
          </div>

          {/* 3. Pink Badge / Role Tag */}
          <div
            style={{
              position: 'absolute',
              bottom: '4.5%',
              right: '4.5%',
              width: '26%',
              height: '26%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                color: '#FFFFFF',
                fontWeight: 900,
                fontSize: '28px',
                textTransform: 'uppercase',
                lineHeight: 1.2,
                padding: '20px', // Prevent text from hitting edges of circular badge
                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              }}
            >
              {profile.primaryRole}
            </div>
          </div>
        </div>

        {/* ─── BACK CARD RENDER ─── */}
        <div
          ref={backRef}
          style={{
            width: CARD_SIZE,
            height: CARD_SIZE,
            position: 'relative',
            backgroundImage: 'url(/backsideID.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            overflow: 'hidden',
          }}
        >
          {/* Neon QR Code (Dead Center, 48% height) */}
          <div
            style={{
              position: 'absolute',
              top: '48%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '48%',
              height: '48%',
              background: '#ffffff', // Ensures QR code is readable
              borderRadius: '2.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px', // Inner white padding around QR code
            }}
          >
            <QRCodeSVG
              value={shareUrl}
              size={1080 * 0.48 - 48} // Width minus padding
              level="H"
              includeMargin={false}
              fgColor="#000000"
              bgColor="#ffffff"
            />
          </div>
        </div>
      </div>
    );
  }
);

CardExporter.displayName = 'CardExporter';
export default CardExporter;
