// ─── Canvas Card Renderer — Goan Emerald & Sunshine Edition ─────────────────
// Renders a 1080×1080 PNG of the Builder ID Card front or back.
// Runs entirely client-side for near-instant generation.

import { drawQROnCanvas } from './qr';
import type { BuilderProfile } from './types';

const W = 1080;
const H = 1080;

const C = {
  void:    '#04381d',
  deep:    '#06512b',
  card:    '#075932',
  teal:    '#ffe600', // Sunshine Yellow
  gold:    '#ffe600', // Sunshine Yellow
  pink:    '#ff007a', // Hot Pink
  green:   '#a3e635', // Lime Green accent
  white:   '#ffffff',
  muted:   '#a2dfbb',
};

function loadImg(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
    img.crossOrigin = 'anonymous';
  });
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function drawScene(ctx: CanvasRenderingContext2D) {
  // Base Emerald Green
  ctx.fillStyle = C.void;
  ctx.fillRect(0, 0, W, H);

  // Grid
  ctx.strokeStyle = 'rgba(255,230,0,0.04)';
  ctx.lineWidth = 1;
  for (let x = 0; x < W; x += 60) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
  for (let y = 0; y < H; y += 60) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

  // Radial glows
  const g1 = ctx.createRadialGradient(220, 180, 0, 220, 180, 580);
  g1.addColorStop(0, 'rgba(255,230,0,0.15)'); g1.addColorStop(1, 'transparent');
  ctx.fillStyle = g1; ctx.fillRect(0, 0, W, H);

  const g2 = ctx.createRadialGradient(860, 860, 0, 860, 860, 500);
  g2.addColorStop(0, 'rgba(255,0,122,0.18)'); g2.addColorStop(1, 'transparent');
  ctx.fillStyle = g2; ctx.fillRect(0, 0, W, H);
}

function drawCardFrame(ctx: CanvasRenderingContext2D) {
  const p = 56;
  // Card fill
  const grad = ctx.createLinearGradient(p, p, W - p, H - p);
  grad.addColorStop(0, '#075932'); grad.addColorStop(1, '#043b1f');
  roundRect(ctx, p, p, W - p * 2, H - p * 2, 40);
  ctx.fillStyle = grad; ctx.fill();

  // Border
  const bg = ctx.createLinearGradient(p, p, W - p, H - p);
  bg.addColorStop(0, '#ffe600'); bg.addColorStop(0.5, '#ff007a'); bg.addColorStop(1, '#ffe600');
  roundRect(ctx, p, p, W - p * 2, H - p * 2, 40);
  ctx.strokeStyle = bg; ctx.lineWidth = 4; ctx.stroke();
}

function drawDiagonalStripe(ctx: CanvasRenderingContext2D) {
  ctx.save(); ctx.globalAlpha = 0.08; ctx.fillStyle = C.teal;
  ctx.beginPath();
  ctx.moveTo(0, H * 0.54); ctx.lineTo(W, H * 0.30);
  ctx.lineTo(W, H * 0.39); ctx.lineTo(0, H * 0.63);
  ctx.closePath(); ctx.fill(); ctx.restore();
}

