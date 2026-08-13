import { NextRequest, NextResponse } from 'next/server';
import { getCard } from '@/lib/storage';
import { list } from '@vercel/blob';

// Returns card metadata for OG image generation.
// In production: dynamically fetches the generated front.png from Vercel Blob and serves it.
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const { blobs } = await list({ prefix: `cards/${id}-front.png`, limit: 1 });
      if (blobs.length > 0) {
        // Redirect to the static blob URL which contains the fully rendered PNG!
        return NextResponse.redirect(blobs[0].url);
      }
    } catch (error) {
      console.error('OG Image Blob Fetch Error:', error);
    }
  }

  // Fallback to JSON if blob doesn't exist or isn't configured
  const card = await getCard(id);
  if (!card) return NextResponse.json({ error: 'Card not found' }, { status: 404 });

  return NextResponse.json({
    name:            card.name,
    primaryRole:     card.primaryRole,
    builderClass:    card.builderClass,
    builderClassEmoji: card.builderClassEmoji,
    registrationId:  card.registrationId ?? card.builderId,
    stack:           card.stack,
  });
}
