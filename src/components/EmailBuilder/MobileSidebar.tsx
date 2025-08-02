import { TemplateLibrary } from "./TemplateLibrary";
import { X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (templateId: string) => void;
  templates?: any[];
  onDeleteTemplate?: (templateId: string) => void;
  onCreateNewTemplate?: () => void;
}

export const MobileSidebar = ({ 
  isOpen, 
  onClose, 
  onSelectTemplate,
  templates,
  onDeleteTemplate,
  onCreateNewTemplate
}: MobileSidebarProps) => {
  return (
    <aside className={cn(
      "fixed left-0 top-0 h-full w-80 bg-email-builder-sidebar/95 backdrop-blur-md border-r border-border/50 z-50 transition-transform duration-300 ease-out lg:hidden",
      isOpen ? "translate-x-0 animate-slide-in-left" : "-translate-x-full"
    )}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-primary">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>
            <h2 className="font-semibold text-foreground">Email Tools</h2>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClose}
            className="p-2 hover:bg-email-builder-accent-light transition-colors"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 space-y-4">
          <div className="w-full">
            <TemplateLibrary 
              onSelectTemplate={onSelectTemplate}
              templates={templates}
              onDeleteTemplate={onDeleteTemplate}
              onCreateNewTemplate={onCreateNewTemplate}
            />
          </div>
          
          {/* Quick Actions */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground">Quick Actions</h3>
            <div className="space-y-2">
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-3 hover:bg-email-builder-accent-light transition-colors"
                size="sm"
              >
                <div className="p-1 rounded bg-primary/10">
                  <Sparkles className="h-3 w-3 text-primary" />
                </div>
                AI Assistant (Coming Soon)
              </Button>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};