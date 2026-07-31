import { NextRequest, NextResponse } from 'next/server';
import { searchSlides } from '@/lib/ragEngine';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { query } = body;

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    const match = searchSlides(query);
    return NextResponse.json({ match, timestamp: new Date().toISOString() });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
