'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import {
  Save,
  Eye,
  ArrowLeft,
  Mail,
  Layout,
  CheckCircle,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import ReactEmailEditor, {
  ReactEmailEditorRef,
} from '@/components/ReactEmailEditor';
import Link from 'next/link';
import { useCreateEmailTemplate } from '@/hooks/useEmailTemplates';
import { useToast } from '@/hooks/use-toast';

export default function CreateTemplatePage() {
  const router = useRouter();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState('editor');
  const [saveStatus, setSaveStatus] = useState<
    'idle' | 'saving' | 'success' | 'error'
  >('idle');
  const [editorLoaded, setEditorLoaded] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const emailEditorRef = useRef<ReactEmailEditorRef>(null);

  // Template form state
  const [templateData, setTemplateData] = useState({
    name: '',
    subject: '',
    previewText: '',
    category: 'general',
    status: 'draft' as 'draft' | 'published',
  });

  // Use React Query hook
  const createTemplateMutation = useCreateEmailTemplate();

  const categories = [
    {
      value: 'general',
      label: 'General',
      color: 'bg-gray-100 text-gray-800',
    },
    {
      value: 'marketing',
      label: 'Marketing',
      color: 'bg-blue-100 text-blue-800',
    },
    {
      value: 'transactional',
      label: 'Transactional',
      color: 'bg-green-100 text-green-800',
    },
    {
      value: 'newsletter',
      label: 'Newsletter',
      color: 'bg-purple-100 text-purple-800',
    },
    {
      value: 'welcome',
      label: 'Welcome',
      color: 'bg-yellow-100 text-yellow-800',
    },
    {
      value: 'promotional',
      label: 'Promotional',
      color: 'bg-red-100 text-red-800',
    },
    {
      value: 'notification',
      label: 'Notification',
      color: 'bg-gray-100 text-gray-800',
    },
  ];

  const handleSaveDesign = async (data: any) => {
    if (!templateData.name?.trim() || !templateData.subject?.trim()) {
      setSaveStatus('error');
      toast({
        title: 'Error',
        description: 'Template name and subject are required',
        variant: 'destructive',
      });
      return;
    }

    setSaveStatus('saving');

    try {
      const newTemplate = await createTemplateMutation.mutateAsync({
        ...templateData,
        design: data.design,
        html: data.html,
      });

      setSaveStatus('success');
      setLastSaved(new Date());

      toast({
        title: 'Success',
        description: 'Template created successfully',
      });

      // Redirect to the new template
      router.push(`/templates/${newTemplate.template.id}`);

      // Reset status after 2 seconds
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      console.error('Error creating template:', error);
      setSaveStatus('error');
      toast({
        title: 'Error',
        description: 'Failed to create template',
        variant: 'destructive',
      });
    }
  };

  const onEditorLoad = () => {
    setEditorLoaded(true);
  };

  const handleInputChange = (field: string, value: string) => {
    setTemplateData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <header className='bg-white border-b border-gray-200 px-6 py-4'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-4'>
            <Link href='/templates'>
              <Button variant='outline' size='sm'>
                <ArrowLeft className='w-4 h-4 mr-2' />
                Back to Templates
              </Button>
            </Link>

            <div>
              <h1 className='text-2xl font-bold text-gray-900'>
                Create New Template
              </h1>
              <p className='text-sm text-gray-500'>
                Design your email template
              </p>
            </div>

            <Badge
              className={
                categories.find(c => c.value === templateData.category)
                  ?.color || 'bg-gray-100 text-gray-800'
              }
            >
              {categories.find(c => c.value === templateData.category)?.label ||
                templateData.category}
            </Badge>

            <Badge variant='secondary'>{templateData.status}</Badge>
          </div>

          <div className='flex items-center gap-3'>
            {saveStatus === 'saving' && (
              <div className='flex items-center gap-2 text-sm text-gray-600'>
                <Loader2 className='w-4 h-4 animate-spin' />
                Creating...
              </div>
            )}

            {saveStatus === 'success' && (
              <div className='flex items-center gap-2 text-sm text-green-600'>
                <CheckCircle className='w-4 h-4' />
                Created
              </div>
            )}

            {saveStatus === 'error' && (
              <div className='flex items-center gap-2 text-sm text-red-600'>
                <AlertCircle className='w-4 h-4' />
                Error creating
              </div>
            )}

            {lastSaved && (
              <div className='text-xs text-gray-500'>
                Last saved: {lastSaved.toLocaleTimeString()}
              </div>
            )}

            <Button
              onClick={() => {
                if (emailEditorRef.current) {
                  emailEditorRef.current.saveDesign().then(handleSaveDesign);
                }
              }}
              disabled={createTemplateMutation.isPending}
            >
              <Save className='w-4 h-4 mr-2' />
              Create Template
            </Button>
          </div>
        </div>
      </header>

      <div className='flex h-[calc(100vh-120px)]'>
        {/* Left Sidebar - Template Settings */}
        <div className='w-80 bg-white border-r border-gray-200 p-6 overflow-y-auto'>
          <div className='space-y-6'>
            {/* Template Information */}
            <div>
              <h3 className='text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2'>
                <Mail className='w-5 h-5' />
                Template Information
              </h3>

              <div className='space-y-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Template Name *
                  </label>
                  <Input
                    value={templateData.name}
                    onChange={e => handleInputChange('name', e.target.value)}
                    placeholder='Enter template name'
                    className={
                      saveStatus === 'error' && !templateData.name.trim()
                        ? 'border-red-500'
                        : ''
                    }
                  />
                  {saveStatus === 'error' && !templateData.name.trim() && (
                    <p className='text-xs text-red-600 mt-1'>
                      Template name is required
                    </p>
                  )}
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Email Subject *
                  </label>
                  <Input
                    value={templateData.subject}
                    onChange={e => handleInputChange('subject', e.target.value)}
                    placeholder='Enter email subject'
                    className={
                      saveStatus === 'error' && !templateData.subject.trim()
                        ? 'border-red-500'
                        : ''
                    }
                  />
                  {saveStatus === 'error' && !templateData.subject.trim() && (
                    <p className='text-xs text-red-600 mt-1'>
                      Email subject is required
                    </p>
                  )}
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Preview Text
                  </label>
                  <Textarea
                    value={templateData.previewText}
                    onChange={e =>
                      handleInputChange('previewText', e.target.value)
                    }
                    placeholder='Enter preview text (appears in email client inbox)'
                    rows={3}
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Category
                  </label>
                  <Select
                    value={templateData.category}
                    onValueChange={value =>
                      handleInputChange('category', value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='Select category' />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category.value} value={category.value}>
                          <div className='flex items-center gap-2'>
                            <Badge className={category.color}>
                              {category.label}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Status
                  </label>
                  <Select
                    value={templateData.status}
                    onValueChange={value => handleInputChange('status', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='draft'>
                        <div className='flex items-center gap-2'>
                          <Badge variant='outline'>Draft</Badge>
                        </div>
                      </SelectItem>
                      <SelectItem value='published'>
                        <div className='flex items-center gap-2'>
                          <Badge className='bg-green-100 text-green-800'>
                            Published
                          </Badge>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div>
              <h3 className='text-lg font-semibold text-gray-900 mb-4'>Tips</h3>
              <div className='space-y-3 text-sm text-gray-600'>
                <div className='flex items-start gap-2'>
                  <CheckCircle className='w-4 h-4 text-green-500 mt-0.5 flex-shrink-0' />
                  <p>Use clear, descriptive names for easy management</p>
                </div>

                <div className='flex items-start gap-2'>
                  <CheckCircle className='w-4 h-4 text-green-500 mt-0.5 flex-shrink-0' />
                  <p>Write compelling subject lines to improve open rates</p>
                </div>

                <div className='flex items-start gap-2'>
                  <CheckCircle className='w-4 h-4 text-green-500 mt-0.5 flex-shrink-0' />
                  <p>Keep preview text under 100 characters</p>
                </div>

                <div className='flex items-start gap-2'>
                  <CheckCircle className='w-4 h-4 text-green-500 mt-0.5 flex-shrink-0' />
                  <p>Choose the right category for better organization</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className='flex-1 flex flex-col'>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className='flex-1'
          >
            <TabsList className='grid w-full grid-cols-2 m-4'>
              <TabsTrigger value='editor' className='flex items-center gap-2'>
                <Layout className='w-4 h-4' />
                Email Editor
              </TabsTrigger>
              <TabsTrigger value='preview' className='flex items-center gap-2'>
                <Eye className='w-4 h-4' />
                Preview
              </TabsTrigger>
            </TabsList>

            {/* Editor Tab */}
            <TabsContent value='editor' className='flex-1 p-0 m-0'>
              <div className='h-full'>
                {!editorLoaded && (
                  <div className='flex items-center justify-center h-full'>
                    <div className='text-center'>
                      <Loader2 className='w-8 h-8 animate-spin mx-auto mb-4' />
                      <p className='text-gray-600'>Loading email editor...</p>
                    </div>
                  </div>
                )}

                <ReactEmailEditor
                  ref={emailEditorRef}
                  onSave={handleSaveDesign}
                  onLoad={onEditorLoad}
                  height='calc(100vh - 200px)'
                />
              </div>
            </TabsContent>

            {/* Preview Tab */}
            <TabsContent value='preview' className='flex-1 p-6'>
              <Card>
                <CardHeader>
                  <CardTitle>Template Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='bg-gray-50 rounded-lg p-8 min-h-96'>
                    <div className='text-center text-gray-500'>
                      <Mail className='w-12 h-12 mx-auto mb-4' />
                      <p>Save your template first to generate a preview</p>
                      <p className='text-sm mt-2'>
                        The preview will show exactly how your email will look
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
