import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, companyName } = await request.json()

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      )
    }

    // Mock user creation - in real app, this would save to database
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      companyName: companyName || null,
      createdAt: new Date().toISOString()
    }

    // Mock JWT token - in real app, use proper JWT library
    const mockToken = `mock-jwt-token-${Date.now()}`

    return NextResponse.json({
      message: 'Registration successful',
      user: newUser,
      token: mockToken
    })

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}