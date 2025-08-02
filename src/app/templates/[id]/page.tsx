'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
  Download,
  ArrowLeft,
  Mail,
  Palette,
  Code,
  Sparkles,
  Layout,
  CheckCircle,
  AlertCircle,
  Loader2,
  Send,
  Trash2,
  Copy,
} from 'lucide-react';
import ReactEmailEditor, {
  ReactEmailEditorRef,
} from '@/components/ReactEmailEditor';
import Link from 'next/link';

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  previewText: string;
  category: string;
  design?: any;
  html?: string;
  status: 'draft' | 'published';
  createdAt: string;
  updatedAt: string;
  usageCount: number;
}

export default function EditTemplatePage() {
  const params = useParams<{ id: string }>();
  const templateId = params.id as string;
  const router = useRouter();

  const [template, setTemplate] = useState<EmailTemplate | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [activeTab, setActiveTab] = useState('editor');
  const [saveStatus, setSaveStatus] = useState<
    'idle' | 'saving' | 'success' | 'error'
  >('idle');
  const [editorLoaded, setEditorLoaded] = useState(false);
  const [autoSave, setAutoSave] = useState(true);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);

  const emailEditorRef = useRef<ReactEmailEditorRef>(null);

  const categories = [
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

  useEffect(() => {
    fetchTemplate();
  }, [templateId]);

  const fetchTemplate = async () => {
    try {
      const response = await fetch(`/api/email-templates/${templateId}`);
      if (response.ok) {
        const data = await response.json();
        setTemplate(data.template);
      }
    } catch (error) {
      console.error('Error fetching template:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDesign = async (data: any) => {
    if (!template || !template.name?.trim()) {
      setSaveStatus('error');
      return;
    }

    setIsSaving(true);
    setSaveStatus('saving');

    try {
      const templateData = {
        ...template,
        design: data.design,
        html: data.html,
        updatedAt: new Date().toISOString(),
      };

      const response = await fetch(`/api/email-templates/${templateId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(templateData),
      });

      if (response.ok) {
        const savedTemplate = await response.json();
        setTemplate(savedTemplate);
        setSaveStatus('success');
        setLastSaved(new Date());

        // Reset status after 2 seconds
        setTimeout(() => setSaveStatus('idle'), 2000);
      } else {
        setSaveStatus('error');
      }
    } catch (error) {
      console.error('Error saving template:', error);
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportHtml = async () => {
    if (emailEditorRef.current) {
      try {
        const html = await emailEditorRef.current.exportHtml();
        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${
          template?.name?.replace(/\s+/g, '_') || 'email-template'
        }.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Error exporting HTML:', error);
      }
    }
  };

  const handlePublish = async () => {
    if (!template) return;

    try {
      const response = await fetch(`/api/email-templates/${templateId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...template,
          status: 'published',
        }),
      });

      if (response.ok) {
        router.push('/templates');
      }
    } catch (error) {
      console.error('Error publishing template:', error);
    }
  };

  const handleDelete = async () => {
    if (!template || !confirm('Are you sure you want to delete this template?'))
      return;

    try {
      const response = await fetch(`/api/email-templates/${templateId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.push('/templates');
      }
    } catch (error) {
      console.error('Error deleting template:', error);
    }
  };

  const handleDuplicate = async () => {
    if (!template) return;

    try {
      const response = await fetch(
        `/api/email-templates/${templateId}/duplicate`,
        {
          method: 'POST',
        }
      );

      if (response.ok) {
        router.push('/templates');
      }
    } catch (error) {
      console.error('Error duplicating template:', error);
    }
  };

  const sendTestEmail = async () => {
    if (!template) return;

    try {
      const response = await fetch(`/api/email-templates/${templateId}/test`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'test@example.com', // In real app, this would be user input
        }),
      });

      if (response.ok) {
        alert('Test email sent successfully!');
      }
    } catch (error) {
      console.error('Error sending test email:', error);
      alert('Failed to send test email');
    }
  };

  const onEditorLoad = () => {
    setEditorLoaded(true);
  };

  const handleAutoSave = () => {
    setAutoSave(!autoSave);
  };

  useEffect(() => {
    let autoSaveInterval: NodeJS.Timeout;

    if (autoSave && editorLoaded && template?.name?.trim()) {
      autoSaveInterval = setInterval(async () => {
        if (emailEditorRef.current) {
          try {
            const data = await emailEditorRef.current.saveDesign();
            handleSaveDesign(data);
          } catch (error) {
            console.error('Auto-save failed:', error);
          }
        }
      }, 30000); // Auto-save every 30 seconds
    }

    return () => {
      if (autoSaveInterval) {
        clearInterval(autoSaveInterval);
      }
    };
  }, [autoSave, editorLoaded, template?.name]);

  if (loading) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <Loader2 className='w-8 h-8 animate-spin mx-auto mb-4' />
          <p className='text-gray-600'>Loading template...</p>
        </div>
      </div>
    );
  }

  if (!template) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold text-gray-900 mb-2'>
            Template not found
          </h1>
          <Link href='/templates'>
            <Button>Back to Templates</Button>
          </Link>
        </div>
      </div>
    );
  }

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
                Edit Template
              </h1>
              <p className='text-sm text-gray-500'>{template.name}</p>
            </div>

            <Badge
              className={
                categories.find(c => c.value === template.category)?.color ||
                'bg-gray-100 text-gray-800'
              }
            >
              {categories.find(c => c.value === template.category)?.label ||
                template.category}
            </Badge>

            <Badge
              variant={
                template.status === 'published' ? 'default' : 'secondary'
              }
            >
              {template.status}
            </Badge>
          </div>

          <div className='flex items-center gap-3'>
            {saveStatus === 'saving' && (
              <div className='flex items-center gap-2 text-sm text-gray-600'>
                <Loader2 className='w-4 h-4 animate-spin' />
                Saving...
              </div>
            )}

            {saveStatus === 'success' && (
              <div className='flex items-center gap-2 text-sm text-green-600'>
                <CheckCircle className='w-4 h-4' />
                Saved
              </div>
            )}

            {saveStatus === 'error' && (
              <div className='flex items-center gap-2 text-sm text-red-600'>
                <AlertCircle className='w-4 h-4' />
                Error saving
              </div>
            )}

            {lastSaved && (
              <div className='text-xs text-gray-500'>
                Last saved: {lastSaved.toLocaleTimeString()}
              </div>
            )}

            <Button variant='outline' onClick={handleAutoSave} size='sm'>
              {autoSave ? 'Auto-save ON' : 'Auto-save OFF'}
            </Button>

            <Button variant='outline' onClick={handleDuplicate} size='sm'>
              <Copy className='w-4 h-4 mr-2' />
              Duplicate
            </Button>

            <Button variant='outline' onClick={sendTestEmail} size='sm'>
              <Send className='w-4 h-4 mr-2' />
              Send Test
            </Button>

            <Button variant='outline' onClick={handleExportHtml}>
              <Download className='w-4 h-4 mr-2' />
              Export HTML
            </Button>

            <Button onClick={handlePublish}>
              <Save className='w-4 h-4 mr-2' />
              {template.status === 'published' ? 'Update' : 'Publish'}
            </Button>

            <Button variant='destructive' onClick={handleDelete} size='sm'>
              <Trash2 className='w-4 h-4' />
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
                    value={template.name}
                    onChange={e =>
                      setTemplate({ ...template, name: e.target.value })
                    }
                    placeholder='Enter template name'
                    className={
                      saveStatus === 'error' && !template.name.trim()
                        ? 'border-red-500'
                        : ''
                    }
                  />
                  {saveStatus === 'error' && !template.name.trim() && (
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
                    value={template.subject}
                    onChange={e =>
                      setTemplate({ ...template, subject: e.target.value })
                    }
                    placeholder='Enter email subject'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Preview Text
                  </label>
                  <Textarea
                    value={template.previewText}
                    onChange={e =>
                      setTemplate({ ...template, previewText: e.target.value })
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
                    value={template.category}
                    onValueChange={value =>
                      setTemplate({ ...template, category: value })
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
                    value={template.status}
                    onValueChange={value =>
                      setTemplate({
                        ...template,
                        status: value as 'draft' | 'published',
                      })
                    }
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

                <div className='pt-4 border-t border-gray-200'>
                  <div className='grid grid-cols-2 gap-4 text-sm'>
                    <div>
                      <p className='text-gray-500'>Created</p>
                      <p className='font-medium'>
                        {new Date(template.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className='text-gray-500'>Usage</p>
                      <p className='font-medium'>{template.usageCount} times</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <h3 className='text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2'>
                <Sparkles className='w-5 h-5' />
                Quick Actions
              </h3>

              <div className='space-y-2'>
                <Button variant='outline' className='w-full justify-start'>
                  <Layout className='w-4 h-4 mr-2' />
                  Reset to Default
                </Button>

                <Button variant='outline' className='w-full justify-start'>
                  <Sparkles className='w-4 h-4 mr-2' />
                  Generate with AI
                </Button>

                <Button variant='outline' className='w-full justify-start'>
                  <Code className='w-4 h-4 mr-2' />
                  Import HTML
                </Button>
              </div>
            </div>

            {/* Tips */}
            <div>
              <h3 className='text-lg font-semibold text-gray-900 mb-4'>Tips</h3>
              <div className='space-y-3 text-sm text-gray-600'>
                <div className='flex items-start gap-2'>
                  <CheckCircle className='w-4 h-4 text-green-500 mt-0.5 flex-shrink-0' />
                  <p>Changes are auto-saved every 30 seconds</p>
                </div>

                <div className='flex items-start gap-2'>
                  <CheckCircle className='w-4 h-4 text-green-500 mt-0.5 flex-shrink-0' />
                  <p>Test your template before sending to customers</p>
                </div>

                <div className='flex items-start gap-2'>
                  <CheckCircle className='w-4 h-4 text-green-500 mt-0.5 flex-shrink-0' />
                  <p>Use clear, descriptive names for easy management</p>
                </div>

                <div className='flex items-start gap-2'>
                  <CheckCircle className='w-4 h-4 text-green-500 mt-0.5 flex-shrink-0' />
                  <p>Keep preview text under 100 characters</p>
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
            <TabsList className='grid w-full grid-cols-3 m-4'>
              <TabsTrigger value='editor' className='flex items-center gap-2'>
                <Layout className='w-4 h-4' />
                Email Editor
              </TabsTrigger>
              <TabsTrigger value='preview' className='flex items-center gap-2'>
                <Eye className='w-4 h-4' />
                Preview
              </TabsTrigger>
              <TabsTrigger value='settings' className='flex items-center gap-2'>
                <Palette className='w-4 h-4' />
                Settings
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
                  initialDesign={template.design}
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
                  {template.html ? (
                    <div className='bg-white border rounded-lg overflow-hidden'>
                      <iframe
                        srcDoc={template.html}
                        className='w-full h-96 border-0'
                        title='Email Preview'
                      />
                    </div>
                  ) : (
                    <div className='bg-gray-50 rounded-lg p-8 min-h-96'>
                      <div className='text-center text-gray-500'>
                        <Mail className='w-12 h-12 mx-auto mb-4' />
                        <p>Save your template first to generate a preview</p>
                        <p className='text-sm mt-2'>
                          The preview will show exactly how your email will look
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value='settings' className='flex-1 p-6'>
              <div className='space-y-6'>
                <Card>
                  <CardHeader>
                    <CardTitle>Editor Settings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='space-y-4'>
                      <div className='flex items-center justify-between'>
                        <div>
                          <h4 className='font-medium'>Auto-save</h4>
                          <p className='text-sm text-gray-500'>
                            Automatically save changes every 30 seconds
                          </p>
                        </div>
                        <Button
                          variant={autoSave ? 'default' : 'outline'}
                          size='sm'
                          onClick={handleAutoSave}
                        >
                          {autoSave ? 'Enabled' : 'Disabled'}
                        </Button>
                      </div>

                      <div className='flex items-center justify-between'>
                        <div>
                          <h4 className='font-medium'>Template Validation</h4>
                          <p className='text-sm text-gray-500'>
                            Check template for compatibility issues
                          </p>
                        </div>
                        <Button variant='outline' size='sm'>
                          Validate
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Export Options</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='space-y-4'>
                      <Button onClick={handleExportHtml} className='w-full'>
                        <Download className='w-4 h-4 mr-2' />
                        Export as HTML
                      </Button>

                      <Button variant='outline' className='w-full'>
                        <Code className='w-4 h-4 mr-2' />
                        Export Design JSON
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Danger Zone</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='space-y-4'>
                      <Button
                        variant='outline'
                        className='w-full text-red-600 hover:text-red-700 hover:bg-red-50'
                      >
                        Reset to Default
                      </Button>

                      <Button
                        variant='destructive'
                        className='w-full'
                        onClick={handleDelete}
                      >
                        <Trash2 className='w-4 h-4 mr-2' />
                        Delete Template
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
