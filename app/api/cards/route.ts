import { NextRequest, NextResponse } from 'next/server';
import { saveCard, getCard } from '@/lib/storage';
import type { BuilderProfile } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const { profile, frontBase64, backBase64 } = await req.json();
    if (!profile) return NextResponse.json({ error: 'Missing profile' }, { status: 400 });
    
    const id = await saveCard(profile, frontBase64, backBase64);
    return NextResponse.json({ cardId: id });
  } catch (error) {
    console.error('Save card error:', error);
    return NextResponse.json({ error: 'Failed to save card.' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  
  const card = await getCard(id);
  if (!card) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  
  return NextResponse.json(card);
}
