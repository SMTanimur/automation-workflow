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
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
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
        description:
          description !== undefined
            ? description
            : existingWorkflow.description,
      },
      include: {
        nodes: true,
        edges: true,
      },
    });

    // Update nodes if provided
    if (nodes) {
      // Delete existing nodes
      await prisma.node.deleteMany({
        where: { workflowId: id },
      });

      // Create new nodes
      await prisma.node.createMany({
        data: nodes.map((node: any, index: number) => ({
          type: node.type,
          positionX: node.position?.x || 100 + index * 200,
          positionY: node.position?.y || 100,
          data: JSON.stringify(node.data || {}),
          workflowId: id,
        })),
      });
    }

    // Update edges if provided
    if (edges) {
      // Delete existing edges
      await prisma.edge.deleteMany({
        where: { workflowId: id },
      });

      // Create new edges
      await prisma.edge.createMany({
        data: edges.map((edge: any) => ({
          sourceId: edge.source,
          targetId: edge.target,
          workflowId: id,
        })),
      });
    }

    // Fetch updated workflow with nodes and edges
    const finalWorkflow = await prisma.workflow.findFirst({
      where: { id },
      include: {
        nodes: true,
        edges: true,
      },
    });

    // Transform the response
    const transformedWorkflow = {
      id: finalWorkflow!.id,
      name: finalWorkflow!.name,
      description: finalWorkflow!.description || '',
      isActive: finalWorkflow!.isActive,
      createdAt: finalWorkflow!.createdAt.toISOString(),
      lastRun: finalWorkflow!.lastRun?.toISOString() || null,
      totalRuns: finalWorkflow!.totalRuns,
      successRate: finalWorkflow!.successRate,
      nodes: finalWorkflow!.nodes.map(node => ({
        id: node.id,
        type: node.type,
        position: { x: node.positionX, y: node.positionY },
        data: JSON.parse(node.data),
      })),
      edges: finalWorkflow!.edges.map(edge => ({
        id: edge.id,
        source: edge.sourceId,
        target: edge.targetId,
      })),
    };

    return NextResponse.json({
      message: 'Workflow updated successfully',
      workflow: transformedWorkflow,
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

    // Delete workflow (cascade will delete nodes and edges)
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
