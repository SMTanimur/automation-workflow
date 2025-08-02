import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { hashPassword, generateToken, setAuthCookie } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, companyName } = await request.json();

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user in database
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        ...(companyName && { companyName }),
      },
    });

    // Create JWT token
    const token = generateToken({
      userId: newUser.id,
      email: newUser.email,
      name: newUser.name,
    });

    // Set cookie
    await setAuthCookie(token);

    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = newUser;

    return NextResponse.json({
      message: 'Registration successful',
      user: userWithoutPassword,
      token: token,
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
