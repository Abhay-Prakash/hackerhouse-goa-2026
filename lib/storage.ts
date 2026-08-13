import { list, put } from '@vercel/blob';
import type { BuilderProfile } from './types';

// Fallback in-memory map for local development if BLOB_READ_WRITE_TOKEN is missing
const fallbackStore = new Map<string, BuilderProfile>();

const isBlobConfigured = () => !!process.env.BLOB_READ_WRITE_TOKEN;

export async function saveCard(data: BuilderProfile, frontBase64?: string, backBase64?: string): Promise<string> {
  const id = data.cardId ?? Math.random().toString(36).slice(2, 10);
  const profile = { ...data, cardId: id, createdAt: new Date().toISOString() };
  
  if (!isBlobConfigured()) {
    console.warn("BLOB_READ_WRITE_TOKEN is not set. Using ephemeral in-memory storage.");
    fallbackStore.set(id, profile);
    return id;
  }

  if (frontBase64) {
    const frontBuffer = Buffer.from(frontBase64.split(',')[1], 'base64');
    await put(`cards/${id}-front.png`, frontBuffer, { access: 'public', addRandomSuffix: false, contentType: 'image/png' });
  }
  
  if (backBase64) {
    const backBuffer = Buffer.from(backBase64.split(',')[1], 'base64');
    await put(`cards/${id}-back.png`, backBuffer, { access: 'public', addRandomSuffix: false, contentType: 'image/png' });
  }

  await put(`cards/${id}.json`, JSON.stringify(profile), { access: 'public', addRandomSuffix: false, contentType: 'application/json' });
  return id;
}

export async function getCard(id: string): Promise<BuilderProfile | undefined> {
  if (!isBlobConfigured()) {
    return fallbackStore.get(id);
  }

  try {
    const { blobs } = await list({ prefix: `cards/${id}.json`, limit: 1 });
    if (blobs.length > 0) {
      const res = await fetch(blobs[0].url);
      return await res.json();
    }
  } catch (error) {
    console.error("Storage getCard Error:", error);
  }
  return undefined;
}
