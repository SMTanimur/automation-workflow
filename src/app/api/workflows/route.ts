import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Mock workflows data
    const workflows = [
      {
        id: '1',
        name: 'Welcome Series',
        description: 'Send welcome email to new users',
        isActive: true,
        createdAt: new Date().toISOString(),
        nodes: [
          {
            id: '1',
            type: 'trigger',
            position: { x: 100, y: 100 },
            data: { label: 'Start', event: 'user_signup' }
          },
          {
            id: '2',
            type: 'email',
            position: { x: 300, y: 100 },
            data: { label: 'Welcome Email', templateId: '1' }
          },
          {
            id: '3',
            type: 'end',
            position: { x: 500, y: 100 },
            data: { label: 'End' }
          }
        ],
        edges: [
          { id: 'e1-2', source: '1', target: '2' },
          { id: 'e2-3', source: '2', target: '3' }
        ]
      }
    ]

    return NextResponse.json({ workflows })
  } catch (error) {
    console.error('Error fetching workflows:', error)
    return NextResponse.json(
      { error: 'Failed to fetch workflows' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, nodes, edges } = body

    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { error: 'Workflow name is required' },
        { status: 400 }
      )
    }

    // Create new workflow
    const newWorkflow = {
      id: Date.now().toString(),
      name,
      description: description || '',
      isActive: false,
      createdAt: new Date().toISOString(),
      nodes: nodes || [],
      edges: edges || []
    }

    return NextResponse.json({ workflow: newWorkflow }, { status: 201 })
  } catch (error) {
    console.error('Error creating workflow:', error)
    return NextResponse.json(
      { error: 'Failed to create workflow' },
      { status: 500 }
    )
  }
}