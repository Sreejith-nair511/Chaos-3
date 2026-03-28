import { NextResponse } from 'next/server';
import { manualConnect } from '@/lib/system-state';

export async function POST(request: Request) {
  try {
    const { name } = await request.json();
    manualConnect(name);
  } catch (e) {
    manualConnect();
  }
  return NextResponse.json({ success: true });
}
