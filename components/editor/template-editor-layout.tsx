"use client"

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
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="flex flex-col gap-4">
        {/* Template Management Controls */}
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

        {/* Variable Section */}
        <VariableForm
          variables={variables}
          onVariableChange={onVariableChange}
          onAddVariable={onAddVariable}
          onRemoveVariable={onRemoveVariable}
          templateDefinedVariables={templateDefinedVariables}
          disabled={isLoading}
        />
      
      </div>
      
      {/* Full Height Preview */}
      <div className="min-h-[600px]">
        <TemplatePreview
          template={template}
          variables={variables}
          subject={subject}
          onTemplateChange={onTemplateChange}
          onSubjectChange={onSubjectChange}
          isSaving={isSaving}
        />
      </div>
    </div>
  )
} 