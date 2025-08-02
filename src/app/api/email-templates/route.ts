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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    
    let filteredTemplates = templates
    
    if (category && category !== 'all') {
      filteredTemplates = templates.filter(t => t.category === category)
    }

    return NextResponse.json({ templates: filteredTemplates })
  } catch (error) {
    console.error('Error fetching email templates:', error)
    return NextResponse.json(
      { error: 'Failed to fetch email templates' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, subject, previewText, category, design, html, status = 'draft' } = body

    // Validate required fields
    if (!name || !subject) {
      return NextResponse.json(
        { error: 'Template name and subject are required' },
        { status: 400 }
      )
    }

    // Create new template
    const newTemplate = {
      id: Date.now().toString(),
      name,
      subject,
      previewText: previewText || '',
      category: category || 'marketing',
      design: design || {},
      html: html || '',
      status,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      usageCount: 0
    }

    templates.push(newTemplate)

    return NextResponse.json({ template: newTemplate }, { status: 201 })
  } catch (error) {
    console.error('Error creating email template:', error)
    return NextResponse.json(
      { error: 'Failed to create email template' },
      { status: 500 }
    )
  }
}