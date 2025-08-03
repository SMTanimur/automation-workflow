import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    // Get the original workflow with nodes and edges
    const originalWorkflow = await prisma.workflow.findFirst({
      where: { 
        id,
        userId: user.userId as string 
      },
      include: {
        nodes: true,
        edges: true,
      },
    });
    
    if (!originalWorkflow) {
      return NextResponse.json(
        { error: 'Workflow not found' },
        { status: 404 }
      );
    }

    // Create duplicate workflow
    const duplicatedWorkflow = await prisma.workflow.create({
      data: {
        name: `${originalWorkflow.name} (Copy)`,
        description: originalWorkflow.description,
        isActive: false, // Always start as inactive
        userId: user.userId as string,
      },
    });

    // Duplicate nodes
    const nodeMap = new Map<string, string>(); // oldId -> newId
    for (const node of originalWorkflow.nodes) {
      const newNode = await prisma.node.create({
        data: {
          type: node.type,
          positionX: node.positionX,
          positionY: node.positionY,
          data: node.data,
          workflowId: duplicatedWorkflow.id,
        },
      });
      nodeMap.set(node.id, newNode.id);
    }

    // Duplicate edges with new node IDs
    for (const edge of originalWorkflow.edges) {
      const newSourceId = nodeMap.get(edge.sourceId);
      const newTargetId = nodeMap.get(edge.targetId);
      
      if (newSourceId && newTargetId) {
        await prisma.edge.create({
          data: {
            sourceId: newSourceId,
            targetId: newTargetId,
            workflowId: duplicatedWorkflow.id,
          },
        });
      }
    }

    // Fetch the complete duplicated workflow
    const finalWorkflow = await prisma.workflow.findFirst({
      where: { id: duplicatedWorkflow.id },
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
      message: 'Workflow duplicated successfully',
      workflow: transformedWorkflow 
    });
  } catch (error) {
    console.error('Error duplicating workflow:', error);
    return NextResponse.json(
      { error: 'Failed to duplicate workflow' },
      { status: 500 }
    );
  }
} 