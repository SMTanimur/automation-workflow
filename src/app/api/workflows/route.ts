import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const workflows = await prisma.workflow.findMany({
      where: { userId: user.userId as string },
      include: {
        nodes: true,
        edges: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    // Transform the data to match the frontend expectations
    const transformedWorkflows = workflows.map(workflow => ({
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
    }));

    return NextResponse.json({ workflows: transformedWorkflows });

    return NextResponse.json({ workflows });
  } catch (error) {
    console.error('Error fetching workflows:', error);
    return NextResponse.json(
      { error: 'Failed to fetch workflows' },
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
    const { name, description, nodes, edges } = body;

    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { error: 'Workflow name is required' },
        { status: 400 }
      );
    }

    // Create new workflow in database
    const newWorkflow = await prisma.workflow.create({
      data: {
        name,
        description: description || '',
        isActive: false,
        userId: user.userId as string,
        nodes: {
          create:
            nodes?.map((node: any, index: number) => ({
              type: node.type,
              positionX: node.position?.x || 100 + index * 200,
              positionY: node.position?.y || 100,
              data: JSON.stringify(node.data || {}),
            })) || [],
        },
        edges: {
          create:
            edges?.map((edge: any) => ({
              sourceId: edge.source,
              targetId: edge.target,
            })) || [],
        },
      },
      include: {
        nodes: true,
        edges: true,
      },
    });

    // Transform the response
    const transformedWorkflow = {
      id: newWorkflow.id,
      name: newWorkflow.name,
      description: newWorkflow.description || '',
      isActive: newWorkflow.isActive,
      createdAt: newWorkflow.createdAt.toISOString(),
      lastRun: newWorkflow.lastRun?.toISOString() || null,
      totalRuns: newWorkflow.totalRuns,
      successRate: newWorkflow.successRate,
      nodes: newWorkflow.nodes.map(node => ({
        id: node.id,
        type: node.type,
        position: { x: node.positionX, y: node.positionY },
        data: JSON.parse(node.data),
      })),
      edges: newWorkflow.edges.map(edge => ({
        id: edge.id,
        source: edge.sourceId,
        target: edge.targetId,
      })),
    };

    return NextResponse.json(
      { workflow: transformedWorkflow },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating workflow:', error);
    return NextResponse.json(
      { error: 'Failed to create workflow' },
      { status: 500 }
    );
  }
}
