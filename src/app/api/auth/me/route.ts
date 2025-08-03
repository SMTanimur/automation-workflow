import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
  console.log('GET /api/auth/me called');

  try {
    const user = await getCurrentUser();
    console.log('getCurrentUser result:', user);

    if (!user) {
      console.log('No user found, returning 401');
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    // Fetch user data from database
    const userData = await prisma.user.findUnique({
      where: { id: user.userId as string },
    });

    console.log('Database user lookup result:', userData);

    if (!userData) {
      console.log('User not found in database, returning 404');
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Remove password from response
    const { password, ...userWithoutPassword } = userData;
    console.log('Returning user data:', userWithoutPassword);
    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.error('Error in /api/auth/me:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
