import { NextRequest, NextResponse } from 'next/server';
import { verifyParticipant } from '@/lib/verification';

export async function POST(req: NextRequest) {
  try {
    const { identifier } = await req.json();
    const result = await verifyParticipant(identifier);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ success: false, error: 'Verification failed.' }, { status: 500 });
  }
}
