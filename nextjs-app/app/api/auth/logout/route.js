import { NextResponse } from 'next/server';

export async function POST(request) {
  // In a stateless JWT system, logout is handled client-side
  // by removing the token from localStorage/cookies
  return NextResponse.json({
    success: true,
    message: 'Logout successful',
  });
}
