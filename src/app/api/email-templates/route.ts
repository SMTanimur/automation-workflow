import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    const whereClause: any = { userId: user.userId as string };

    if (category && category !== 'all') {
      whereClause.category = category;
    }

    const templates = await prisma.emailTemplate.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
    });

    // Transform the data to match frontend expectations
    const transformedTemplates = templates.map(template => ({
      id: template.id,
      name: template.name,
      subject: template.subject,
      previewText: template.previewText || '',
      category: template.category,
      design: template.design ? JSON.parse(template.design) : {},
      html: template.html || '',
      status: template.status,
      createdAt: template.createdAt.toISOString(),
      updatedAt: template.updatedAt.toISOString(),
      usageCount: template.usageCount,
    }));

    return NextResponse.json({ templates: transformedTemplates });
  } catch (error) {
    console.error('Error fetching email templates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch email templates' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      subject,
      previewText,
      category,
      design,
      html,
      status = 'draft',
    } = body;

    // Validate required fields
    if (!name || !subject) {
      return NextResponse.json(
        { error: 'Template name and subject are required' },
        { status: 400 }
      );
    }

    // Create new template in database
    const newTemplate = await prisma.emailTemplate.create({
      data: {
        name,
        subject,
        previewText: previewText || '',
        category: category || 'general',
        design: design ? JSON.stringify(design) : null,
        html: html || '',
        status,
        userId: user.userId as string,
      },
    });

    // Transform the response
    const transformedTemplate = {
      id: newTemplate.id,
      name: newTemplate.name,
      subject: newTemplate.subject,
      previewText: newTemplate.previewText || '',
      category: newTemplate.category,
      design: newTemplate.design ? JSON.parse(newTemplate.design) : {},
      html: newTemplate.html || '',
      status: newTemplate.status,
      createdAt: newTemplate.createdAt.toISOString(),
      updatedAt: newTemplate.updatedAt.toISOString(),
      usageCount: newTemplate.usageCount,
    };

    return NextResponse.json(
      { template: transformedTemplate },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating email template:', error);
    return NextResponse.json(
      { error: 'Failed to create email template' },
      { status: 500 }
    );
  }
}
