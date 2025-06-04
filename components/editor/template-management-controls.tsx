"use client"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Plus, Edit, Trash2 } from "lucide-react"
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
    <div className="space-y-6">
      {/* Header */}
      <h2 className="text-lg font-medium text-gray-900 dark:text-white">Templates</h2>
      
      {/* Template Selection */}
      <div className="space-y-2">
        <Label htmlFor="template-select" className="text-sm font-medium text-gray-700 dark:text-zinc-300">
          Select template
        </Label>
        <Select value={selectedTemplateId} onValueChange={onTemplateSelect} disabled={isLoading}>
          <SelectTrigger id="template-select" className="w-full">
            <SelectValue placeholder="Choose a template..." />
          </SelectTrigger>
          <SelectContent>
            {templates.map((template) => (
              <SelectItem key={template.id} value={template.id}>
                <span className="truncate" title={template.name}>
                  {template.name}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <Button 
          onClick={onNewTemplate}
          className="w-full"
          disabled={isLoading}
        >
          <Plus className="w-4 h-4 mr-2" />
          {isCreating ? 'Creating...' : 'New template'}
        </Button>

        <div className="flex gap-2">
          <Button 
            onClick={onEditTemplate}
            variant="outline"
            size="sm"
            className="flex-1"
            disabled={!selectedTemplateId || isLoading}
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          
          <Button 
            onClick={onDeleteTemplate}
            variant="outline"
            size="sm"
            className="flex-1 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20"
            disabled={!selectedTemplateId || isLoading}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </div>
    </div>
  )
} 