// ─── FRONT ───────────────────────────────────────────────────────────────────
export async function renderCardFront(profile: BuilderProfile): Promise<string> {
  const canvas = document.createElement('canvas');
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d')!;

  drawScene(ctx);
  drawCardFrame(ctx);
  drawDiagonalStripe(ctx);

  const pad = 84;

  // ── Top bar ────────────────────────────────────────────────────────────────
  ctx.textAlign = 'left';
  ctx.font = '900 24px "Playfair Display", Georgia, serif';
  ctx.fillStyle = C.teal;
  ctx.fillText('HACKER HOUSE', pad, 134);

  ctx.font = 'bold 22px "Space Mono", monospace';
  ctx.fillStyle = C.pink;
  ctx.fillText('GOA 2026', pad + 248, 134);

  ctx.textAlign = 'right';
  ctx.font = 'bold 19px "Space Mono", monospace';
  ctx.fillStyle = C.gold;
  ctx.fillText('#FrameInGoa', W - pad, 134);

  // Separator
  ctx.beginPath();
  const sep = ctx.createLinearGradient(pad, 152, W - pad, 152);
  sep.addColorStop(0, C.teal); sep.addColorStop(0.5, C.pink); sep.addColorStop(1, C.gold);
  ctx.strokeStyle = sep; ctx.lineWidth = 2;
  ctx.moveTo(pad, 152); ctx.lineTo(W - pad, 152); ctx.stroke();

  // ── Photo ──────────────────────────────────────────────────────────────────
  const photoSize = 350;
  const photoX = (W - photoSize) / 2;
  const photoY = 192;

  // Glow ring
  ctx.save();
  ctx.shadowColor = C.pink; ctx.shadowBlur = 48;
  ctx.beginPath(); ctx.arc(photoX + photoSize / 2, photoY + photoSize / 2, photoSize / 2 + 4, 0, Math.PI * 2);
  ctx.strokeStyle = C.pink; ctx.lineWidth = 4; ctx.stroke();
  ctx.restore();

  // Clip & draw photo
  ctx.save();
  ctx.beginPath(); ctx.arc(photoX + photoSize / 2, photoY + photoSize / 2, photoSize / 2, 0, Math.PI * 2);
  ctx.clip();
  if (profile.photo) {
    try { const img = await loadImg(profile.photo); ctx.drawImage(img, photoX, photoY, photoSize, photoSize); }
    catch { ctx.fillStyle = C.card; ctx.fillRect(photoX, photoY, photoSize, photoSize); }
  } else {
    ctx.fillStyle = C.card; ctx.fillRect(photoX, photoY, photoSize, photoSize);
  }
  ctx.restore();

  // Gradient ring
  ctx.beginPath(); ctx.arc(photoX + photoSize / 2, photoY + photoSize / 2, photoSize / 2, 0, Math.PI * 2);
  const ring = ctx.createLinearGradient(photoX, photoY, photoX + photoSize, photoY + photoSize);
  ring.addColorStop(0, C.teal); ring.addColorStop(0.5, C.pink); ring.addColorStop(1, C.gold);
  ctx.strokeStyle = ring; ctx.lineWidth = 5; ctx.stroke();

  // ── Builder Class badge ────────────────────────────────────────────────────
  const badgeY = photoY + photoSize + 52;
  const badgeText = `${profile.builderClassEmoji ?? '⚡'}  ${profile.builderClass ?? 'The Builder'}`;
  ctx.font = 'bold 26px "Inter", sans-serif';
  const badgeW = ctx.measureText(badgeText).width + 56;
  const badgeX = (W - badgeW) / 2;

  roundRect(ctx, badgeX, badgeY - 26, badgeW, 52, 26);
  ctx.fillStyle = C.pink; ctx.fill();
  roundRect(ctx, badgeX, badgeY - 26, badgeW, 52, 26);
  ctx.strokeStyle = C.gold; ctx.lineWidth = 2; ctx.stroke();
  ctx.fillStyle = '#ffffff'; ctx.textAlign = 'center';
  ctx.fillText(badgeText, W / 2, badgeY + 8);

  // ── Name ───────────────────────────────────────────────────────────────────
  ctx.font = '900 76px "Playfair Display", serif';
  ctx.fillStyle = C.gold; ctx.textAlign = 'center';
  ctx.shadowColor = 'rgba(0,0,0,0.4)'; ctx.shadowBlur = 18;
  const nameText = profile.name.toUpperCase();
  const nameW = ctx.measureText(nameText).width;
  if (nameW > W - 200) {
    const scale = (W - 200) / nameW;
    ctx.font = `900 ${Math.floor(76 * scale)}px "Playfair Display", serif`;
  }
  ctx.fillText(nameText, W / 2, badgeY + 102);
  ctx.shadowBlur = 0;

  // ── Role + Stack ───────────────────────────────────────────────────────────
  ctx.font = 'bold 30px "Space Mono", monospace'; ctx.fillStyle = '#ffffff';
  ctx.fillText(profile.primaryRole ?? '', W / 2, badgeY + 154);

  if (profile.stack && profile.stack.length > 0) {
    ctx.font = '22px "Inter", sans-serif'; ctx.fillStyle = C.muted;
    ctx.fillText(profile.stack.slice(0, 4).join(' · '), W / 2, badgeY + 198);
  }

  // Team
  if (profile.tribe === 'team' && profile.teamName) {
    ctx.font = '20px "Inter", sans-serif'; ctx.fillStyle = C.gold;
    ctx.fillText(`🛖 ${profile.teamName}`, W / 2, badgeY + 236);
  }

  // ── Bottom bar ─────────────────────────────────────────────────────────────
  const botY = H - 88;
  ctx.beginPath(); ctx.strokeStyle = 'rgba(255,230,0,0.2)'; ctx.lineWidth = 1;
  ctx.moveTo(pad, botY); ctx.lineTo(W - pad, botY); ctx.stroke();

  ctx.font = 'bold 18px "Space Mono", monospace'; ctx.fillStyle = C.muted; ctx.textAlign = 'left';
  ctx.fillText(profile.builderId, pad, botY + 34);
  ctx.textAlign = 'right';
  ctx.fillText('hackerhousegoa.com', W - pad, botY + 34);

  // Corner dots
  [[pad + 18, pad + 76], [W - pad - 18, pad + 76], [pad + 18, H - pad - 14], [W - pad - 18, H - pad - 14]].forEach(([cx, cy]) => {
    ctx.beginPath(); ctx.arc(cx, cy, 5, 0, Math.PI * 2); ctx.fillStyle = C.gold; ctx.fill();
  });

  return canvas.toDataURL('image/png');
}

