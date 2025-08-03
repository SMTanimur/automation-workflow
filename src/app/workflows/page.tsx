'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Plus,
  Search,
  Filter,
  Play,
  Pause,
  Edit,
  Trash2,
  Copy,
  MoreVertical,
  Calendar,
  Users,
  BarChart3,
} from 'lucide-react';
import Link from 'next/link';
import {
  useWorkflows,
  useToggleWorkflowStatus,
  useDeleteWorkflow,
  useDuplicateWorkflow,
} from '@/hooks/useWorkflows';
import { toast } from 'sonner';
import { CreateWorkflowDialog } from '@/components/workflow/CreateWorkflowDialog';

interface Workflow {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  lastRun?: string;
  totalRuns?: number;
  successRate?: number;
  nodes: any[];
  edges: any[];
}

export default function WorkflowsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<
    'all' | 'active' | 'inactive'
  >('all');

  // React Query hooks
  const { data, isLoading, error } = useWorkflows();
  const toggleWorkflowStatusMutation = useToggleWorkflowStatus();
  const deleteWorkflowMutation = useDeleteWorkflow();
  const duplicateWorkflowMutation = useDuplicateWorkflow();

  const workflows = data?.workflows || [];

  const handleToggleStatus = async (
    workflowId: string,
    currentStatus: boolean
  ) => {
    try {
      await toggleWorkflowStatusMutation.mutateAsync(workflowId);
      toast.success(
        `Workflow ${currentStatus ? 'paused' : 'started'} successfully`
      );
    } catch (error) {
      toast.error('Failed to toggle workflow status');
    }
  };

  const handleDeleteWorkflow = async (workflowId: string) => {
    if (!confirm('Are you sure you want to delete this workflow?')) return;

    try {
      await deleteWorkflowMutation.mutateAsync(workflowId);
      toast.success('Workflow deleted successfully');
    } catch (error) {
      toast.error('Failed to delete workflow');
    }
  };

  const handleDuplicateWorkflow = async (workflowId: string) => {
    try {
      await duplicateWorkflowMutation.mutateAsync(workflowId);
      toast.success('Workflow duplicated successfully');
    } catch (error) {
      toast.error('Failed to duplicate workflow');
    }
  };

  const filteredWorkflows = workflows.filter(workflow => {
    const matchesSearch =
      workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      workflow.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && workflow.isActive) ||
      (statusFilter === 'inactive' && !workflow.isActive);

    return matchesSearch && matchesStatus;
  });

  const stats = {
    totalWorkflows: workflows.length,
    activeWorkflows: workflows.filter(w => w.isActive).length,
    totalRuns: workflows.reduce((sum, w) => sum + (w.totalRuns || 0), 0),
    avgSuccessRate:
      workflows.length > 0
        ? Math.round(
            workflows.reduce((sum, w) => sum + (w.successRate || 0), 0) /
              workflows.length
          )
        : 0,
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <div className='bg-white border-b border-gray-200 px-6 py-4'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-2xl font-bold text-gray-900'>Workflows</h1>
            <p className='text-gray-600'>Manage your automated workflows</p>
          </div>
          <CreateWorkflowDialog>
            <Button>
              <Plus className='w-4 h-4 mr-2' />
              Create Workflow
            </Button>
          </CreateWorkflowDialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className='p-6 grid grid-cols-1 md:grid-cols-4 gap-4'>
        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600'>
                  Total Workflows
                </p>
                <p className='text-2xl font-bold text-gray-900'>
                  {stats.totalWorkflows}
                </p>
              </div>
              <BarChart3 className='w-8 h-8 text-blue-600' />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600'>
                  Active Workflows
                </p>
                <p className='text-2xl font-bold text-gray-900'>
                  {stats.activeWorkflows}
                </p>
              </div>
              <Play className='w-8 h-8 text-green-600' />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600'>Total Runs</p>
                <p className='text-2xl font-bold text-gray-900'>
                  {(stats.totalRuns || 0).toLocaleString()}
                </p>
              </div>
              <Calendar className='w-8 h-8 text-purple-600' />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600'>
                  Success Rate
                </p>
                <p className='text-2xl font-bold text-gray-900'>
                  {stats.avgSuccessRate}%
                </p>
              </div>
              <Users className='w-8 h-8 text-orange-600' />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className='px-6 pb-4'>
        <div className='flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between'>
          <div className='flex gap-2'>
            <div className='relative'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4' />
              <Input
                placeholder='Search workflows...'
                className='pl-10 w-64'
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>

            <div className='flex gap-2'>
              <Button
                variant={statusFilter === 'all' ? 'default' : 'outline'}
                size='sm'
                onClick={() => setStatusFilter('all')}
              >
                All ({workflows.length})
              </Button>
              <Button
                variant={statusFilter === 'active' ? 'default' : 'outline'}
                size='sm'
                onClick={() => setStatusFilter('active')}
              >
                Active ({workflows.filter(w => w.isActive).length})
              </Button>
              <Button
                variant={statusFilter === 'inactive' ? 'default' : 'outline'}
                size='sm'
                onClick={() => setStatusFilter('inactive')}
              >
                Inactive ({workflows.filter(w => !w.isActive).length})
              </Button>
            </div>
          </div>

          <Button variant='outline' size='sm'>
            <Filter className='w-4 h-4 mr-2' />
            More Filters
          </Button>
        </div>
      </div>

      {/* Workflows List */}
      <div className='px-6 pb-6'>
        {isLoading ? (
          <div className='text-center py-12'>
            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto'></div>
            <p className='text-gray-600 mt-2'>Loading workflows...</p>
          </div>
        ) : filteredWorkflows.length === 0 ? (
          <Card>
            <CardContent className='text-center py-12'>
              <BarChart3 className='w-12 h-12 text-gray-400 mx-auto mb-4' />
              <h3 className='text-lg font-medium text-gray-900 mb-2'>
                No workflows found
              </h3>
              <p className='text-gray-600 mb-4'>
                {searchTerm || statusFilter !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Create your first workflow to get started'}
              </p>
              <CreateWorkflowDialog>
                <Button>
                  <Plus className='w-4 h-4 mr-2' />
                  Create Workflow
                </Button>
              </CreateWorkflowDialog>
            </CardContent>
          </Card>
        ) : (
          <div className='grid gap-4'>
            {filteredWorkflows.map(workflow => (
              <Card
                key={workflow.id}
                className='hover:shadow-md transition-shadow'
              >
                <CardContent className='p-6'>
                  <div className='flex items-start justify-between'>
                    <div className='flex-1'>
                      <div className='flex items-center gap-3 mb-2'>
                        <h3 className='text-lg font-semibold text-gray-900'>
                          <Link
                            href={`/workflows/${workflow.id}`}
                            className='hover:text-blue-600 transition-colors'
                          >
                            {workflow.name}
                          </Link>
                        </h3>
                        <Badge
                          variant={workflow.isActive ? 'default' : 'secondary'}
                        >
                          {workflow.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>

                      <p className='text-gray-600 mb-3'>
                        {workflow.description}
                      </p>

                      <div className='flex flex-wrap gap-4 text-sm text-gray-500'>
                        <div className='flex items-center gap-1'>
                          <Calendar className='w-4 h-4' />
                          Created:{' '}
                          {workflow.createdAt
                            ? new Date(workflow.createdAt).toLocaleDateString()
                            : 'N/A'}
                        </div>
                        {workflow.lastRun && (
                          <div className='flex items-center gap-1'>
                            <Calendar className='w-4 h-4' />
                            Last run:{' '}
                            {new Date(workflow.lastRun).toLocaleDateString()}
                          </div>
                        )}
                        <div className='flex items-center gap-1'>
                          <BarChart3 className='w-4 h-4' />
                          {(workflow.totalRuns || 0).toLocaleString()} runs
                        </div>
                        <div className='flex items-center gap-1'>
                          <Users className='w-4 h-4' />
                          {workflow.successRate || 0}% success rate
                        </div>
                      </div>
                    </div>

                    <div className='flex items-center gap-2 ml-4'>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() =>
                          handleToggleStatus(workflow.id, workflow.isActive)
                        }
                        disabled={toggleWorkflowStatusMutation.isPending}
                      >
                        {workflow.isActive ? (
                          <>
                            <Pause className='w-4 h-4 mr-1' />
                            Pause
                          </>
                        ) : (
                          <>
                            <Play className='w-4 h-4 mr-1' />
                            Start
                          </>
                        )}
                      </Button>

                      <Link href={`/workflows/${workflow.id}`}>
                        <Button variant='outline' size='sm'>
                          <Edit className='w-4 h-4 mr-1' />
                          Edit
                        </Button>
                      </Link>

                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => handleDuplicateWorkflow(workflow.id)}
                        disabled={duplicateWorkflowMutation.isPending}
                      >
                        <Copy className='w-4 h-4 mr-1' />
                        Duplicate
                      </Button>

                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => handleDeleteWorkflow(workflow.id)}
                        disabled={deleteWorkflowMutation.isPending}
                        className='text-red-600 hover:text-red-700 hover:bg-red-50'
                      >
                        <Trash2 className='w-4 h-4 mr-1' />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
