import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Mock authentication - in real app, this would check against database
    // For demo purposes, accept any email/password combination
    const mockUser = {
      id: '1',
      email: email,
      name: email.split('@')[0], // Use part before @ as name
      createdAt: new Date().toISOString()
    }

    // Mock JWT token - in real app, use proper JWT library
    const mockToken = `mock-jwt-token-${Date.now()}`

    return NextResponse.json({
      message: 'Login successful',
      user: mockUser,
      token: mockToken
    })

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}