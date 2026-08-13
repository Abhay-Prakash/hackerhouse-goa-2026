'use client';

import React from 'react';
import type { BuilderProfile } from '@/lib/types';

interface Props { profile: BuilderProfile; }

export default function BuilderCardFront({ profile }: Props) {
 return (
 <div
 style={{
 width: 874,
 height: 1240,
 position: 'relative',
 fontFamily: 'sans-serif',
 overflow: 'hidden',
 }}
 >
 {/* 0. Deepest Background Layer */}
 <div style={{
 position: 'absolute',
 inset: 0,
 backgroundColor: 'rgb(18, 70, 48)',
 zIndex: 0
 }} />

 {/* 1. Dynamic User Photo (Layered BEHIND the template to naturally dodge the baked-in hat brim) */}
 <div style={{
 position: 'absolute',
 top: 378,
 left: 272,
 width: 360,
 height: 360,
 borderRadius: 12,
 overflow: 'hidden',
 zIndex: 1,
 }}>
 {profile.photo ? (
 <img
 src={profile.photo}
 alt="Portrait"
 style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
 />
 ) : (
 <div style={{ width: '100%', height: '100%', backgroundColor: '#cccccc' }} />
 )}
 </div>

 {/* 2. Base Template Layer (Contains the baked-in hat, borders, and a transparent photo hole) */}
 <div style={{
 position: 'absolute',
 inset: 0,
 backgroundImage: "url('/hhgoa_front_base.webp')",
 backgroundSize: '100% 100%',
 pointerEvents: 'none',
 zIndex: 2
 }} />

 {/* 3. Foreground Text Layer */}
 <div style={{ position: 'absolute', inset: 0, zIndex: 3, pointerEvents: 'none' }}>
 {/* 2. Builder Name */}
 <div style={{
 position: 'absolute',
 top: 800,
 left: 0,
 right: 0,
 textAlign: 'center',
 color: '#EBB414',
 fontSize: 76,
 fontWeight: 800,
 fontFamily: "'Space Mono', monospace",
 letterSpacing: '0.05em',
 textShadow: '0 4px 12px rgba(0,0,0,0.6)',
 }}>
 {profile.name || 'Builder Name'}
 </div>

 {/* 3. Tribe / Team Name */}
 <div style={{
 position: 'absolute',
 top: 900,
 left: 0,
 right: 0,
 textAlign: 'center',
 color: '#ffffff',
 fontSize: 52,
 fontWeight: 600,
 fontFamily: "'Space Mono', monospace",
 letterSpacing: '0.05em',
 textShadow: '0 4px 12px rgba(0,0,0,0.6)',
 }}>
 {profile.tribe === 'team' && profile.teamName
 ? profile.teamName
 : 'Solo Builder'}
 </div>
 </div>

 {/* 4. Pink Badge / Role Tag (Front Card) */}
 {/* Absolute positioning to precisely overlay the text onto the BAKED-IN pink stamp in hhgoa_front_base.png */}
 <div style={{
 position: 'absolute',
 bottom: 85, // Moved down to center perfectly
 right: 45, // Moved right to center perfectly
 width: 140, // fixed width for text centering over stamp
 display: 'flex', alignItems: 'center', justifyContent: 'center',
 transform: 'rotate(-12deg)',
 zIndex: 4,
 }}>
 <span style={{
 color: '#FFE600', // Yellow like the GOA badge
 fontSize: profile.builderClass ? '24px' : '32px',
 fontFamily: "'Samarkan', 'Space Mono', system-ui, sans-serif",
 fontWeight: '900',
 textAlign: 'center',
 lineHeight: '1.1',
 textShadow: '0 2px 6px rgba(255, 0, 122, 0.8), 0 2px 4px rgba(0,0,0,0.5)',
 wordWrap: 'break-word',
 maxWidth: '100%',
 }}>
 {profile.builderClass || profile.primaryRole || 'Builder'}
 </span>
 </div>
 </div>
 );
}
