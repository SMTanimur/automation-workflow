import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Plus, Search, Trash2, FileText, Calendar, Sparkles, Grid3X3, List } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface Template {
  id: string;
  name: string;
  category: string;
  createdAt: string;
  design?: any;
}

interface TemplateLibraryProps {
  onSelectTemplate: (templateId: string) => void;
  templates?: Template[];
  onDeleteTemplate?: (templateId: string) => void;
  onCreateNewTemplate?: () => void;
}

export const TemplateLibrary = ({ 
  onSelectTemplate,
  templates = [],
  onDeleteTemplate,
  onCreateNewTemplate
}: TemplateLibraryProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const isMobile = useIsMobile();

  const filteredTemplates = templates.filter(template =>
    template.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectTemplate = (template: Template) => {
    onSelectTemplate(template.id);
    setIsOpen(false);
    toast.success(`Loaded template: ${template.name}`, {
      description: "Your template is ready to edit"
    });
  };

  const handleNewTemplate = () => {
    onCreateNewTemplate?.();
    setIsOpen(false);
    toast.info("Started new template", {
      description: "Create your masterpiece from scratch"
    });
  };

  const handleDeleteTemplate = (id: string, templateName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onDeleteTemplate?.(id);
    toast.success(`Deleted "${templateName}"`, {
      description: "Template removed successfully"
    });
  };

  const TemplateGrid = () => (
    <div className={cn(
      "gap-4 max-h-[50vh] overflow-y-auto",
      viewMode === 'grid' 
        ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" 
        : "flex flex-col space-y-3"
    )}>
      {filteredTemplates.map((template, index) => (
        <Card 
          key={template.id}
          className={cn(
            "group cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 border-2 hover:border-primary/20 animate-fade-in",
            viewMode === 'list' ? "p-4" : "p-4"
          )}
          style={{ animationDelay: `${index * 50}ms` }}
          onClick={() => handleSelectTemplate(template)}
        >
          <div className={cn(
            "space-y-3",
            viewMode === 'list' && "flex items-center gap-4 space-y-0"
          )}>
            {viewMode === 'grid' && (
              <div className="h-24 bg-gradient-secondary rounded-lg border-2 border-dashed border-border/50 flex items-center justify-center group-hover:border-primary/30 transition-colors">
                <div className="text-center">
                  <Sparkles className="h-6 w-6 mx-auto text-primary/50 mb-1" />
                  <div className="text-xs text-muted-foreground">Email Preview</div>
                </div>
              </div>
            )}
            
            <div className={cn(
              "flex items-start justify-between",
              viewMode === 'list' && "flex-1"
            )}>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm truncate group-hover:text-primary transition-colors">
                  {template.name}
                </h3>
                <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {template.updatedAt.toLocaleDateString()}
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => handleDeleteTemplate(template.id, template.name, e)}
                className="opacity-0 group-hover:opacity-100 transition-all duration-200 p-1 h-auto hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            
            <Badge variant="secondary" className="text-xs w-fit">
              <FileText className="h-3 w-3 mr-1" />
              Email Template
            </Badge>
          </div>
        </Card>
      ))}
      
      {filteredTemplates.length === 0 && (
        <div className="col-span-full text-center py-12 animate-fade-in">
          <Sparkles className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-semibold text-muted-foreground mb-2">
            {searchQuery ? "No templates found" : "No templates yet"}
          </h3>
          <p className="text-sm text-muted-foreground">
            {searchQuery 
              ? "Try adjusting your search terms" 
              : "Create your first stunning email template!"
            }
          </p>
        </div>
      )}
    </div>
  );

  const Content = () => (
    <div className="space-y-6">
      {/* Search and Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-muted/50 border-0 focus:bg-background transition-colors"
          />
        </div>
        
        <div className="flex gap-2">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-muted/50 rounded-lg p-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode('grid')}
              className={cn(
                "p-2 transition-all",
                viewMode === 'grid' ? "bg-background shadow-sm" : ""
              )}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode('list')}
              className={cn(
                "p-2 transition-all",
                viewMode === 'list' ? "bg-background shadow-sm" : ""
              )}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
          
          <Button 
            onClick={handleNewTemplate} 
            variant="gradient"
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">New Template</span>
          </Button>
        </div>
      </div>

      <TemplateGrid />
    </div>
  );

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" className="gap-2 hover:bg-email-builder-accent-light transition-colors">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Templates</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="h-[85vh] animate-slide-up">
          <SheetHeader className="pb-6">
            <SheetTitle className="flex items-center gap-2 text-left">
              <div className="p-2 rounded-lg bg-gradient-primary">
                <FileText className="h-4 w-4 text-primary-foreground" />
              </div>
              Email Template Library
            </SheetTitle>
          </SheetHeader>
          <Content />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 hover:bg-email-builder-accent-light transition-colors">
          <FileText className="h-4 w-4" />
          <span className="hidden sm:inline">Templates</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl max-h-[85vh] overflow-hidden animate-scale-in">
        <DialogHeader className="pb-6">
          <DialogTitle className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-primary">
              <FileText className="h-5 w-5 text-primary-foreground" />
            </div>
            Email Template Library
          </DialogTitle>
        </DialogHeader>
        <Content />
      </DialogContent>
    </Dialog>
  );
};