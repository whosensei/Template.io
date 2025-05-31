"use client"

import React from 'react'
import { TemplateEditorLayout } from './template-editor-layout'
import { TemplateEditDialog } from './template-edit-dialog'
import { useTemplateEditor } from '@/hooks/use-template-editor'

interface TemplateEditorProps {
  initialTemplate?: string
  initialSubject?: string
  initialVariables?: Record<string, string>
  onSave?: (name: string, content: string, variables: Record<string, string>) => void
  onUpdate?: (id: string, name: string, content: string, variables: Record<string, string>) => void
  templates?: Array<{ id: string, name: string }>
  onLoadTemplate?: (id: string) => void
  onDeleteTemplate?: (id: string) => void
  className?: string
}

export function TemplateEditor({
  initialTemplate = '',
  initialSubject = '',
  initialVariables = {},
  onSave,
  onUpdate,
  templates = [],
  onLoadTemplate,
  onDeleteTemplate,
  className
}: TemplateEditorProps) {
  const {
    // Main template state
    template,
    setTemplate,
    subject,
    setSubject,
    variables,
    selectedTemplateId,
    templateDefinedVariables,
    
    // Loading states
    isSaving,
    isDeleting,
    isLoading,
    
    // Dialog state
    isEditDialogOpen,
    setIsEditDialogOpen,
    isNewTemplate,
    editingTemplate,
    setEditingTemplate,
    editingSubject,
    setEditingSubject,
    editingVariables,
    editingTemplateName,
    setEditingTemplateName,
    
    // Handlers
    handleTemplateSelect,
    handleNewTemplate,
    handleEditTemplate,
    handleDeleteTemplate,
    handleSaveFromDialog,
    handleVariableChange,
    handleAddVariable,
    handleRemoveVariable,
    handleEditingVariableChange,
    handleEditingAddVariable,
    handleEditingRemoveVariable
  } = useTemplateEditor({
    initialTemplate,
    initialSubject,
    initialVariables,
    onSave,
    onUpdate,
    templates,
    onLoadTemplate,
    onDeleteTemplate
  })

  // Dummy handler for insert variable (handled internally by EmailSubjectSection)
  const handleInsertVariable = () => {}

  return (
    <div className={className}>
      <TemplateEditorLayout
        templates={templates}
        selectedTemplateId={selectedTemplateId}
        onTemplateSelect={handleTemplateSelect}
        onNewTemplate={handleNewTemplate}
        onEditTemplate={handleEditTemplate}
        onDeleteTemplate={handleDeleteTemplate}
        subject={subject}
        onSubjectChange={setSubject}
        template={template}
        onTemplateChange={setTemplate}
        variables={variables}
        onVariableChange={handleVariableChange}
        onAddVariable={handleAddVariable}
        onRemoveVariable={handleRemoveVariable}
        onInsertVariable={handleInsertVariable}
        templateDefinedVariables={templateDefinedVariables}
        isSaving={isSaving}
        isDeleting={isDeleting}
        isLoading={isLoading}
      />

      <TemplateEditDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        isNewTemplate={isNewTemplate}
        templateName={editingTemplateName}
        onTemplateNameChange={setEditingTemplateName}
        subject={editingSubject}
        onSubjectChange={setEditingSubject}
        template={editingTemplate}
        onTemplateChange={setEditingTemplate}
        variables={editingVariables}
        onVariableChange={handleEditingVariableChange}
        onAddVariable={handleEditingAddVariable}
        onRemoveVariable={handleEditingRemoveVariable}
        onSave={handleSaveFromDialog}
        isSaving={isSaving}
      />
    </div>
  )
}