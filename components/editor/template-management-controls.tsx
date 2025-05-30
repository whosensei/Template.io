"use client"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Plus, Edit, Trash2 } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface TemplateManagementControlsProps {
  templates: Array<{ id: string, name: string }>
  selectedTemplateId: string
  onTemplateSelect: (templateId: string) => void
  onNewTemplate: () => void
  onEditTemplate: () => void
  onDeleteTemplate: () => void
}

export function TemplateManagementControls({
  templates,
  selectedTemplateId,
  onTemplateSelect,
  onNewTemplate,
  onEditTemplate,
  onDeleteTemplate
}: TemplateManagementControlsProps) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Templates</h2>
        <ThemeToggle />
      </div>
      
      <div>
        <Label htmlFor="template-select" className="text-sm font-medium mb-2 block">
          Select Template
        </Label>
        <Select value={selectedTemplateId} onValueChange={onTemplateSelect}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Choose a template..." />
          </SelectTrigger>
          <SelectContent>
            {templates.map((template) => (
              <SelectItem key={template.id} value={template.id}>
                {template.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button 
        onClick={onNewTemplate}
        className="w-full bg-white text-black hover:bg-gray-100 border border-gray-300"
      >
        <Plus className="h-4 w-4 mr-2" />
        New Template
      </Button>

      <div className="grid grid-cols-2 gap-3">
        <Button 
          onClick={onEditTemplate}
          variant="outline"
          className="w-full"
          disabled={!selectedTemplateId}
        >
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </Button>
        
        <Button 
          onClick={onDeleteTemplate}
          variant="outline"
          className="w-full border-red-600 text-red-600 hover:bg-red-50"
          disabled={!selectedTemplateId}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete Template
        </Button>
      </div>
    </div>
  )
} 