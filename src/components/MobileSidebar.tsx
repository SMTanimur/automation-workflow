'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { 
  Type, 
  Image as ImageIcon, 
  Button as ButtonIcon, 
  Layout, 
  Columns, 
  Menu,
  X
} from 'lucide-react'

interface EmailElement {
  type: 'text' | 'image' | 'button' | 'divider' | 'spacer' | 'heading' | 'container'
  label: string
  icon: any
  color: string
}

interface MobileSidebarProps {
  elements: EmailElement[]
  onAddElement: (type: string) => void
  templateName: string
  onTemplateNameChange: (name: string) => void
}

export default function MobileSidebar({
  elements,
  onAddElement,
  templateName,
  onTemplateNameChange
}: MobileSidebarProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="md:hidden">
          <Menu className="w-4 h-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80 p-0">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="font-semibold">Email Builder</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Template Name */}
          <div className="p-4 border-b">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Template Name
            </label>
            <input
              type="text"
              value={templateName}
              onChange={(e) => onTemplateNameChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Untitled Template"
            />
          </div>

          {/* Elements */}
          <div className="flex-1 overflow-y-auto p-4">
            <h3 className="font-semibold text-gray-900 mb-4">Elements</h3>
            <div className="space-y-3">
              {elements.map((element) => (
                <button
                  key={element.type}
                  onClick={() => {
                    onAddElement(element.type)
                    setIsOpen(false)
                  }}
                  className="w-full p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className={`${element.color} p-2 rounded-lg`}>
                      <element.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-medium">{element.label}</div>
                      <div className="text-sm text-gray-500">Drag or click to add</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t bg-gray-50">
            <Badge variant="outline" className="w-full justify-center">
              Mobile View
            </Badge>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
