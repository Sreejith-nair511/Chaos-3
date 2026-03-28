import { NextResponse } from 'next/server';
import { injectAttack } from '@/lib/system-state';

export async function POST(request: Request) {
  try {
    const { attackType } = await request.json();
    injectAttack(attackType);
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}
