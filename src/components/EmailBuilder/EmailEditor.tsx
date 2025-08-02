import { useRef, useEffect } from 'react';
import EmailEditor, { EditorRef, EmailEditorProps } from 'react-email-editor';

interface EmailEditorComponentProps {
  onLoad?: () => void;
  onDesignLoad?: (data: any) => void;
  onSave?: (data: { design: any; html: string }) => void;
  initialDesign?: any;
  templateName?: string;
}

export const EmailEditorComponent = ({
  onLoad,
  onDesignLoad,
  onSave,
  initialDesign,
  templateName = 'email-template',
}: EmailEditorComponentProps) => {
  const emailEditorRef = useRef<EditorRef>(null);

  const saveDesign = () => {
    const unlayer = emailEditorRef.current?.editor;

    unlayer?.saveDesign((design: any) => {
      unlayer.exportHtml((data: any) => {
        const { html } = data;
        onSave?.({ design, html });
      });
    });
  };

  const exportHtml = () => {
    const unlayer = emailEditorRef.current?.editor;

    unlayer?.exportHtml((data: any) => {
      const { html } = data;

      // Create and download HTML file
      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${templateName}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    });
  };

  const previewTemplate = () => {
    const unlayer = emailEditorRef.current?.editor;

    unlayer?.exportHtml((data: any) => {
      const { html } = data;

      // Open preview in new window
      const previewWindow = window.open('', '_blank');
      if (previewWindow) {
        previewWindow.document.write(html);
        previewWindow.document.close();
      }
    });
  };

  const onReady = () => {
    const unlayer = emailEditorRef.current?.editor;

    // Load existing design if available
    if (initialDesign) {
      unlayer?.loadDesign(initialDesign);
    }

    onLoad?.();
  };

  // Expose methods to parent component
  useEffect(() => {
    (window as any).emailEditorActions = {
      saveDesign,
      exportHtml,
      previewTemplate,
    };
  }, []);

  const editorConfig: EmailEditorProps = {
    options: {
      features: {
        preview: true,
        imageEditor: true,
        stockImages: true,
        undoRedo: true,
      },
      appearance: {
        theme: 'modern_light',
        panels: {
          tools: {
            dock: 'left',
          },
        },
      },
      locale: 'en-US',
    },
  };

  return (
    <div className='h-full w-full'>
      <EmailEditor ref={emailEditorRef} onLoad={onReady} {...editorConfig} />
    </div>
  );
};
