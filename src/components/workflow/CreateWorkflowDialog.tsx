'use client';

import React, { useState, useCallback, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Plus,
  Play,
  Mail,
  Settings,
  Zap,
  X,
  Save,
  RotateCcw,
} from 'lucide-react';
import {
  ReactFlow,
  addEdge,
  useNodesState,
  useEdgesState,
  Connection,
  Edge,
  Node,
  Controls,
  Background,
  MiniMap,
  Panel,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { nodeTypes, edgeTypes } from './CustomNodes';
import { useElkLayout } from '@/hooks/useElkLayout';
import { useCreateWorkflow } from '@/hooks/useWorkflows';
import { toast } from 'sonner';

interface CreateWorkflowDialogProps {
  children: React.ReactNode;
}

const initialNodes: Node[] = [
  {
    id: 'trigger-1',
    type: 'trigger',
    position: { x: 250, y: 50 },
    data: { label: 'User Signup', type: 'trigger' },
  },
  {
    id: 'end-1',
    type: 'end',
    position: { x: 250, y: 300 },
    data: { label: 'End', type: 'end' },
  },
];

const initialEdges: Edge[] = [
  {
    id: 'e1-2',
    source: 'trigger-1',
    target: 'end-1',
    type: 'custom',
  },
];

const availableNodes = [
  { type: 'trigger', label: 'Trigger', icon: Play, color: 'bg-blue-500' },
  { type: 'email', label: 'Email', icon: Mail, color: 'bg-green-500' },
  {
    type: 'condition',
    label: 'Condition',
    icon: Settings,
    color: 'bg-yellow-500',
  },
  { type: 'end', label: 'End', icon: Zap, color: 'bg-red-500' },
];

export function CreateWorkflowDialog({ children }: CreateWorkflowDialogProps) {
  const [open, setOpen] = useState(false);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [workflowName, setWorkflowName] = useState('');
  const [workflowDescription, setWorkflowDescription] = useState('');
  const [selectedNodeType, setSelectedNodeType] = useState<string | null>(null);
  const [nodeName, setNodeName] = useState('');
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { applyLayout } = useElkLayout();
  const createWorkflowMutation = useCreateWorkflow();

  const onConnect = useCallback(
    (params: Connection) => setEdges(eds => addEdge(params, eds)),
    [setEdges]
  );

  const addNode = useCallback(() => {
    if (!selectedNodeType || !nodeName.trim()) {
      toast.error('Please select a node type and enter a name');
      return;
    }

    const newNode: Node = {
      id: `${selectedNodeType}-${Date.now()}`,
      type: selectedNodeType,
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: { label: nodeName, type: selectedNodeType },
    };

    setNodes(nds => [...nds, newNode]);
    setSelectedNodeType(null);
    setNodeName('');
    toast.success('Node added successfully');
  }, [selectedNodeType, nodeName, setNodes]);

  const addNodeOnEdge = useCallback((edgeId: string, nodeType: string) => {
    const edge = edges.find(e => e.id === edgeId);
    if (!edge) return;

    const sourceNode = nodes.find(n => n.id === edge.source);
    const targetNode = nodes.find(n => n.id === edge.target);
    
    if (!sourceNode || !targetNode) return;

    // Calculate position between source and target
    const centerX = (sourceNode.position.x + targetNode.position.x) / 2;
    const centerY = (sourceNode.position.y + targetNode.position.y) / 2;

    const newNode: Node = {
      id: `${nodeType}-${Date.now()}`,
      type: nodeType,
      position: { x: centerX, y: centerY },
      data: { label: `${nodeType.charAt(0).toUpperCase() + nodeType.slice(1)} Node`, type: nodeType },
    };

    // Add new node
    setNodes(nds => [...nds, newNode]);

    // Remove old edge
    setEdges(eds => eds.filter(e => e.id !== edgeId));

    // Add new edges: source -> newNode -> target
    const newEdges: Edge[] = [
      {
        id: `${edge.source}-${newNode.id}`,
        source: edge.source,
        target: newNode.id,
        type: 'custom',
      },
      {
        id: `${newNode.id}-${edge.target}`,
        source: newNode.id,
        target: edge.target,
        type: 'custom',
      },
    ];

    setEdges(eds => [...eds, ...newEdges]);
    toast.success(`${nodeType} node added successfully`);
  }, [nodes, edges, setNodes, setEdges]);

  const removeNode = useCallback(
    (nodeId: string) => {
      setNodes(nds => nds.filter(node => node.id !== nodeId));
      setEdges(eds =>
        eds.filter(edge => edge.source !== nodeId && edge.target !== nodeId)
      );
    },
    [setNodes, setEdges]
  );

  const autoLayout = useCallback(async () => {
    const { nodes: layoutedNodes, edges: layoutedEdges } = await applyLayout(
      nodes,
      edges
    );
    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
    toast.success('Layout applied successfully');
  }, [nodes, edges, applyLayout, setNodes, setEdges]);

  const handleCreateWorkflow = async () => {
    if (!workflowName.trim()) {
      toast.error('Please enter a workflow name');
      return;
    }

    if (nodes.length < 2) {
      toast.error('Please add at least 2 nodes to create a workflow');
      return;
    }

    try {
      const workflowData = {
        name: workflowName,
        description: workflowDescription,
        nodes: nodes.map(node => ({
          type: node.type,
          position: node.position,
          data: node.data,
        })),
        edges: edges.map(edge => ({
          source: edge.source,
          target: edge.target,
          type: edge.type,
        })),
      };

      await createWorkflowMutation.mutateAsync(workflowData);
      toast.success('Workflow created successfully');
      setOpen(false);

      // Reset form
      setWorkflowName('');
      setWorkflowDescription('');
      setNodes(initialNodes);
      setEdges(initialEdges);
    } catch (error) {
      toast.error('Failed to create workflow');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className='max-w-6xl h-[80vh]'>
        <DialogHeader>
          <DialogTitle>Create New Workflow</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue='form' className='h-full'>
          <TabsList className='grid w-full grid-cols-2'>
            <TabsTrigger value='form'>Workflow Details</TabsTrigger>
            <TabsTrigger value='builder'>Visual Builder</TabsTrigger>
          </TabsList>

          <TabsContent value='form' className='space-y-4'>
            <div className='space-y-4'>
              <div>
                <Label htmlFor='name'>Workflow Name</Label>
                <Input
                  id='name'
                  value={workflowName}
                  onChange={e => setWorkflowName(e.target.value)}
                  placeholder='Enter workflow name'
                />
              </div>
              <div>
                <Label htmlFor='description'>Description</Label>
                <Textarea
                  id='description'
                  value={workflowDescription}
                  onChange={e => setWorkflowDescription(e.target.value)}
                  placeholder='Enter workflow description'
                  rows={3}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value='builder' className='h-full'>
            <div className='flex h-full gap-4'>
              {/* Node Palette */}
              <div className='w-64 space-y-4'>
                <Card>
                  <CardHeader>
                    <CardTitle className='text-sm'>Add Node</CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-3'>
                    <div className='space-y-2'>
                      <Label>Node Type</Label>
                      <div className='grid grid-cols-2 gap-2'>
                        {availableNodes.map(node => (
                          <Button
                            key={node.type}
                            variant={
                              selectedNodeType === node.type
                                ? 'default'
                                : 'outline'
                            }
                            size='sm'
                            onClick={() => setSelectedNodeType(node.type)}
                            className='justify-start'
                          >
                            <node.icon className='w-4 h-4 mr-2' />
                            {node.label}
                          </Button>
                        ))}
                      </div>
                    </div>
                    <div className='space-y-2'>
                      <Label>Node Name</Label>
                      <Input
                        value={nodeName}
                        onChange={e => setNodeName(e.target.value)}
                        placeholder='Enter node name'
                      />
                    </div>
                    <Button onClick={addNode} className='w-full'>
                      <Plus className='w-4 h-4 mr-2' />
                      Add Node
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className='text-sm'>Actions</CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-2'>
                    <Button
                      onClick={autoLayout}
                      variant='outline'
                      className='w-full'
                    >
                      <RotateCcw className='w-4 h-4 mr-2' />
                      Auto Layout
                    </Button>
                    <Button onClick={handleCreateWorkflow} className='w-full'>
                      <Save className='w-4 h-4 mr-2' />
                      Create Workflow
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className='text-sm'>Workflow Info</CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-2'>
                    <div className='flex justify-between'>
                      <span className='text-sm text-gray-600'>Nodes:</span>
                      <Badge variant='secondary'>{nodes.length}</Badge>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-sm text-gray-600'>Edges:</span>
                      <Badge variant='secondary'>{edges.length}</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* React Flow Canvas */}
              <div className='flex-1 h-full' ref={reactFlowWrapper}>
                <ReactFlow
                  nodes={nodes}
                  edges={edges}
                  onNodesChange={onNodesChange}
                  onEdgesChange={onEdgesChange}
                  onConnect={onConnect}
                  nodeTypes={nodeTypes}
                  edgeTypes={edgeTypes}
                  fitView
                  className='bg-gray-50'

                >
                  <Controls />
                  <Background />
                  <MiniMap />
                  <Panel position='top-right'>
                    <div className='bg-white p-2 rounded shadow'>
                      <div className='text-xs text-gray-600'>
                        {workflowName || 'Untitled Workflow'}
                      </div>
                    </div>
                  </Panel>
                </ReactFlow>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
