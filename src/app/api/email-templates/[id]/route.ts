import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    const template = await prisma.emailTemplate.findFirst({
      where: {
        id,
        userId: user.userId as string,
      },
    });

    if (!template) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      );
    }

    // Transform the data to match frontend expectations
    const transformedTemplate = {
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
    };

    return NextResponse.json({ template: transformedTemplate });
  } catch (error) {
    console.error('Error fetching template:', error);
    return NextResponse.json(
      { error: 'Failed to fetch template' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const body = await request.json();
    const { name, subject, previewText, category, design, html, status } = body;

    // Check if template exists and belongs to user
    const existingTemplate = await prisma.emailTemplate.findFirst({
      where: {
        id,
        userId: user.userId as string,
      },
    });

    if (!existingTemplate) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      );
    }

    // Update template
    const updatedTemplate = await prisma.emailTemplate.update({
      where: { id },
      data: {
        name: name || existingTemplate.name,
        subject: subject || existingTemplate.subject,
        previewText:
          previewText !== undefined
            ? previewText
            : existingTemplate.previewText,
        category: category || existingTemplate.category,
        design:
          design !== undefined
            ? JSON.stringify(design)
            : existingTemplate.design,
        html: html !== undefined ? html : existingTemplate.html,
        status: status || existingTemplate.status,
      },
    });

    // Transform the response
    const transformedTemplate = {
      id: updatedTemplate.id,
      name: updatedTemplate.name,
      subject: updatedTemplate.subject,
      previewText: updatedTemplate.previewText || '',
      category: updatedTemplate.category,
      design: updatedTemplate.design ? JSON.parse(updatedTemplate.design) : {},
      html: updatedTemplate.html || '',
      status: updatedTemplate.status,
      createdAt: updatedTemplate.createdAt.toISOString(),
      updatedAt: updatedTemplate.updatedAt.toISOString(),
      usageCount: updatedTemplate.usageCount,
    };

    return NextResponse.json({
      message: 'Template updated successfully',
      template: transformedTemplate,
    });
  } catch (error) {
    console.error('Error updating template:', error);
    return NextResponse.json(
      { error: 'Failed to update template' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    // Check if template exists and belongs to user
    const existingTemplate = await prisma.emailTemplate.findFirst({
      where: {
        id,
        userId: user.userId as string,
      },
    });

    if (!existingTemplate) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      );
    }

    // Delete template
    await prisma.emailTemplate.delete({
      where: { id },
    });

    return NextResponse.json({
      message: 'Template deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting template:', error);
    return NextResponse.json(
      { error: 'Failed to delete template' },
      { status: 500 }
    );
  }
}

// Add endpoint for duplicating templates
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    const originalTemplate = await prisma.emailTemplate.findFirst({
      where: {
        id,
        userId: user.userId as string,
      },
    });

    if (!originalTemplate) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      );
    }

    // Create duplicate
    const duplicatedTemplate = await prisma.emailTemplate.create({
      data: {
        name: `${originalTemplate.name} (Copy)`,
        subject: originalTemplate.subject,
        previewText: originalTemplate.previewText,
        category: originalTemplate.category,
        design: originalTemplate.design,
        html: originalTemplate.html,
        status: 'draft',
        userId: user.userId as string,
      },
    });

    // Transform the response
    const transformedTemplate = {
      id: duplicatedTemplate.id,
      name: duplicatedTemplate.name,
      subject: duplicatedTemplate.subject,
      previewText: duplicatedTemplate.previewText || '',
      category: duplicatedTemplate.category,
      design: duplicatedTemplate.design
        ? JSON.parse(duplicatedTemplate.design)
        : {},
      html: duplicatedTemplate.html || '',
      status: duplicatedTemplate.status,
      createdAt: duplicatedTemplate.createdAt.toISOString(),
      updatedAt: duplicatedTemplate.updatedAt.toISOString(),
      usageCount: duplicatedTemplate.usageCount,
    };

    return NextResponse.json({
      message: 'Template duplicated successfully',
      template: transformedTemplate,
    });
  } catch (error) {
    console.error('Error duplicating template:', error);
    return NextResponse.json(
      { error: 'Failed to duplicate template' },
      { status: 500 }
    );
  }
}
