"use client"

import { useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Save } from "lucide-react"
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { TextEditor } from "./text-editor"
import { VariableForm } from "./variable-form"
import { extractVariables } from "@/lib/utils/template"

interface TemplateEditDialogProps {
  isOpen: boolean
  onClose: () => void
  isNewTemplate: boolean
  templateName: string
  onTemplateNameChange: (name: string) => void
  subject: string
  onSubjectChange: (subject: string) => void
  template: string
  onTemplateChange: (template: string) => void
  variables: Record<string, string>
  onVariableChange: (name: string, value: string) => void
  onAddVariable: (name: string) => void
  onRemoveVariable: (name: string) => void
  onSave: () => void
  isSaving?: boolean
}

export function TemplateEditDialog({
  isOpen,
  onClose,
  isNewTemplate,
  templateName,
  onTemplateNameChange,
  subject,
  onSubjectChange,
  template,
  onTemplateChange,
  variables,
  onVariableChange,
  onAddVariable,
  onRemoveVariable,
  onSave,
  isSaving = false
}: TemplateEditDialogProps) {
  const subjectInputRef = useRef<HTMLInputElement>(null)

  const insertVariableIntoSubject = (variable: string) => {
    if (subjectInputRef.current) {
      const start = subjectInputRef.current.selectionStart || 0
      const end = subjectInputRef.current.selectionEnd || 0
      const newValue = subject.substring(0, start) + `{{${variable}}}` + subject.substring(end)
      onSubjectChange(newValue)
      
      // Set cursor position after the inserted variable
      setTimeout(() => {
        if (subjectInputRef.current) {
          const newCursorPos = start + variable.length + 4 // 4 for {{ and }}
          subjectInputRef.current.focus()
          subjectInputRef.current.setSelectionRange(newCursorPos, newCursorPos)
        }
      }, 0)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isNewTemplate ? 'Create New Template' : 'Edit Template'}
          </DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="template-name">Template Name</Label>
              <Input
                id="template-name"
                value={templateName}
                onChange={(e) => onTemplateNameChange(e.target.value)}
                placeholder="e.g., Job Application Follow-up"
                className="w-full"
                disabled={isSaving}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="editing-subject">Email Subject</Label>
              <Input
                ref={subjectInputRef}
                id="editing-subject"
                value={subject}
                onChange={(e) => onSubjectChange(e.target.value)}
                placeholder="Enter email subject line..."
                className="w-full"
                disabled={isSaving}
              />
              {Object.keys(variables).length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Insert variables:</p>
                  <div className="flex flex-wrap gap-2">
                    {Object.keys(variables).map((variable) => (
                      <Button
                        key={variable}
                        variant="outline"
                        size="sm"
                        onClick={() => insertVariableIntoSubject(variable)}
                        className="h-8 text-xs"
                        disabled={isSaving}
                      >
                        {variable}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <VariableForm
              variables={variables}
              onVariableChange={onVariableChange}
              onAddVariable={onAddVariable}
              onRemoveVariable={onRemoveVariable}
              disabled={isSaving}
            />
            
            <div className="flex justify-end">
              <Button 
                onClick={onSave} 
                className="flex items-center gap-2"
                loading={isSaving}
              >
                <Save className="h-4 w-4" />
                {isSaving ? 'Saving...' : 'Save Template'}
              </Button>
            </div>
          </div>
          
          <div className="min-h-[400px]">
            <TextEditor
              value={template}
              onChange={onTemplateChange}
              variables={Object.keys(variables)}
              maxLength={5000}
              disabled={isSaving}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 