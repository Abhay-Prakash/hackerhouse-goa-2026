'use client';

import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import { toPng } from 'html-to-image';
import type { BuilderProfile } from '@/lib/types';
import BuilderCardFront from './BuilderCardFront';
import BuilderCardBack from './BuilderCardBack';

interface CardExporterProps {
  profile: BuilderProfile;
  shareUrl: string;
}

export interface CardExporterRef {
  exportFront: () => Promise<string>;
  exportBack: () => Promise<string>;
}

const CardExporter = forwardRef<CardExporterRef, CardExporterProps>(
  ({ profile, shareUrl }, ref) => {
    const frontRef = useRef<HTMLDivElement>(null);
    const backRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(ref, () => ({
      exportFront: async () => {
        if (!frontRef.current) throw new Error('Front ref missing');

        // Fix for html-to-image CSSRules SecurityError caused by browser extensions
        const disabledStyles: any[] = [];
        try {
          const styles = Array.from(document.styleSheets);
          styles.forEach((sheet) => {
            try {
              const _ = sheet.cssRules;
            } catch (e) {
              if (sheet.ownerNode) {
                (sheet.ownerNode as any).disabled = true;
                disabledStyles.push(sheet.ownerNode);
              }
            }
          });
        } catch(e) {}

        try {
          return await toPng(frontRef.current, {
            pixelRatio: 1, // Reduced to prevent Vercel 4.5MB Payload limit crash
            cacheBust: true,
            width: 874,
            height: 1240,
          });
        } finally {
          disabledStyles.forEach((node: any) => { if (node) node.disabled = false; });
        }
      },
      exportBack: async () => {
        if (!backRef.current) throw new Error('Back ref missing');
        
        const disabledStyles: any[] = [];
        try {
          const styles = Array.from(document.styleSheets);
          styles.forEach((sheet) => {
            try {
              const _ = sheet.cssRules;
            } catch (e) {
              if (sheet.ownerNode) {
                (sheet.ownerNode as any).disabled = true;
                disabledStyles.push(sheet.ownerNode);
              }
            }
          });
        } catch(e) {}

        try {
          return await toPng(backRef.current, {
            pixelRatio: 1, // Reduced to prevent Vercel 4.5MB Payload limit crash
            cacheBust: true,
            width: 874,
            height: 1240,
          });
        } finally {
          disabledStyles.forEach((node: any) => { if (node) node.disabled = false; });
        }
      },
    }));

    // The styling is absolute to perfectly match the 874x1240 container natively
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
        <div ref={frontRef} style={{ width: 874, height: 1240 }}>
          <BuilderCardFront profile={profile} />
        </div>
        <div ref={backRef} style={{ width: 874, height: 1240 }}>
          <BuilderCardBack profile={profile} shareUrl={shareUrl} />
        </div>
      </div>
    );
  }
);

CardExporter.displayName = 'CardExporter';
export default CardExporter;
