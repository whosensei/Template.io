"use client"

import { useRef, useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Save, X, Plus } from "lucide-react"
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { TextEditor } from "./text-editor"
import { VariableForm } from "./variable-form"
import { extractVariables } from "@/lib/utils/template"
import { Badge } from "@/components/ui/badge"

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
  const [showVariableInfo, setShowVariableInfo] = useState(true)
  const [newVarName, setNewVarName] = useState('')
  const [varError, setVarError] = useState('')

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

  const handleAddVariable = () => {
    const trimmedName = newVarName.trim()
    
    if (!trimmedName) {
      setVarError('Variable name cannot be empty')
      return
    }
    
    if (trimmedName in variables) {
      setVarError('Variable name already exists')
      return
    }
    
    // Valid variable name should only contain letters, numbers, and underscores
    if (!/^[a-zA-Z0-9_]+$/.test(trimmedName)) {
      setVarError('Variable name can only contain letters, numbers, and underscores')
      return
    }
    
    onAddVariable(trimmedName)
    setNewVarName('')
    setVarError('')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAddVariable()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col [&>button]:hidden">
        {/* Fixed Header with Save Button */}
        <DialogHeader className="flex-shrink-0 pb-4 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold">
              {isNewTemplate ? 'Create New Template' : 'Edit Template'}
            </DialogTitle>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onClose}
                disabled={isSaving}
                className="h-9"
              >
                <X className="h-4 w-4 mr-1" />
                Cancel
              </Button>
              <Button 
                onClick={onSave} 
                disabled={isSaving || !templateName.trim()}
                size="sm"
                className="h-9"
              >
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? 'Saving...' : (isNewTemplate ? 'Create Template' : 'Update Template')}
              </Button>
            </div>
          </div>
        </DialogHeader>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 p-6">
            {/* Left Column - Template Settings */}
            <div className="lg:col-span-2 space-y-6">
              {/* Template Name */}
              <div className="space-y-2">
                <Label htmlFor="template-name" className="text-sm font-medium">
                  Template Name
                </Label>
                <Input
                  id="template-name"
                  value={templateName}
                  onChange={(e) => onTemplateNameChange(e.target.value)}
                  placeholder="e.g., Job Application Follow-up"
                  className="w-full"
                  disabled={isSaving}
                />
              </div>

              {/* Email Subject */}
              <div className="space-y-3">
                <Label htmlFor="editing-subject" className="text-sm font-medium">
                  Email Subject
                </Label>
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
                    <p className="text-xs text-muted-foreground">Insert variables:</p>
                    <div className="flex flex-wrap gap-1">
                      {Object.keys(variables).map((variable) => (
                        <Button
                          key={variable}
                          variant="outline"
                          size="sm"
                          onClick={() => insertVariableIntoSubject(variable)}
                          className="h-7 px-2 text-xs"
                          disabled={isSaving}
                        >
                          {variable}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Variable Creation Info */}
              {showVariableInfo && (
                <div className="relative p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowVariableInfo(false)}
                    className="absolute top-2 right-2 h-6 w-6 p-0 hover:bg-blue-100 dark:hover:bg-blue-900/30"
                    title="Dismiss"
                  >
                    <X className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                  </Button>
                  <div className="flex items-start gap-2 pr-8">
                    <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-medium text-blue-600 dark:text-blue-400">i</span>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                        Creating Variables
                      </p>
                      <p className="text-xs text-blue-700 dark:text-blue-300">
                        Type <code className="px-1 py-0.5 bg-blue-100 dark:bg-blue-900/30 rounded text-xs font-mono">{'{{variableName}}'}</code> in your subject or template content directly to create variables. 
                        Or you can add variables by entering the name in the form below.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Variables Section */}
              <div className="space-y-3">
                <div className="text-sm font-medium text-muted-foreground">
                  Variables
                </div>
                
                {/* Add New Variable */}
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add variable name..."
                      className="flex-1 h-9 text-sm"
                      disabled={isSaving}
                      value={newVarName}
                      onChange={(e) => setNewVarName(e.target.value)}
                      onKeyDown={handleKeyDown}
                    />
                    <Button
                      type="button"
                      onClick={handleAddVariable}
                      disabled={isSaving}
                      size="sm"
                      className="h-9"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  {varError && (
                    <p className="text-xs text-red-600">{varError}</p>
                  )}
                </div>

                {/* Variables Display */}
                <div className="min-h-[60px] p-3 border-2 border-dashed border-muted rounded-lg">
                  {Object.keys(variables).length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {Object.keys(variables).map((name) => (
                        <Badge
                          key={name}
                          variant="secondary"
                          className="h-8 px-3 py-1 text-sm font-medium flex items-center gap-2 bg-muted/50 hover:bg-muted/70 transition-colors"
                        >
                          <span>{name}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => onRemoveVariable(name)}
                            className="h-4 w-4 p-0 ml-1 hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400 rounded-full"
                            title={`Remove ${name} variable`}
                            disabled={isSaving}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-2">
                      <p className="text-sm text-muted-foreground mb-1">No variables yet</p>
                      <p className="text-xs text-muted-foreground/60">Variables from your template will appear here</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Right Column - Template Editor */}
            <div className="lg:col-span-3 min-h-[550px] flex flex-col">
              <div className="flex-1">
                <TextEditor
                  value={template}
                  onChange={onTemplateChange}
                  variables={Object.keys(variables)}
                  maxLength={5000}
                  disabled={isSaving}
                  className="[&_textarea]:min-h-[400px] [&_textarea]:max-h-[500px]"
                />
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 