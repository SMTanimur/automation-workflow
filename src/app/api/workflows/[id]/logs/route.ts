import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    // Mock execution logs - in real app, this would fetch from database
    const logs = [
      {
        id: '1',
        workflowId: id,
        status: 'success' as const,
        startTime: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        endTime: new Date(Date.now() - 3590000).toISOString(),
        duration: '1m 0s',
        error: null
      },
      {
        id: '2',
        workflowId: id,
        status: 'success' as const,
        startTime: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
        endTime: new Date(Date.now() - 7190000).toISOString(),
        duration: '1m 0s',
        error: null
      },
      {
        id: '3',
        workflowId: id,
        status: 'failed' as const,
        startTime: new Date(Date.now() - 10800000).toISOString(), // 3 hours ago
        endTime: new Date(Date.now() - 10740000).toISOString(),
        duration: '1m 0s',
        error: 'Email service unavailable'
      }
    ]

    return NextResponse.json({ logs })
  } catch (error) {
    console.error('Error fetching execution logs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch execution logs' },
      { status: 500 }
    )
  }
}