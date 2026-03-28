import { NextResponse } from 'next/server';
import { state, startServices } from '@/lib/system-state';

export async function GET() {
  // Ensure background services are running
  startServices();
  
  return NextResponse.json(state);
}
