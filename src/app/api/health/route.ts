import { NextResponse } from 'next/server';

export async function GET() {
  console.log('Health check route called');
  return NextResponse.json({ 
    status: 'ok', 
    message: 'API is working',
    timestamp: new Date().toISOString()
  });
}