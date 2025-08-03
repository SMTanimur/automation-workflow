import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  previewText?: string;
  category: string;
  design: any;
  html?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  usageCount: number;
}

interface CreateEmailTemplateData {
  name: string;
  subject: string;
  previewText?: string;
  category?: string;
  design?: any;
  html?: string;
  status?: string;
}

interface UpdateEmailTemplateData {
  name?: string;
  subject?: string;
  previewText?: string;
  category?: string;
  design?: any;
  html?: string;
  status?: string;
}

// Fetch all email templates
export function useEmailTemplates(category?: string) {
  return useQuery<{ templates: EmailTemplate[] }>({
    queryKey: ['email-templates', category],
    queryFn: async () => {
      const url =
        category && category !== 'all'
          ? `/api/email-templates?category=${category}`
          : '/api/email-templates';

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch email templates');
      }
      return response.json();
    },
  });
}

// Fetch single email template
export function useEmailTemplate(id: string) {
  return useQuery<{ template: EmailTemplate }>({
    queryKey: ['email-templates', id],
    queryFn: async () => {
      const response = await fetch(`/api/email-templates/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch email template');
      }
      return response.json();
    },
    enabled: !!id,
  });
}

// Fetch email template by category
export function useEmailTemplatesByCategory(category: string) {
  return useQuery<{ templates: EmailTemplate[] }>({
    queryKey: ['email-templates', 'category', category],
    queryFn: async () => {
      const response = await fetch(`/api/email-templates?category=${category}`);
      if (!response.ok) {
        throw new Error('Failed to fetch email templates');
      }
      return response.json();
    },
    enabled: !!category && category !== 'all',
  });
}

// Create email template
export function useCreateEmailTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateEmailTemplateData) => {
      const response = await fetch('/api/email-templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create email template');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['email-templates'] });
    },
  });
}

// Update email template
export function useUpdateEmailTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: UpdateEmailTemplateData;
    }) => {
      const response = await fetch(`/api/email-templates/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update email template');
      }

      return response.json();
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['email-templates'] });
      queryClient.invalidateQueries({ queryKey: ['email-templates', id] });
    },
  });
}

// Delete email template
export function useDeleteEmailTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/email-templates/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete email template');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['email-templates'] });
    },
  });
}

// Duplicate email template
export function useDuplicateEmailTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/email-templates/${id}/duplicate`, {
        method: 'POST',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to duplicate email template');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['email-templates'] });
    },
  });
}

// Update email template usage count
export function useUpdateEmailTemplateUsage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      usageCount,
    }: {
      id: string;
      usageCount: number;
    }) => {
      const response = await fetch(`/api/email-templates/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ usageCount }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update email template usage');
      }

      return response.json();
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['email-templates'] });
      queryClient.invalidateQueries({ queryKey: ['email-templates', id] });
    },
  });
}
