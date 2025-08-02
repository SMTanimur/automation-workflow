import {
  Mail,
  Save,
  Download,
  Eye,
  FileText,
  Menu,
  X,
  Smartphone,
  Tablet,
  Monitor,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface EmailBuilderHeaderProps {
  onSave: () => void;
  onPreview: () => void;
  onExportHtml: () => void;
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
  templateName?: string;
  onTemplateNameChange?: (name: string) => void;
  isSaving?: boolean;
}

export const EmailBuilderHeader = ({
  onSave,
  onPreview,
  onExportHtml,
  onToggleSidebar,
  isSidebarOpen,
  templateName: externalTemplateName,
  onTemplateNameChange,
  isSaving = false,
}: EmailBuilderHeaderProps) => {
  const [templateName, setTemplateName] = useState(
    externalTemplateName || 'Untitled Email'
  );

  useEffect(() => {
    if (externalTemplateName) {
      setTemplateName(externalTemplateName);
    }
  }, [externalTemplateName]);

  const handleTemplateNameChange = (name: string) => {
    setTemplateName(name);
    onTemplateNameChange?.(name);
  };
  const [activePreview, setActivePreview] = useState<
    'desktop' | 'tablet' | 'mobile'
  >('desktop');

  const previewModes = [
    { id: 'desktop' as const, icon: Monitor, label: 'Desktop' },
    { id: 'tablet' as const, icon: Tablet, label: 'Tablet' },
    { id: 'mobile' as const, icon: Smartphone, label: 'Mobile' },
  ];

  return (
    <header className='bg-email-builder-sidebar/95 backdrop-blur-md border-b border-border/50 sticky top-0 z-50'>
      <div className='px-4 py-3 lg:px-6'>
        <div className='flex items-center justify-between gap-4'>
          {/* Left Section */}
          <div className='flex items-center gap-3 flex-1 min-w-0'>
            {/* Mobile Menu Toggle */}
            <Button
              variant='ghost'
              size='sm'
              onClick={onToggleSidebar}
              className='lg:hidden p-2 hover:bg-email-builder-accent-light transition-colors'
            >
              {isSidebarOpen ? (
                <X className='h-4 w-4' />
              ) : (
                <Menu className='h-4 w-4' />
              )}
            </Button>

            {/* Logo */}
            <div className='flex items-center gap-3'>
              <div className='p-2 rounded-xl bg-gradient-primary shadow-lg animate-scale-in'>
                <Mail className='h-5 w-5 text-primary-foreground' />
              </div>
              <div className='hidden sm:block'>
                <h1 className='text-lg lg:text-xl font-bold text-foreground'>
                  Email Craftsmen
                </h1>
                <p className='text-xs text-muted-foreground hidden md:block'>
                  Create stunning email templates
                </p>
              </div>
            </div>

            {/* Template Name Input */}
            <div className='hidden md:flex items-center gap-2 flex-1 max-w-xs'>
              <FileText className='h-4 w-4 text-muted-foreground flex-shrink-0' />
              <Input
                value={templateName}
                onChange={e => handleTemplateNameChange(e.target.value)}
                className='text-sm border-0 bg-muted/50 focus:bg-background transition-colors'
                placeholder='Template name'
              />
            </div>
          </div>

          {/* Center Section - Preview Mode Toggle */}
          <div className='hidden lg:flex items-center gap-1 bg-muted/50 rounded-lg p-1'>
            {previewModes.map(mode => (
              <Button
                key={mode.id}
                variant='ghost'
                size='sm'
                onClick={() => setActivePreview(mode.id)}
                className={cn(
                  'gap-2 transition-all duration-200',
                  activePreview === mode.id
                    ? 'bg-background shadow-sm text-primary'
                    : 'hover:bg-background/50'
                )}
              >
                <mode.icon className='h-4 w-4' />
                <span className='text-xs'>{mode.label}</span>
              </Button>
            ))}
          </div>

          {/* Right Section - Actions */}
          <div className='flex items-center gap-2'>
            {/* Preview Button */}
            <Button
              variant='ghost'
              size='sm'
              onClick={onPreview}
              className='gap-2 hover:bg-email-builder-accent-light transition-colors'
            >
              <Eye className='h-4 w-4' />
              <span className='hidden sm:inline'>Preview</span>
            </Button>

            {/* Export Button */}
            <Button
              variant='ghost'
              size='sm'
              onClick={onExportHtml}
              className='gap-2 hover:bg-email-builder-accent-light transition-colors'
            >
              <Download className='h-4 w-4' />
              <span className='hidden sm:inline'>Export</span>
            </Button>

            {/* Save Button */}
            <Button
              size='sm'
              onClick={() => {
                onSave();
                toast.success('Template saved successfully!');
              }}
              disabled={isSaving}
              className='gap-2'
            >
              {isSaving ? (
                <div className='h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin' />
              ) : (
                <Save className='h-4 w-4' />
              )}
              <span className='hidden sm:inline'>
                {isSaving ? 'Saving...' : 'Save'}
              </span>
            </Button>
          </div>
        </div>

        {/* Mobile Template Name Input */}
        <div className='md:hidden mt-3 flex items-center gap-2'>
          <FileText className='h-4 w-4 text-muted-foreground flex-shrink-0' />
          <Input
            value={templateName}
            onChange={e => handleTemplateNameChange(e.target.value)}
            className='text-sm border-0 bg-muted/50 focus:bg-background transition-colors'
            placeholder='Template name'
          />
        </div>
      </div>
    </header>
  );
};
