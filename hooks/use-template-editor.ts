"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { extractVariables } from "@/lib/utils/template"

interface UseTemplateEditorProps {
  initialTemplate?: string
  initialSubject?: string
  initialVariables?: Record<string, string>
  onSave?: (name: string, content: string, variables: Record<string, string>) => void
  templates?: Array<{ id: string, name: string }>
  onLoadTemplate?: (id: string) => void
  onDeleteTemplate?: (id: string) => void
}

export function useTemplateEditor({
  initialTemplate = '',
  initialSubject = '',
  initialVariables = {},
  onSave,
  templates = [],
  onLoadTemplate,
  onDeleteTemplate
}: UseTemplateEditorProps) {
  const [template, setTemplate] = useState(initialTemplate)
  const [variables, setVariables] = useState<Record<string, string>>(initialVariables)
  const [subject, setSubject] = useState(initialSubject)
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('')
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState('')
  const [editingVariables, setEditingVariables] = useState<Record<string, string>>({})
  const [editingSubject, setEditingSubject] = useState('')
  const [editingTemplateName, setEditingTemplateName] = useState('')
  const [isNewTemplate, setIsNewTemplate] = useState(false)
  
  const { toast } = useToast()
  
  // Update variables when template or subject changes
  useEffect(() => {
    const templateVars = extractVariables(template)
    const subjectVars = extractVariables(subject)
    const allVars = [...new Set([...templateVars, ...subjectVars])]
    const newVariables = { ...variables }
    
    // Add any new variables found in the template or subject
    allVars.forEach(varName => {
      if (!(varName in newVariables)) {
        newVariables[varName] = ''
      }
    })
    
    setVariables(newVariables)
  }, [template, subject])
  
  // Update when initialTemplate or initialVariables change
  useEffect(() => {
    setTemplate(initialTemplate)
    setSubject(initialSubject)
    setVariables(initialVariables)
  }, [initialTemplate, initialSubject, initialVariables])

  // Update editing variables when editing template or subject changes
  useEffect(() => {
    if (isEditDialogOpen) {
      const templateVars = extractVariables(editingTemplate)
      const subjectVars = extractVariables(editingSubject)
      const allVars = [...new Set([...templateVars, ...subjectVars])]
      const newVariables = { ...editingVariables }
      
      // Add any new variables found in the template or subject
      allVars.forEach(varName => {
        if (!(varName in newVariables)) {
          newVariables[varName] = ''
        }
      })
      
      setEditingVariables(newVariables)
    }
  }, [editingTemplate, editingSubject, isEditDialogOpen])

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplateId(templateId)
    if (onLoadTemplate) {
      onLoadTemplate(templateId)
    }
  }

  const handleNewTemplate = () => {
    setIsNewTemplate(true)
    setEditingTemplate('')
    setEditingSubject('')
    setEditingVariables({})
    setEditingTemplateName('')
    setIsEditDialogOpen(true)
  }

  const handleEditTemplate = () => {
    if (!selectedTemplateId) {
      toast({
        title: "No Template Selected",
        description: "Please select a template to edit",
        variant: "destructive"
      })
      return
    }
    
    const selectedTemplate = templates.find(t => t.id === selectedTemplateId)
    if (selectedTemplate) {
      setIsNewTemplate(false)
      setEditingTemplate(template)
      setEditingSubject(subject)
      setEditingVariables(variables)
      setEditingTemplateName(selectedTemplate.name)
      setIsEditDialogOpen(true)
    }
  }

  const handleDeleteTemplate = () => {
    if (!selectedTemplateId) {
      toast({
        title: "No Template Selected",
        description: "Please select a template to delete",
        variant: "destructive"
      })
      return
    }
    
    if (onDeleteTemplate) {
      onDeleteTemplate(selectedTemplateId)
      setSelectedTemplateId('')
    }
  }

  const handleSaveFromDialog = () => {
    if (!editingTemplateName.trim()) {
      toast({
        title: "Error",
        description: "Template name is required",
        variant: "destructive"
      })
      return
    }
    
    if (onSave) {
      // Save template with subject included in content
      const templateWithSubject = `Subject: ${editingSubject}\n\n${editingTemplate}`
      onSave(editingTemplateName, templateWithSubject, editingVariables)
      toast({
        title: "Success",
        description: "Template saved successfully"
      })
      setIsEditDialogOpen(false)
    }
  }

  const handleVariableChange = (name: string, value: string) => {
    setVariables(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleAddVariable = (name: string) => {
    setVariables(prev => ({
      ...prev,
      [name]: ''
    }))
  }

  const handleRemoveVariable = (name: string) => {
    const newVariables = { ...variables }
    delete newVariables[name]
    setVariables(newVariables)
  }

  const handleEditingVariableChange = (name: string, value: string) => {
    setEditingVariables(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleEditingAddVariable = (name: string) => {
    setEditingVariables(prev => ({
      ...prev,
      [name]: ''
    }))
  }

  const handleEditingRemoveVariable = (name: string) => {
    const newVariables = { ...editingVariables }
    delete newVariables[name]
    setEditingVariables(newVariables)
  }

  return {
    // Main template state
    template,
    setTemplate,
    subject,
    setSubject,
    variables,
    selectedTemplateId,
    
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
  }
} 