import { NextRequest, NextResponse } from 'next/server'

// Mock database storage - in production, this would be a real database
let templates: any[] = [
  {
    id: '1',
    name: 'Welcome Email',
    subject: 'Welcome to our platform!',
    previewText: 'Here\'s what you need to know to get started...',
    category: 'welcome',
    design: {
      counters: {},
      body: {
        rows: [
          {
            columns: [
              {
                contents: [
                  {
                    type: 'text',
                    values: {
                      text: '<h2>Welcome to our platform!</h2><p>We\'re excited to have you on board.</p>',
                      textAlign: 'center',
                      fontSize: 16,
                      fontFamily: 'Arial',
                      lineHeight: 1.5
                    }
                  }
                ]
              }
            ]
          }
        ]
      }
    },
    html: '<!DOCTYPE html><html><head><style>body{font-family:Arial,sans-serif;margin:0;padding:20px;}</style></head><body><h2>Welcome to our platform!</h2><p>We\'re excited to have you on board.</p></body></html>',
    status: 'published',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    usageCount: 150
  },
  {
    id: '2',
    name: 'Newsletter Template',
    subject: 'Monthly Newsletter - January 2024',
    previewText: 'Check out our latest updates and features',
    category: 'newsletter',
    design: {},
    html: '<!DOCTYPE html><html><head><style>body{font-family:Arial,sans-serif;margin:0;padding:20px;}</style></head><body><h1>Monthly Newsletter</h1><p>Check out our latest updates and features</p></body></html>',
    status: 'draft',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    usageCount: 89
  }
]

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const template = templates.find(t => t.id === id)

    if (!template) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ template })
  } catch (error) {
    console.error('Error fetching template:', error)
    return NextResponse.json(
      { error: 'Failed to fetch template' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await request.json()
    const { name, subject, previewText, category, design, html, status } = body

    const templateIndex = templates.findIndex(t => t.id === id)
    
    if (templateIndex === -1) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      )
    }

    // Update template
    const updatedTemplate = {
      ...templates[templateIndex],
      name: name || templates[templateIndex].name,
      subject: subject || templates[templateIndex].subject,
      previewText: previewText !== undefined ? previewText : templates[templateIndex].previewText,
      category: category || templates[templateIndex].category,
      design: design !== undefined ? design : templates[templateIndex].design,
      html: html !== undefined ? html : templates[templateIndex].html,
      status: status || templates[templateIndex].status,
      updatedAt: new Date().toISOString()
    }

    templates[templateIndex] = updatedTemplate

    return NextResponse.json({ 
      message: 'Template updated successfully',
      template: updatedTemplate 
    })
  } catch (error) {
    console.error('Error updating template:', error)
    return NextResponse.json(
      { error: 'Failed to update template' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const templateIndex = templates.findIndex(t => t.id === id)
    
    if (templateIndex === -1) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      )
    }

    templates.splice(templateIndex, 1)

    return NextResponse.json({ 
      message: 'Template deleted successfully' 
    })
  } catch (error) {
    console.error('Error deleting template:', error)
    return NextResponse.json(
      { error: 'Failed to delete template' },
      { status: 500 }
    )
  }
}

// Add endpoint for duplicating templates
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const originalTemplate = templates.find(t => t.id === id)
    
    if (!originalTemplate) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      )
    }

    // Create duplicate
    const duplicatedTemplate = {
      ...originalTemplate,
      id: Date.now().toString(),
      name: `${originalTemplate.name} (Copy)`,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      usageCount: 0
    }

    templates.push(duplicatedTemplate)

    return NextResponse.json({ 
      message: 'Template duplicated successfully',
      template: duplicatedTemplate 
    })
  } catch (error) {
    console.error('Error duplicating template:', error)
    return NextResponse.json(
      { error: 'Failed to duplicate template' },
      { status: 500 }
    )
  }
}