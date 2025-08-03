import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface Workflow {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  lastRun?: string;
  totalRuns: number;
  successRate: number;
  nodes: any[];
  edges: any[];
}

interface CreateWorkflowData {
  name: string;
  description?: string;
  nodes?: any[];
  edges?: any[];
}

interface UpdateWorkflowData {
  name?: string;
  description?: string;
  nodes?: any[];
  edges?: any[];
}

// Fetch all workflows
export function useWorkflows() {
  return useQuery<{ workflows: Workflow[] }>({
    queryKey: ['workflows'],
    queryFn: async () => {
      const response = await fetch('/api/workflows');
      if (!response.ok) {
        throw new Error('Failed to fetch workflows');
      }
      return response.json();
    },
  });
}

// Fetch single workflow
export function useWorkflow(id: string) {
  return useQuery<{ workflow: Workflow }>({
    queryKey: ['workflows', id],
    queryFn: async () => {
      const response = await fetch(`/api/workflows/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch workflow');
      }
      return response.json();
    },
    enabled: !!id,
  });
}

// Fetch workflow logs
export function useWorkflowLogs(id: string) {
  return useQuery<{ logs: any[] }>({
    queryKey: ['workflows', id, 'logs'],
    queryFn: async () => {
      const response = await fetch(`/api/workflows/${id}/logs`);
      if (!response.ok) {
        throw new Error('Failed to fetch workflow logs');
      }
      return response.json();
    },
    enabled: !!id,
  });
}

// Create workflow
export function useCreateWorkflow() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateWorkflowData) => {
      const response = await fetch('/api/workflows', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create workflow');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
    },
  });
}

// Update workflow
export function useUpdateWorkflow() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: UpdateWorkflowData;
    }) => {
      const response = await fetch(`/api/workflows/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update workflow');
      }

      return response.json();
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
      queryClient.invalidateQueries({ queryKey: ['workflows', id] });
    },
  });
}

// Delete workflow
export function useDeleteWorkflow() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/workflows/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete workflow');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
    },
  });
}

// Toggle workflow status
export function useToggleWorkflowStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/workflows/${id}/toggle`, {
        method: 'PATCH',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to toggle workflow status');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
    },
  });
}

// Duplicate workflow
export function useDuplicateWorkflow() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/workflows/${id}/duplicate`, {
        method: 'POST',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to duplicate workflow');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
    },
  });
}