// ─── BACK ─────────────────────────────────────────────────────────────────────
export async function renderCardBack(profile: BuilderProfile, shareUrl: string): Promise<string> {
  const canvas = document.createElement('canvas');
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d')!;

  drawScene(ctx);
  drawCardFrame(ctx);
  drawDiagonalStripe(ctx);

  const pad = 84;
  ctx.textAlign = 'center';

  // Top
  ctx.font = '900 28px "Playfair Display", serif'; ctx.fillStyle = C.gold;
  ctx.fillText('HACKER HOUSE GOA 2026', W / 2, 138);

  ctx.beginPath();
  const lg = ctx.createLinearGradient(pad, 156, W - pad, 156);
  lg.addColorStop(0, C.teal); lg.addColorStop(0.5, C.pink); lg.addColorStop(1, C.gold);
  ctx.strokeStyle = lg; ctx.lineWidth = 2;
  ctx.moveTo(pad, 156); ctx.lineTo(W - pad, 156); ctx.stroke();

  // VERIFIED watermark
  ctx.save(); ctx.font = '900 56px "Playfair Display", serif';
  ctx.fillStyle = C.gold; ctx.globalAlpha = 0.08;
  ctx.translate(W / 2, H / 2 - 20); ctx.rotate(-0.14);
  ctx.fillText('VERIFIED BUILDER', 0, 0); ctx.restore();

  // ── QR Code ────────────────────────────────────────────────────────────────
  const qrSize = 270;
  const qrX = (W - qrSize) / 2;
  const qrY = 208;

  roundRect(ctx, qrX - 18, qrY - 18, qrSize + 36, qrSize + 36, 22);
  ctx.fillStyle = '#ffffff'; ctx.fill();

  await drawQROnCanvas(ctx, shareUrl, qrX, qrY, qrSize);

  ctx.font = '20px "Space Mono", monospace'; ctx.fillStyle = C.muted;
  ctx.fillText('Scan to verify identity', W / 2, qrY + qrSize + 38);

  // ── Info rows ──────────────────────────────────────────────────────────────
  const infoY = qrY + qrSize + 92;
  const rowH = 62;

  const rows = [
    { label: 'BUILDER ID',  value: profile.registrationId ?? profile.builderId },
    { label: 'CLASS',       value: `${profile.builderClassEmoji ?? ''} ${profile.builderClass ?? '—'}` },
    { label: 'ROLE',        value: profile.primaryRole ?? '—' },
    { label: 'STACK',       value: profile.stack?.slice(0, 3).join(', ') ?? '—' },
    ...(profile.tribe === 'team' && profile.teamName ? [{ label: 'CREW', value: profile.teamName }] : []),
    { label: 'STATUS',      value: '✓  VERIFIED BUILDER' },
  ];

  rows.forEach((row, i) => {
    const y = infoY + i * rowH;
    ctx.beginPath(); ctx.strokeStyle = 'rgba(255,230,0,0.12)'; ctx.lineWidth = 1;
    ctx.moveTo(pad, y - 14); ctx.lineTo(W - pad, y - 14); ctx.stroke();

    ctx.font = '15px "Space Mono", monospace'; ctx.fillStyle = C.muted; ctx.textAlign = 'left';
    ctx.fillText(row.label, pad, y);

    ctx.font = row.label === 'STATUS' ? 'bold 22px "Inter", sans-serif' : '22px "Inter", sans-serif';
    ctx.fillStyle = row.label === 'STATUS' ? C.green : C.white;
    ctx.textAlign = 'right'; ctx.fillText(row.value, W - pad, y);
  });

  // Bottom
  const botY = H - 88;
  ctx.beginPath(); ctx.strokeStyle = 'rgba(255,230,0,0.2)'; ctx.lineWidth = 1;
  ctx.moveTo(pad, botY); ctx.lineTo(W - pad, botY); ctx.stroke();

  ctx.font = 'bold 18px "Space Mono", monospace'; ctx.fillStyle = C.muted; ctx.textAlign = 'left';
  ctx.fillText('hackerhousegoa.com', pad, botY + 34);

  ctx.font = 'bold 18px "Space Mono", monospace'; ctx.fillStyle = C.gold; ctx.textAlign = 'right';
  ctx.fillText('#FrameInGoa', W - pad, botY + 34);

  return canvas.toDataURL('image/png');
}
