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
    <div className="h-[calc(100vh-120px)] px-1">
      {/* Card Container */}
      <div className="h-full border border-gray-200 dark:border-zinc-700 rounded-lg bg-white dark:bg-black shadow-sm">
        <div className="h-full grid grid-cols-1 lg:grid-cols-5 gap-8 p-6">
          {/* Left Sidebar - Controls */}
          <div className="lg:col-span-2 flex flex-col gap-6 min-h-0 pl-1">
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
            <div className="flex-1 min-h-0">
              <div className="h-full overflow-y-auto custom-scrollbar pr-3">
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
          </div>
          
          {/* Right Content - Preview */}
          <div className="lg:col-span-3 min-h-0">
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
      </div>
    </div>
  )
} 