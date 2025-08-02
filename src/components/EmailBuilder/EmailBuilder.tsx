import { useState } from 'react';
import { EmailBuilderHeader } from './EmailBuilderHeader';
import { EmailEditorComponent } from './EmailEditor';
import { TemplateLibrary } from './TemplateLibrary';
import { MobileSidebar } from './MobileSidebar';
import { LoadingScreen } from './LoadingScreen';

import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from 'sonner';

interface EmailBuilderProps {
  template?: {
    id: string;
    name: string;
    design?: any;
  };
  onSave?: (data: { name: string; design: any; html: string }) => void;
  onTemplateSelect?: (templateId: string) => void;
  templates?: any[];
  onDeleteTemplate?: (templateId: string) => void;
  onCreateNewTemplate?: () => void;
}

export const EmailBuilder = ({
  template,
  onSave,
  onTemplateSelect,
  templates,
  onDeleteTemplate,
  onCreateNewTemplate,
}: EmailBuilderProps) => {
  const [isEditorLoaded, setIsEditorLoaded] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [templateName, setTemplateName] = useState(
    template?.name || 'Untitled Email'
  );
  const isMobile = useIsMobile();

  const handleSaveTemplate = () => {
    const actions = (window as any).emailEditorActions;
    if (actions && onSave) {
      setIsSaving(true);
      actions.saveDesign();
    } else {
      toast.error('Editor not ready yet', {
        description: 'Please wait a moment and try again',
      });
    }
  };

  const handleEditorSave = (data: { design: any; html: string }) => {
    if (onSave) {
      onSave({
        name: templateName,
        design: data.design,
        html: data.html,
      });
    }
    setIsSaving(false);
  };

  const handlePreview = () => {
    const actions = (window as any).emailEditorActions;
    if (actions) {
      actions.previewTemplate();
      toast.success('Opening preview', {
        description: 'Your email will open in a new window',
      });
    } else {
      toast.error('Editor not ready yet', {
        description: 'Please wait a moment and try again',
      });
    }
  };

  const handleExportHtml = () => {
    const actions = (window as any).emailEditorActions;
    if (actions) {
      actions.exportHtml();
      toast.success('HTML exported successfully!', {
        description: 'Your email template has been downloaded',
      });
    } else {
      toast.error('Editor not ready yet', {
        description: 'Please wait a moment and try again',
      });
    }
  };

  const handleTemplateSelect = (templateId: string) => {
    setIsEditorLoaded(false);
    if (isMobile) {
      setIsSidebarOpen(false);
    }
    onTemplateSelect?.(templateId);
    // Add a small delay for better UX transition
    setTimeout(() => setIsEditorLoaded(true), 300);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // if (isEditorLoaded && currentTemplate === null) {
  //   return <LoadingScreen />;
  // }

  return (
    <div className='h-screen flex flex-col bg-email-builder-bg overflow-hidden'>
      {/* Header */}
      <EmailBuilderHeader
        onSave={handleSaveTemplate}
        onPreview={handlePreview}
        onExportHtml={handleExportHtml}
        onToggleSidebar={toggleSidebar}
        isSidebarOpen={isSidebarOpen}
        templateName={templateName}
        onTemplateNameChange={setTemplateName}
        isSaving={isSaving}
      />

      <div className='flex-1 flex relative overflow-hidden'>
        {/* Desktop Sidebar */}
        {!isMobile && (
          <aside className='w-16 xl:w-20 bg-email-builder-sidebar/95 backdrop-blur-md border-r border-border/50 flex flex-col items-center py-6 gap-6 z-10'>
            <div className='w-full px-3'>
              <TemplateLibrary
                onSelectTemplate={handleTemplateSelect}
                templates={templates}
                onDeleteTemplate={onDeleteTemplate}
                onCreateNewTemplate={onCreateNewTemplate}
              />
            </div>
          </aside>
        )}

        {/* Mobile Sidebar */}
        {isMobile && (
          <MobileSidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            onSelectTemplate={handleTemplateSelect}
            templates={templates}
            onDeleteTemplate={onDeleteTemplate}
            onCreateNewTemplate={onCreateNewTemplate}
          />
        )}

        {/* Mobile Sidebar Overlay */}
        {isMobile && isSidebarOpen && (
          <div
            className='fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden animate-fade-in'
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Editor Area */}
        <main className='flex-1 bg-email-builder-canvas relative overflow-hidden'>
          {isEditorLoaded || !template ? (
            <div className='h-full w-full animate-fade-in'>
              <EmailEditorComponent
                onLoad={() => setIsEditorLoaded(true)}
                onSave={handleEditorSave}
                initialDesign={template?.design}
                templateName={templateName}
                key={template?.id || 'new'}
              />
            </div>
          ) : (
            <div className='h-full flex items-center justify-center'>
              <div className='text-center space-y-6 animate-fade-in'>
                <div className='relative'>
                  <div className='h-16 w-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto'></div>
                  <div
                    className='absolute inset-0 h-16 w-16 border-4 border-transparent border-t-primary/40 rounded-full animate-spin mx-auto'
                    style={{
                      animationDirection: 'reverse',
                      animationDuration: '1.5s',
                    }}
                  ></div>
                </div>
                <div>
                  <h3 className='text-lg font-semibold text-foreground mb-2'>
                    Loading Email Editor
                  </h3>
                  <p className='text-muted-foreground'>
                    Preparing your creative workspace...
                  </p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
