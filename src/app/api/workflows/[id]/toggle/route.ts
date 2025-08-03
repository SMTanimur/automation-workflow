import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    // Check if workflow exists and belongs to user
    const existingWorkflow = await prisma.workflow.findFirst({
      where: {
        id,
        userId: user.userId as string,
      },
    });

    if (!existingWorkflow) {
      return NextResponse.json(
        { error: 'Workflow not found' },
        { status: 404 }
      );
    }

    // Toggle the workflow status
    const updatedWorkflow = await prisma.workflow.update({
      where: { id },
      data: {
        isActive: !existingWorkflow.isActive,
      },
    });

    return NextResponse.json({
      message: `Workflow ${
        updatedWorkflow.isActive ? 'activated' : 'deactivated'
      } successfully`,
      workflow: {
        id: updatedWorkflow.id,
        name: updatedWorkflow.name,
        isActive: updatedWorkflow.isActive,
      },
    });
  } catch (error) {
    console.error('Error toggling workflow status:', error);
    return NextResponse.json(
      { error: 'Failed to toggle workflow status' },
      { status: 500 }
    );
  }
}
