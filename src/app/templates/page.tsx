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
  Edit,
  Trash2,
  Copy,
  MoreVertical,
  Eye,
  Mail,
  Calendar,
  Star,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import {
  useEmailTemplates,
  useDeleteEmailTemplate,
  useDuplicateEmailTemplate,
} from '@/hooks/useEmailTemplates';
import { useToast } from '@/hooks/use-toast';

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  previewText?: string;
  createdAt: string;
  updatedAt: string;
  usageCount: number;
  category: string;
}

export default function TemplatesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const { toast } = useToast();

  // Use React Query hooks
  const { data, isLoading, error } = useEmailTemplates(
    categoryFilter === 'all' ? undefined : categoryFilter
  );
  const deleteTemplateMutation = useDeleteEmailTemplate();
  const duplicateTemplateMutation = useDuplicateEmailTemplate();

  const templates = data?.templates || [];

  const deleteTemplate = async (templateId: string) => {
    if (!confirm('Are you sure you want to delete this template?')) return;

    try {
      await deleteTemplateMutation.mutateAsync(templateId);
      toast({
        title: 'Success',
        description: 'Template deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting template:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete template',
        variant: 'destructive',
      });
    }
  };

  const duplicateTemplate = async (templateId: string) => {
    try {
      await duplicateTemplateMutation.mutateAsync(templateId);
      toast({
        title: 'Success',
        description: 'Template duplicated successfully',
      });
    } catch (error) {
      console.error('Error duplicating template:', error);
      toast({
        title: 'Error',
        description: 'Failed to duplicate template',
        variant: 'destructive',
      });
    }
  };

  const filteredTemplates = templates.filter(template => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.previewText?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === 'all' || template.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...new Set(templates.map(t => t.category))];

  const stats = {
    totalTemplates: templates.length,
    usedTemplates: templates.filter(t => t.usageCount > 0).length,
    totalUsage: templates.reduce((sum, t) => sum + t.usageCount, 0),
    avgUsage:
      templates.length > 0
        ? Math.round(
            templates.reduce((sum, t) => sum + t.usageCount, 0) /
              templates.length
          )
        : 0,
  };

  if (error) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold text-gray-900 mb-2'>
            Error loading templates
          </h1>
          <p className='text-gray-600 mb-4'>Failed to load email templates</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <div className='bg-white border-b border-gray-200 px-6 py-4'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-2xl font-bold text-gray-900'>
              Email Templates
            </h1>
            <p className='text-gray-600'>Manage your email templates</p>
          </div>
          <Link href='/templates/create'>
            <Button>
              <Plus className='w-4 h-4 mr-2' />
              Create Template
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className='p-6 grid grid-cols-1 md:grid-cols-4 gap-4'>
        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600'>
                  Total Templates
                </p>
                <p className='text-2xl font-bold text-gray-900'>
                  {stats.totalTemplates}
                </p>
              </div>
              <Mail className='w-8 h-8 text-blue-600' />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600'>
                  Used Templates
                </p>
                <p className='text-2xl font-bold text-gray-900'>
                  {stats.usedTemplates}
                </p>
              </div>
              <Star className='w-8 h-8 text-yellow-600' />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600'>Total Usage</p>
                <p className='text-2xl font-bold text-gray-900'>
                  {stats.totalUsage.toLocaleString()}
                </p>
              </div>
              <Users className='w-8 h-8 text-green-600' />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600'>Avg Usage</p>
                <p className='text-2xl font-bold text-gray-900'>
                  {stats.avgUsage}
                </p>
              </div>
              <Calendar className='w-8 h-8 text-purple-600' />
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
                placeholder='Search templates...'
                className='pl-10 w-64'
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>

            <div className='flex gap-2'>
              {categories.map(category => (
                <Button
                  key={category}
                  variant={categoryFilter === category ? 'default' : 'outline'}
                  size='sm'
                  onClick={() => setCategoryFilter(category)}
                >
                  {category === 'all' ? 'All' : category} (
                  {category === 'all'
                    ? templates.length
                    : templates.filter(t => t.category === category).length}
                  )
                </Button>
              ))}
            </div>
          </div>

          <Button variant='outline' size='sm'>
            <Filter className='w-4 h-4 mr-2' />
            More Filters
          </Button>
        </div>
      </div>

      {/* Templates Grid */}
      <div className='px-6 pb-6'>
        {isLoading ? (
          <div className='text-center py-12'>
            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto'></div>
            <p className='text-gray-600 mt-2'>Loading templates...</p>
          </div>
        ) : filteredTemplates.length === 0 ? (
          <Card>
            <CardContent className='text-center py-12'>
              <Mail className='w-12 h-12 text-gray-400 mx-auto mb-4' />
              <h3 className='text-lg font-medium text-gray-900 mb-2'>
                No templates found
              </h3>
              <p className='text-gray-600 mb-4'>
                {searchTerm || categoryFilter !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Create your first email template to get started'}
              </p>
              <Link href='/templates/create'>
                <Button>
                  <Plus className='w-4 h-4 mr-2' />
                  Create Template
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {filteredTemplates.map(template => (
              <Card
                key={template.id}
                className='hover:shadow-md transition-shadow'
              >
                <CardHeader className='pb-3'>
                  <div className='flex items-start justify-between'>
                    <div className='flex-1'>
                      <CardTitle className='text-lg line-clamp-1'>
                        <Link
                          href={`/templates/${template.id}`}
                          className='hover:text-blue-600 transition-colors'
                        >
                          {template.name}
                        </Link>
                      </CardTitle>
                      <Badge variant='outline' className='mt-1 text-xs'>
                        {template.category}
                      </Badge>
                    </div>
                    {template.usageCount > 0 && (
                      <Star className='w-4 h-4 text-yellow-500 fill-current' />
                    )}
                  </div>
                </CardHeader>

                <CardContent className='pt-0'>
                  <div className='space-y-3'>
                    <div>
                      <p className='text-sm font-medium text-gray-700 mb-1'>
                        Subject
                      </p>
                      <p className='text-sm text-gray-600 line-clamp-2'>
                        {template.subject}
                      </p>
                    </div>

                    <div>
                      <p className='text-sm font-medium text-gray-700 mb-1'>
                        Preview Text
                      </p>
                      <p className='text-sm text-gray-600 line-clamp-2'>
                        {template.previewText}
                      </p>
                    </div>

                    <div className='flex items-center justify-between text-xs text-gray-500'>
                      <div className='flex items-center gap-1'>
                        <Calendar className='w-3 h-3' />
                        {new Date(template.updatedAt).toLocaleDateString()}
                      </div>
                      <div className='flex items-center gap-1'>
                        <Users className='w-3 h-3' />
                        {template.usageCount} uses
                      </div>
                    </div>

                    <div className='flex gap-2 pt-2'>
                      <Link href={`/templates/${template.id}`}>
                        <Button variant='outline' size='sm' className='flex-1'>
                          <Edit className='w-3 h-3 mr-1' />
                          Edit
                        </Button>
                      </Link>

                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => duplicateTemplate(template.id)}
                        disabled={duplicateTemplateMutation.isPending}
                      >
                        <Copy className='w-3 h-3' />
                      </Button>

                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => deleteTemplate(template.id)}
                        disabled={deleteTemplateMutation.isPending}
                        className='text-red-600 hover:text-red-700 hover:bg-red-50'
                      >
                        <Trash2 className='w-3 h-3' />
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
