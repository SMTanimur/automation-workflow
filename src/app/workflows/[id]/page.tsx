'use client';

import { useState, useEffect } from 'react';
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
  Square,
  Settings,
  Mail,
  Clock,
  GitBranch,
  Plus,
  Trash2,
  Type,
  Image as ImageIcon,
  Layout,
  Columns,
  Eye,
  Code,
  Palette,
  Sparkles,
  ArrowLeft,
  Save,
  BarChart3,
  Activity,
  Calendar,
  Users,
} from 'lucide-react';
import Link from 'next/link';

interface Node {
  id: string;
  type: 'trigger' | 'email' | 'delay' | 'condition' | 'action' | 'end';
  position: { x: number; y: number };
  data: any;
}

interface Edge {
  id: string;
  source: string;
  target: string;
}

interface Workflow {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  lastRun?: string;
  totalRuns: number;
  successRate: number;
  nodes: Node[];
  edges: Edge[];
}

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

  const [workflow, setWorkflow] = useState<Workflow | null>(null);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [workflowName, setWorkflowName] = useState('');
  const [workflowDescription, setWorkflowDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('builder');
  const [executionLogs, setExecutionLogs] = useState<ExecutionLog[]>([]);

  useEffect(() => {
    fetchWorkflow();
    fetchExecutionLogs();
  }, [workflowId]);

  const fetchWorkflow = async () => {
    try {
      const response = await fetch(`/api/workflows/${workflowId}`);
      if (response.ok) {
        const data = await response.json();
        const workflowData = data.workflow;
        setWorkflow(workflowData);
        setNodes(workflowData.nodes || []);
        setEdges(workflowData.edges || []);
        setWorkflowName(workflowData.name);
        setWorkflowDescription(workflowData.description);
      }
    } catch (error) {
      console.error('Error fetching workflow:', error);
    } finally {
      setLoading(false);
    }
  };

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

  const saveWorkflow = async () => {
    try {
      const response = await fetch(`/api/workflows/${workflowId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: workflowName,
          description: workflowDescription,
          nodes,
          edges,
        }),
      });

      if (response.ok) {
        fetchWorkflow(); // Refresh the data
      }
    } catch (error) {
      console.error('Error saving workflow:', error);
    }
  };

  const executeWorkflow = async () => {
    try {
      const response = await fetch(`/api/workflows/${workflowId}/execute`, {
        method: 'POST',
      });

      if (response.ok) {
        fetchExecutionLogs(); // Refresh logs
      }
    } catch (error) {
      console.error('Error executing workflow:', error);
    }
  };

  const nodeTypes = {
    trigger: { icon: Play, color: 'bg-green-500', label: 'Trigger' },
    email: { icon: Mail, color: 'bg-blue-500', label: 'Email' },
    delay: { icon: Clock, color: 'bg-yellow-500', label: 'Delay' },
    condition: { icon: GitBranch, color: 'bg-purple-500', label: 'Condition' },
    action: { icon: Settings, color: 'bg-orange-500', label: 'Action' },
    end: { icon: Square, color: 'bg-red-500', label: 'End' },
  };

  const addNode = (type: Node['type']) => {
    const newNode: Node = {
      id: `${nodes.length + 1}`,
      type,
      position: { x: 100 + nodes.length * 200, y: 200 },
      data: { label: `${nodeTypes[type].label} ${nodes.length + 1}` },
    };
    setNodes([...nodes, newNode]);
  };

  const deleteNode = (nodeId: string) => {
    setNodes(nodes.filter(node => node.id !== nodeId));
    setEdges(
      edges.filter(edge => edge.source !== nodeId && edge.target !== nodeId)
    );
    if (selectedNode?.id === nodeId) {
      setSelectedNode(null);
    }
  };

  const renderNode = (node: Node) => {
    const nodeType = nodeTypes[node.type];
    const Icon = nodeType.icon;
    const isSelected = selectedNode?.id === node.id;

    return (
      <div
        key={node.id}
        className={`absolute cursor-pointer transition-all duration-200 ${
          isSelected ? 'ring-2 ring-blue-400 ring-offset-2' : ''
        }`}
        style={{ left: node.position.x, top: node.position.y }}
        onClick={() => setSelectedNode(node)}
      >
        <div
          className={`${nodeType.color} rounded-lg p-4 shadow-lg min-w-[120px]`}
        >
          <div className='flex items-center justify-between mb-2'>
            <Icon className='w-5 h-5 text-white' />
            <Button
              variant='ghost'
              size='sm'
              className='h-6 w-6 p-0 text-white hover:text-red-200'
              onClick={e => {
                e.stopPropagation();
                deleteNode(node.id);
              }}
            >
              <Trash2 className='w-3 h-3' />
            </Button>
          </div>
          <div className='text-white text-sm font-medium text-center'>
            {node.data.label}
          </div>
        </div>
        <div className='absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-gray-400 rounded-full'></div>
      </div>
    );
  };

  const renderEdge = (edge: Edge) => {
    const sourceNode = nodes.find(n => n.id === edge.source);
    const targetNode = nodes.find(n => n.id === edge.target);

    if (!sourceNode || !targetNode) return null;

    const sourceX = sourceNode.position.x + 60;
    const sourceY = sourceNode.position.y + 80;
    const targetX = targetNode.position.x + 60;
    const targetY = targetNode.position.y;

    return (
      <svg
        key={edge.id}
        className='absolute top-0 left-0 w-full h-full pointer-events-none'
      >
        <line
          x1={sourceX}
          y1={sourceY}
          x2={targetX}
          y2={targetY}
          stroke='#6B7280'
          strokeWidth='2'
          markerEnd='url(#arrowhead)'
        />
      </svg>
    );
  };

  if (loading) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
      </div>
    );
  }

  if (!workflow) {
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
              {workflow.totalRuns.toLocaleString()}
            </span>
          </div>
          <div className='flex items-center gap-2'>
            <Users className='w-4 h-4 text-gray-500' />
            <span className='text-gray-600'>Success rate:</span>
            <span className='font-medium'>{workflow.successRate}%</span>
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
                {Object.entries(nodeTypes).map(([type, config]) => (
                  <Button
                    key={type}
                    variant='outline'
                    className='w-full justify-start gap-2'
                    onClick={() => addNode(type as Node['type'])}
                  >
                    <config.icon className='w-4 h-4' />
                    {config.label}
                  </Button>
                ))}
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
            </div>

            {/* Main Canvas */}
            <div className='flex-1 relative bg-gray-100 overflow-hidden'>
              <div className='relative w-full h-full'>
                {/* Grid background */}
                <div className='absolute inset-0 bg-grid-gray-300 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.6))]'></div>

                {/* Edges */}
                <svg className='absolute top-0 left-0 w-full h-full pointer-events-none'>
                  <defs>
                    <marker
                      id='arrowhead'
                      markerWidth='10'
                      markerHeight='7'
                      refX='9'
                      refY='3.5'
                      orient='auto'
                    >
                      <polygon points='0 0, 10 3.5, 0 7' fill='#6B7280' />
                    </marker>
                  </defs>
                </svg>
                {edges.map(renderEdge)}

                {/* Nodes */}
                {nodes.map(renderNode)}
              </div>
            </div>

            {/* Right Sidebar - Node Configuration */}
            <div className='w-80 bg-white border-l border-gray-200 p-4'>
              {selectedNode ? (
                <div>
                  <div className='flex items-center justify-between mb-4'>
                    <h3 className='font-semibold text-gray-900'>
                      Node Configuration
                    </h3>
                    <Badge className={nodeTypes[selectedNode.type].color}>
                      {nodeTypes[selectedNode.type].label}
                    </Badge>
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
                          value={selectedNode.data.label}
                          onChange={e => {
                            const updatedNodes = nodes.map(node =>
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
                            setNodes(updatedNodes);
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

                      {selectedNode.type === 'delay' && (
                        <div>
                          <label className='block text-sm font-medium text-gray-700 mb-1'>
                            Delay Duration
                          </label>
                          <div className='flex gap-2'>
                            <Input
                              type='number'
                              placeholder='1'
                              className='w-20'
                            />
                            <select className='flex-1 p-2 border border-gray-300 rounded-md'>
                              <option>minutes</option>
                              <option>hours</option>
                              <option>days</option>
                              <option>weeks</option>
                            </select>
                          </div>
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
