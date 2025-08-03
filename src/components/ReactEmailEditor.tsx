import { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import EmailEditor, { EditorRef, EmailEditorProps } from 'react-email-editor';

interface ReactEmailEditorProps {
  onSave?: (data: { design: any; html: string }) => void;
  onLoad?: () => void;
  initialDesign?: any;
  height?: string;
  options?: EmailEditorProps['options'];
}

export interface ReactEmailEditorRef {
  editor: any;
  saveDesign: () => Promise<{ design: any; html: string }>;
  autoSave: () => Promise<{ design: any; html: string }>;
  exportHtml: () => Promise<string>;
  loadDesign: (design: any) => void;
}

const ReactEmailEditor = forwardRef<ReactEmailEditorRef, ReactEmailEditorProps>(
  ({ onSave, onLoad, initialDesign, height = '100%', options }, ref) => {
    const emailEditorRef = useRef<EditorRef>(null);

    useImperativeHandle(ref, () => ({
      get editor() {
        return emailEditorRef.current?.editor;
      },
      saveDesign: () => {
        return new Promise(resolve => {
          const unlayer = emailEditorRef.current?.editor;
          if (unlayer) {
            unlayer.saveDesign((design: any) => {
              unlayer.exportHtml((data: any) => {
                const result = { design, html: data.html };
                console.log('saveDesign result:', result);
                resolve(result);
              });
            });
          }
        });
      },
      autoSave: () => {
        return new Promise(resolve => {
          const unlayer = emailEditorRef.current?.editor;
          if (unlayer) {
            unlayer.saveDesign((design: any) => {
              unlayer.exportHtml((data: any) => {
                const result = { design, html: data.html };
                console.log('autoSave result:', result);
                onSave?.(result);
                resolve(result);
              });
            });
          }
        });
      },
      exportHtml: () => {
        return new Promise(resolve => {
          const unlayer = emailEditorRef.current?.editor;
          if (unlayer) {
            unlayer.exportHtml((data: any) => {
              resolve(data.html);
            });
          }
        });
      },
      loadDesign: (design: any) => {
        const unlayer = emailEditorRef.current?.editor;
        if (unlayer) {
          unlayer.loadDesign(design);
        }
      },
    }));

    const onReady = () => {
      const unlayer = emailEditorRef.current?.editor;

      // Load existing design if available
      if (initialDesign) {
        console.log('Loading initial design:', initialDesign);
        unlayer?.loadDesign(initialDesign);
      } else {
        console.log('No initial design provided');
      }

      onLoad?.();
    };

    const defaultOptions: EmailEditorProps['options'] = {
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
      ...options,
    };

    return (
      <div style={{ height }} className='w-full'>
        <EmailEditor
          ref={emailEditorRef}
          onLoad={onReady}
          options={defaultOptions}
        />
      </div>
    );
  }
);

ReactEmailEditor.displayName = 'ReactEmailEditor';

export default ReactEmailEditor;
