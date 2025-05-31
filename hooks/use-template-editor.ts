"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { extractVariables } from "@/lib/utils/template"

interface UseTemplateEditorProps {
  initialTemplate?: string
  initialSubject?: string
  initialVariables?: Record<string, string>
  onSave?: (name: string, content: string, variables: Record<string, string>) => void
  onUpdate?: (id: string, name: string, content: string, variables: Record<string, string>) => void
  templates?: Array<{ id: string, name: string }>
  onLoadTemplate?: (id: string) => void
  onDeleteTemplate?: (id: string) => void
}

export function useTemplateEditor({
  initialTemplate = '',
  initialSubject = '',
  initialVariables = {},
  onSave,
  onUpdate,
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
  const [templateDefinedVariables, setTemplateDefinedVariables] = useState<Set<string>>(new Set())
  
  // Loading states
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  const { toast } = useToast()
  
  // Update variables when template or subject changes
  useEffect(() => {
    const templateVars = extractVariables(template)
    const subjectVars = extractVariables(subject)
    const allVars = Array.from(new Set([...Array.from(templateVars), ...Array.from(subjectVars)]))
    const newVariables = { ...variables }
    
    // Track which variables are template-defined
    const newTemplateDefinedVars = new Set<string>()
    
    // Add any new variables found in the template or subject
    allVars.forEach(varName => {
      newTemplateDefinedVars.add(varName)
      if (!(varName in newVariables)) {
        newVariables[varName] = ''
      }
    })
    
    setTemplateDefinedVariables(newTemplateDefinedVars)
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
      const allVars = Array.from(new Set([...Array.from(templateVars), ...Array.from(subjectVars)]))
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

  const handleTemplateSelect = async (templateId: string) => {
    setSelectedTemplateId(templateId)
    if (onLoadTemplate) {
      setIsLoading(true)
      try {
        await onLoadTemplate(templateId)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load template",
          variant: "destructive"
        })
      } finally {
        setIsLoading(false)
      }
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

  const handleDeleteTemplate = async () => {
    if (!selectedTemplateId) {
      toast({
        title: "No Template Selected",
        description: "Please select a template to delete",
        variant: "destructive"
      })
      return
    }
    
    if (onDeleteTemplate) {
      setIsDeleting(true)
      try {
        await onDeleteTemplate(selectedTemplateId)
        setSelectedTemplateId('')
        toast({
          title: "Success",
          description: "Template deleted successfully"
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete template",
          variant: "destructive"
        })
      } finally {
        setIsDeleting(false)
      }
    }
  }

  const handleSaveFromDialog = async () => {
    if (!editingTemplateName.trim()) {
      toast({
        title: "Error",
        description: "Template name is required",
        variant: "destructive"
      })
      return
    }
    
    setIsSaving(true)
    try {
      // Save template with subject included in content
      const templateWithSubject = `Subject: ${editingSubject}\n\n${editingTemplate}`
      
      if (isNewTemplate) {
        // Creating a new template
        if (onSave) {
          await onSave(editingTemplateName, templateWithSubject, editingVariables)
        }
      } else {
        // Updating an existing template
        if (onUpdate && selectedTemplateId) {
          await onUpdate(selectedTemplateId, editingTemplateName, templateWithSubject, editingVariables)
        } else if (onSave) {
          // Fallback to save if no update function provided
          await onSave(editingTemplateName, templateWithSubject, editingVariables)
        }
      }
      
      // Update the main template state immediately after saving
      setTemplate(editingTemplate)
      setSubject(editingSubject)
      setVariables(editingVariables)
      
      toast({
        title: "Success",
        description: `Template ${isNewTemplate ? 'created' : 'updated'} successfully`
      })
      setIsEditDialogOpen(false)
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${isNewTemplate ? 'create' : 'update'} template`,
        variant: "destructive"
      })
    } finally {
      setIsSaving(false)
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
  }
} 