import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    // Mock workflow data - in real app, this would fetch from database
    const workflow = {
      id,
      name: 'Welcome Series',
      description: 'Send welcome email to new users',
      isActive: true,
      createdAt: new Date().toISOString(),
      lastRun: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      totalRuns: 1250,
      successRate: 98,
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

    return NextResponse.json({ workflow })
  } catch (error) {
    console.error('Error fetching workflow:', error)
    return NextResponse.json(
      { error: 'Failed to fetch workflow' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await request.json()
    const { name, description, nodes, edges } = body

    // Update workflow - in real app, this would update database
    const updatedWorkflow = {
      id,
      name: name || 'Updated Workflow',
      description: description || '',
      nodes: nodes || [],
      edges: edges || [],
      updatedAt: new Date().toISOString()
    }

    return NextResponse.json({ 
      message: 'Workflow updated successfully',
      workflow: updatedWorkflow 
    })
  } catch (error) {
    console.error('Error updating workflow:', error)
    return NextResponse.json(
      { error: 'Failed to update workflow' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    // Delete workflow - in real app, this would delete from database
    return NextResponse.json({ 
      message: 'Workflow deleted successfully' 
    })
  } catch (error) {
    console.error('Error deleting workflow:', error)
    return NextResponse.json(
      { error: 'Failed to delete workflow' },
      { status: 500 }
    )
  }
}