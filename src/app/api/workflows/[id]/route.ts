import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const workflow = await prisma.workflow.findFirst({
      where: {
        id,
        userId: user.userId as string,
      },
      include: {
        nodes: true,
        edges: true,
      },
    });

    if (!workflow) {
      return NextResponse.json(
        { error: 'Workflow not found' },
        { status: 404 }
      );
    }

    // Transform the data to match frontend expectations
    const transformedWorkflow = {
      id: workflow.id,
      name: workflow.name,
      description: workflow.description || '',
      isActive: workflow.isActive,
      createdAt: workflow.createdAt.toISOString(),
      lastRun: workflow.lastRun?.toISOString() || null,
      totalRuns: workflow.totalRuns,
      successRate: workflow.successRate,
      nodes: workflow.nodes.map(node => ({
        id: node.id,
        type: node.type,
        position: { x: node.positionX, y: node.positionY },
        data: JSON.parse(node.data),
      })),
      edges: workflow.edges.map(edge => ({
        id: edge.id,
        source: edge.sourceId,
        target: edge.targetId,
      })),
    };

    return NextResponse.json({ workflow: transformedWorkflow });
  } catch (error) {
    console.error('Error fetching workflow:', error);
    return NextResponse.json(
      { error: 'Failed to fetch workflow' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { name, description, nodes, edges } = body;

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

    // Update workflow
    const updatedWorkflow = await prisma.workflow.update({
      where: { id },
      data: {
        name: name || existingWorkflow.name,
        description: description || existingWorkflow.description,
      },
    });

    // Update nodes
    if (nodes) {
      // Delete existing nodes
      await prisma.node.deleteMany({
        where: { workflowId: id },
      });

      // Create new nodes
      for (const node of nodes) {
        await prisma.node.create({
          data: {
            id: node.id,
            type: node.type,
            positionX: node.position.x,
            positionY: node.position.y,
            data: JSON.stringify(node.data),
            workflowId: id,
          },
        });
      }
    }

    // Update edges
    if (edges) {
      // Delete existing edges
      await prisma.edge.deleteMany({
        where: { workflowId: id },
      });

      // Create new edges
      for (const edge of edges) {
        await prisma.edge.create({
          data: {
            id: edge.id,
            sourceId: edge.source,
            targetId: edge.target,
            workflowId: id,
          },
        });
      }
    }

    return NextResponse.json({
      message: 'Workflow updated successfully',
      workflow: updatedWorkflow,
    });
  } catch (error) {
    console.error('Error updating workflow:', error);
    return NextResponse.json(
      { error: 'Failed to update workflow' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

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

    // Delete workflow (nodes and edges will be deleted due to cascade)
    await prisma.workflow.delete({
      where: { id },
    });

    return NextResponse.json({
      message: 'Workflow deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting workflow:', error);
    return NextResponse.json(
      { error: 'Failed to delete workflow' },
      { status: 500 }
    );
  }
}
