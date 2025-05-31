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
  isCreating?: boolean
  isDeleting?: boolean
  isLoading?: boolean
}

export function TemplateManagementControls({
  templates,
  selectedTemplateId,
  onTemplateSelect,
  onNewTemplate,
  onEditTemplate,
  onDeleteTemplate,
  isCreating = false,
  isDeleting = false,
  isLoading = false
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
        <Select value={selectedTemplateId} onValueChange={onTemplateSelect} disabled={isLoading}>
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
        loading={isCreating}
        disabled={isLoading}
      >
        <Plus className="h-4 w-4 mr-2" />
        {isCreating ? 'Creating...' : 'New Template'}
      </Button>

      <div className="grid grid-cols-2 gap-3">
        <Button 
          onClick={onEditTemplate}
          variant="outline"
          className="w-full"
          disabled={!selectedTemplateId || isLoading}
        >
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </Button>
        
        <Button 
          onClick={onDeleteTemplate}
          variant="outline"
          className="w-full border-red-600 text-red-600 hover:text-red-900 dark:text-red-100 bg-red-600/10 hover:bg-red-600/20 dark:bg-red-500/20 dark:hover:bg-red-500/30"
          disabled={!selectedTemplateId || isLoading}
          loading={isDeleting}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          {isDeleting ? 'Deleting...' : 'Delete Template'}
        </Button>
      </div>
    </div>
  )
} 