'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Play,
  Settings,
  Mail,
  ArrowLeft,
  Save,
  BarChart3,
  Activity,
  Calendar,
  Users,
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
import Link from 'next/link';
import { nodeTypes, edgeTypes } from '@/components/workflow/CustomNodes';
import { useElkLayout } from '@/hooks/useElkLayout';
import { useWorkflow, useUpdateWorkflow } from '@/hooks/useWorkflows';
import { toast } from 'sonner';

interface ExecutionLog {
  id: string;
  workflowId: string;
  status: 'success' | 'failed' | 'running';
  startTime: string;
  endTime?: string;
  duration?: string;
  error?: string;
}

export default function WorkflowDetailPage() {
  const params = useParams();
  const workflowId = params.id as string;

  const [workflowName, setWorkflowName] = useState('');
  const [workflowDescription, setWorkflowDescription] = useState('');
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [activeTab, setActiveTab] = useState('builder');
  const [executionLogs, setExecutionLogs] = useState<ExecutionLog[]>([]);

  // React Flow state
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Hooks
  const { data: workflowData, isLoading } = useWorkflow(workflowId);
  const updateWorkflowMutation = useUpdateWorkflow();
  const { applyLayout } = useElkLayout();

  // Initialize workflow data
  useEffect(() => {
    if (workflowData?.workflow) {
      const workflow = workflowData.workflow;
      setWorkflowName(workflow.name);
      setWorkflowDescription(workflow.description || '');

      // Transform nodes for React Flow
      const transformedNodes = workflow.nodes.map((node: any) => ({
        ...node,
        position: node.position || { x: 0, y: 0 },
        data: {
          ...node.data,
          label: node.data?.label || node.name || 'Node',
        },
      }));

      // Transform edges for React Flow
      const transformedEdges = workflow.edges.map((edge: any) => ({
        ...edge,
        type: 'custom',
      }));

      setNodes(transformedNodes as any);
      setEdges(transformedEdges as any);
    }
  }, [workflowData, setNodes, setEdges]);

  // Fetch execution logs
  useEffect(() => {
    fetchExecutionLogs();
  }, [workflowId]);

  const fetchExecutionLogs = async () => {
    try {
      const response = await fetch(`/api/workflows/${workflowId}/logs`);
      if (response.ok) {
        const data = await response.json();
        setExecutionLogs(data.logs || []);
      }
    } catch (error) {
      console.error('Error fetching execution logs:', error);
    }
  };

  const onConnect = useCallback(
    (params: Connection) =>
      setEdges(eds => addEdge({ ...params, type: 'custom' }, eds) as any),
    [setEdges]
  );

  const autoLayout = useCallback(async () => {
    const { nodes: layoutedNodes, edges: layoutedEdges } = await applyLayout(
      nodes,
      edges
    );
    setNodes(layoutedNodes as any);
    setEdges(layoutedEdges as any);
    toast.success('Layout applied successfully');
  }, [nodes, edges, applyLayout, setNodes, setEdges]);

  const saveWorkflow = async () => {
    try {
      const workflowData = {
        name: workflowName,
        description: workflowDescription,
        nodes: nodes.map((node: any) => ({
          type: node.type,
          position: node.position,
          data: node.data,
        })),
        edges: edges.map((edge: any) => ({
          source: edge.source,
          target: edge.target,
          type: edge.type,
        })),
      };

      await updateWorkflowMutation.mutateAsync({
        id: workflowId,
        data: workflowData,
      });
      toast.success('Workflow saved successfully');
    } catch (error) {
      toast.error('Failed to save workflow');
    }
  };

  const executeWorkflow = async () => {
    try {
      const response = await fetch(`/api/workflows/${workflowId}/execute`, {
        method: 'POST',
      });

      if (response.ok) {
        fetchExecutionLogs();
        toast.success('Workflow executed successfully');
      }
    } catch (error) {
      toast.error('Failed to execute workflow');
    }
  };

  if (isLoading) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
      </div>
    );
  }

  if (!workflowData?.workflow) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold text-gray-900 mb-2'>
            Workflow not found
          </h1>
          <Link href='/workflows'>
            <Button>Back to Workflows</Button>
          </Link>
        </div>
      </div>
    );
  }

  const workflow = workflowData.workflow;

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <div className='bg-white border-b border-gray-200 px-6 py-4'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-4'>
            <Link href='/workflows'>
              <Button variant='outline' size='sm'>
                <ArrowLeft className='w-4 h-4 mr-2' />
                Back
              </Button>
            </Link>
            <div>
              <h1 className='text-2xl font-bold text-gray-900'>
                {workflow.name}
              </h1>
              <p className='text-gray-600'>{workflow.description}</p>
            </div>
            <Badge variant={workflow.isActive ? 'default' : 'secondary'}>
              {workflow.isActive ? 'Active' : 'Inactive'}
            </Badge>
          </div>
          <div className='flex gap-2'>
            <Button variant='outline' onClick={saveWorkflow}>
              <Save className='w-4 h-4 mr-2' />
              Save
            </Button>
            <Button onClick={executeWorkflow}>
              <Play className='w-4 h-4 mr-2' />
              Execute Now
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className='bg-white border-b border-gray-200 px-6 py-3'>
        <div className='flex gap-6 text-sm'>
          <div className='flex items-center gap-2'>
            <Calendar className='w-4 h-4 text-gray-500' />
            <span className='text-gray-600'>Created:</span>
            <span className='font-medium'>
              {new Date(workflow.createdAt).toLocaleDateString()}
            </span>
          </div>
          {workflow.lastRun && (
            <div className='flex items-center gap-2'>
              <Activity className='w-4 h-4 text-gray-500' />
              <span className='text-gray-600'>Last run:</span>
              <span className='font-medium'>
                {new Date(workflow.lastRun).toLocaleDateString()}
              </span>
            </div>
          )}
          <div className='flex items-center gap-2'>
            <BarChart3 className='w-4 h-4 text-gray-500' />
            <span className='text-gray-600'>Total runs:</span>
            <span className='font-medium'>
              {(workflow.totalRuns || 0).toLocaleString()}
            </span>
          </div>
          <div className='flex items-center gap-2'>
            <Users className='w-4 h-4 text-gray-500' />
            <span className='text-gray-600'>Success rate:</span>
            <span className='font-medium'>{workflow.successRate || 0}%</span>
          </div>
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className='w-full'>
        <TabsList className='grid w-full grid-cols-3'>
          <TabsTrigger value='builder'>Workflow Builder</TabsTrigger>
          <TabsTrigger value='settings'>Settings</TabsTrigger>
          <TabsTrigger value='logs'>Execution Logs</TabsTrigger>
        </TabsList>

        {/* Workflow Builder Tab */}
        <TabsContent value='builder' className='mt-0'>
          <div className='flex h-[calc(100vh-200px)]'>
            {/* Left Sidebar - Node Palette */}
            <div className='w-64 bg-white border-r border-gray-200 p-4'>
              <h3 className='font-semibold text-gray-900 mb-4'>Add Nodes</h3>
              <div className='space-y-2'>
                <Button
                  variant='outline'
                  className='w-full justify-start gap-2'
                  onClick={() => {
                    const newNode: Node = {
                      id: `email-${Date.now()}`,
                      type: 'email',
                      position: {
                        x: Math.random() * 400,
                        y: Math.random() * 400,
                      },
                      data: { label: 'Email Node', type: 'email' },
                    };
                    setNodes(nds => [...nds, newNode] as any);
                  }}
                >
                  <Mail className='w-4 h-4' />
                  Email
                </Button>
                <Button
                  variant='outline'
                  className='w-full justify-start gap-2'
                  onClick={() => {
                    const newNode: Node = {
                      id: `condition-${Date.now()}`,
                      type: 'condition',
                      position: {
                        x: Math.random() * 400,
                        y: Math.random() * 400,
                      },
                      data: { label: 'Condition Node', type: 'condition' },
                    };
                    setNodes(nds => [...nds, newNode] as any);
                  }}
                >
                  <Settings className='w-4 h-4' />
                  Condition
                </Button>
              </div>

              <div className='mt-6'>
                <h3 className='font-semibold text-gray-900 mb-4'>
                  Workflow Settings
                </h3>
                <div className='space-y-3'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Name
                    </label>
                    <Input
                      value={workflowName}
                      onChange={e => setWorkflowName(e.target.value)}
                      placeholder='Workflow name'
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Description
                    </label>
                    <Textarea
                      value={workflowDescription}
                      onChange={e => setWorkflowDescription(e.target.value)}
                      placeholder='Workflow description'
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              <div className='mt-6'>
                <Button
                  onClick={autoLayout}
                  variant='outline'
                  className='w-full'
                >
                  Auto Layout
                </Button>
              </div>
            </div>

            {/* Main Canvas */}
            <div className='flex-1 relative bg-gray-100'>
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

            {/* Right Sidebar - Node Configuration */}
            <div className='w-80 bg-white border-l border-gray-200 p-4'>
              {selectedNode ? (
                <div>
                  <div className='flex items-center justify-between mb-4'>
                    <h3 className='font-semibold text-gray-900'>
                      Node Configuration
                    </h3>
                    <Badge className='bg-blue-500'>{selectedNode.type}</Badge>
                  </div>

                  <Tabs defaultValue='general' className='w-full'>
                    <TabsList className='grid w-full grid-cols-2'>
                      <TabsTrigger value='general'>General</TabsTrigger>
                      <TabsTrigger value='settings'>Settings</TabsTrigger>
                    </TabsList>

                    <TabsContent value='general' className='space-y-4'>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                          Label
                        </label>
                        <Input
                          value={selectedNode.data?.label as string}
                          onChange={e => {
                            const updatedNodes = nodes.map((node: any) =>
                              node.id === selectedNode.id
                                ? {
                                    ...node,
                                    data: {
                                      ...node.data,
                                      label: e.target.value,
                                    },
                                  }
                                : node
                            );
                            setNodes(updatedNodes as any);
                            setSelectedNode(
                              updatedNodes.find(
                                n => n.id === selectedNode.id
                              ) || null
                            );
                          }}
                        />
                      </div>

                      {selectedNode.type === 'email' && (
                        <div>
                          <label className='block text-sm font-medium text-gray-700 mb-1'>
                            Email Template
                          </label>
                          <select className='w-full p-2 border border-gray-300 rounded-md'>
                            <option>Welcome Email</option>
                            <option>Follow-up Email</option>
                            <option>Promotional Email</option>
                          </select>
                          <Link href='/templates'>
                            <Button
                              variant='link'
                              className='p-0 h-auto text-sm'
                            >
                              Create New Template
                            </Button>
                          </Link>
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value='settings' className='space-y-4'>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                          Advanced Settings
                        </label>
                        <div className='space-y-2'>
                          <div className='flex items-center space-x-2'>
                            <input type='checkbox' id='continue-on-error' />
                            <label
                              htmlFor='continue-on-error'
                              className='text-sm'
                            >
                              Continue on error
                            </label>
                          </div>
                          <div className='flex items-center space-x-2'>
                            <input type='checkbox' id='log-execution' />
                            <label htmlFor='log-execution' className='text-sm'>
                              Log execution
                            </label>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              ) : (
                <div className='text-center text-gray-500 mt-8'>
                  <Settings className='w-12 h-12 mx-auto mb-4 text-gray-300' />
                  <p>Select a node to configure</p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value='settings' className='mt-0'>
          <div className='p-6'>
            <Card>
              <CardHeader>
                <CardTitle>Workflow Settings</CardTitle>
              </CardHeader>
              <CardContent className='space-y-6'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Workflow Name
                    </label>
                    <Input
                      value={workflowName}
                      onChange={e => setWorkflowName(e.target.value)}
                      placeholder='Enter workflow name'
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Status
                    </label>
                    <Select value={workflow.isActive ? 'active' : 'inactive'}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='active'>Active</SelectItem>
                        <SelectItem value='inactive'>Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Description
                  </label>
                  <Textarea
                    value={workflowDescription}
                    onChange={e => setWorkflowDescription(e.target.value)}
                    placeholder='Describe what this workflow does'
                    rows={4}
                  />
                </div>

                <div className='flex gap-4'>
                  <Button onClick={saveWorkflow}>
                    <Save className='w-4 h-4 mr-2' />
                    Save Changes
                  </Button>
                  <Button variant='outline'>Test Workflow</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Execution Logs Tab */}
        <TabsContent value='logs' className='mt-0'>
          <div className='p-6'>
            <div className='flex items-center justify-between mb-6'>
              <h2 className='text-xl font-semibold text-gray-900'>
                Execution Logs
              </h2>
              <Button onClick={fetchExecutionLogs} variant='outline'>
                Refresh
              </Button>
            </div>

            {executionLogs.length === 0 ? (
              <Card>
                <CardContent className='text-center py-12'>
                  <Activity className='w-12 h-12 text-gray-400 mx-auto mb-4' />
                  <h3 className='text-lg font-medium text-gray-900 mb-2'>
                    No execution logs
                  </h3>
                  <p className='text-gray-600 mb-4'>
                    This workflow hasn't been executed yet
                  </p>
                  <Button onClick={executeWorkflow}>
                    <Play className='w-4 h-4 mr-2' />
                    Execute Workflow
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className='space-y-4'>
                {executionLogs.map(log => (
                  <Card key={log.id}>
                    <CardContent className='p-4'>
                      <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-4'>
                          <Badge
                            variant={
                              log.status === 'success'
                                ? 'default'
                                : log.status === 'failed'
                                ? 'destructive'
                                : 'secondary'
                            }
                          >
                            {log.status}
                          </Badge>

                          <div className='text-sm text-gray-600'>
                            Started: {new Date(log.startTime).toLocaleString()}
                          </div>

                          {log.endTime && (
                            <div className='text-sm text-gray-600'>
                              Duration: {log.duration}
                            </div>
                          )}
                        </div>

                        {log.error && (
                          <div className='text-red-600 text-sm'>
                            Error: {log.error}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
