import { NextResponse } from 'next/server';
import { manualDisconnect } from '@/lib/system-state';

export async function POST() {
  manualDisconnect();
  return NextResponse.json({ success: true });
}
