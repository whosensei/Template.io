"use client"

import { useState, useEffect } from "react"
import { TextEditor } from "./text-editor"
import { TemplatePreview } from "./template-preview"
import { VariableForm } from "./variable-form"
import { TemplateManagementControls } from "./template-management-controls"
import { EmailSubjectSection } from "./email-subject-section"

interface TemplateEditorLayoutProps {
  // Template management
  templates: Array<{ id: string, name: string }>
  selectedTemplateId: string
  onTemplateSelect: (templateId: string) => void
  onNewTemplate: () => void
  onEditTemplate: () => void
  onDeleteTemplate: () => void
  
  // Subject
  subject: string
  onSubjectChange: (subject: string) => void
  
  // Template
  template: string
  onTemplateChange: (template: string) => void
  
  // Variables
  variables: Record<string, string>
  onVariableChange: (name: string, value: string) => void
  onAddVariable: (name: string) => void
  onRemoveVariable: (name: string) => void
  onInsertVariable: (variable: string) => void
  templateDefinedVariables?: Set<string>
  
  // Loading states
  isSaving?: boolean
  isDeleting?: boolean
  isLoading?: boolean
}

export function TemplateEditorLayout({
  templates,
  selectedTemplateId,
  onTemplateSelect,
  onNewTemplate,
  onEditTemplate,
  onDeleteTemplate,
  subject,
  onSubjectChange,
  template,
  onTemplateChange,
  variables,
  onVariableChange,
  onAddVariable,
  onRemoveVariable,
  onInsertVariable,
  templateDefinedVariables,
  isSaving = false,
  isDeleting = false,
  isLoading = false
}: TemplateEditorLayoutProps) {
  const [highlightColor, setHighlightColor] = useState<string>('blue')

  // Fetch user preferences for highlight color
  useEffect(() => {
    const fetchHighlightColor = async () => {
      try {
        const response = await fetch('/api/user/preferences')
        if (response.ok) {
          const data = await response.json()
          setHighlightColor(data.highlightColor || 'blue')
        }
      } catch (error) {
        console.error('Error fetching highlight color:', error)
      }
    }
    fetchHighlightColor()

    // Listen for highlight color changes
    const handleColorChange = (event: CustomEvent) => {
      setHighlightColor(event.detail.color)
    }

    window.addEventListener('highlightColorChanged', handleColorChange as EventListener)
    
    return () => {
      window.removeEventListener('highlightColorChanged', handleColorChange as EventListener)
    }
  }, [])

  return (
    <div className="px-1">
      {/* Card Container */}
      <div className="border border-gray-200 dark:border-zinc-700 rounded-lg bg-white dark:bg-black shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 p-6 items-start">
          {/* Left Sidebar - Controls */}
          <div className="lg:col-span-2 flex flex-col gap-6 pl-1">
            {/* Template Management */}
            <div className="flex-shrink-0">
              <TemplateManagementControls
                templates={templates}
                selectedTemplateId={selectedTemplateId}
                onTemplateSelect={onTemplateSelect}
                onNewTemplate={onNewTemplate}
                onEditTemplate={onEditTemplate}
                onDeleteTemplate={onDeleteTemplate}
                isDeleting={isDeleting}
                isLoading={isLoading}
              />
            </div>

            {/* Variables */}
            <div>
              <VariableForm
                variables={variables}
                onVariableChange={onVariableChange}
                onAddVariable={onAddVariable}
                onRemoveVariable={onRemoveVariable}
                templateDefinedVariables={templateDefinedVariables}
                disabled={isLoading}
              />
            </div>
          </div>
          
          {/* Right Content - Preview */}
          <div className="lg:col-span-3">
            <TemplatePreview
              template={template}
              variables={variables}
              subject={subject}
              onTemplateChange={onTemplateChange}
              onSubjectChange={onSubjectChange}
              isSaving={isSaving}
              highlightColor={highlightColor}
            />
          </div>
        </div>
      </div>
    </div>
  )
} 