"use client"

import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { useToast } from "@/hooks/use-toast"

export interface Template {
  id: string
  name: string
  content: string
  variables: Record<string, string>
  createdAt?: string
  updatedAt?: string
}

// Utility function to deduplicate templates by ID
function deduplicateTemplates(templates: Template[]): Template[] {
  const seen = new Set<string>()
  const deduped: Template[] = []
  
  for (const template of templates) {
    if (!seen.has(template.id)) {
      seen.add(template.id)
      deduped.push(template)
    }
  }
  
  return deduped
}

// Helper function to parse template content with subject
const parseTemplateContent = (content: string) => {
  const subjectMatch = content.match(/^Subject: (.+)\n\n([\s\S]*)$/)
  if (subjectMatch) {
    return {
      subject: subjectMatch[1],
      template: subjectMatch[2]
    }
  }
  return {
    subject: '',
    template: content
  }
}

// Performance monitoring
const usePerformanceMonitor = () => {
  const logOperation = useCallback((operation: string, duration: number) => {
    if (duration > 1000) {
      console.warn(`Slow operation detected: ${operation} took ${duration}ms`)
    } else {
      console.log(`${operation} completed in ${duration}ms`)
    }
  }, [])
  
  return { logOperation }
}

export function useTemplates() {
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  // Simplified fetch without caching
  const fetchTemplates = useCallback(async () => {
    try {
      setLoading(true)
      
      const response = await fetch('/api/templates')
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      const data = await response.json()
      
      setTemplates(data)
      setError(null)
      
    } catch (error: any) {
      console.error('Error fetching templates:', error)
      setError(error.message || 'Failed to fetch templates')
      setTemplates([])
    } finally {
      setLoading(false)
    }
  }, [])

  // Simple useEffect for loading
  useEffect(() => {
    fetchTemplates()
  }, [fetchTemplates])

  // Rest of the functions remain the same but simplified...
  const saveTemplate = useCallback(async (
    name: string,
    content: string,
    variables: Record<string, string>
  ) => {
    try {
      const response = await fetch('/api/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, content, variables })
      })

      const data = await response.json()
      if (response.ok) {
        setTemplates(prev => [data, ...prev])
        toast({ title: "Template Saved", description: "Your template has been saved successfully." })
      } else {
        toast({ title: "Error", description: data.error || "Failed to save template", variant: "destructive" })
      }
    } catch (error) {
      console.error('Error saving template:', error)
      toast({ title: "Error", description: "Failed to save template", variant: "destructive" })
    }
  }, [toast])

  const updateTemplate = useCallback(async (
    id: string,
    name: string,
    content: string,
    variables: Record<string, string>
  ) => {
    try {
      const response = await fetch(`/api/templates/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, content, variables })
      })

      const data = await response.json()
      if (response.ok) {
        setTemplates(prev => prev.map(t => t.id === id ? data : t))
        toast({ title: "Template Updated", description: "Your template has been updated successfully." })
        return data
      } else {
        toast({ title: "Error", description: data.error || "Failed to update template", variant: "destructive" })
        throw new Error(data.error || "Failed to update template")
      }
    } catch (error) {
      console.error('Error updating template:', error)
      toast({ title: "Error", description: "Failed to update template", variant: "destructive" })
      throw error
    }
  }, [toast])

  const loadTemplate = useCallback((id: string) => {
    const template = templates.find((t) => t.id === id)
    if (template) {
      const parsed = parseTemplateContent(template.content)
      return {
        template: parsed.template,
        subject: parsed.subject,
        variables: template.variables
      }
    }
    return null
  }, [templates])

  const deleteTemplate = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/templates/${id}`, { method: 'DELETE' })
      if (response.ok) {
        setTemplates(prev => prev.filter(t => t.id !== id))
        toast({ title: "Template Deleted", description: "The template has been removed successfully." })
      } else {
        const data = await response.json()
        toast({ title: "Error", description: data.error || "Failed to delete template", variant: "destructive" })
      }
    } catch (error: any) {
      console.error('Error deleting template:', error)
      toast({ title: "Error", description: "Failed to delete template", variant: "destructive" })
    }
  }, [toast])

  const refetch = useCallback(async () => {
    await fetchTemplates()
  }, [fetchTemplates])

  return {
    templates,
    loading,
    error,
    backgroundRefreshing: false,
    saveTemplate,
    updateTemplate,
    loadTemplate,
    deleteTemplate,
    parseTemplateContent,
    refetch
  }
} 