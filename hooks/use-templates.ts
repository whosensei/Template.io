"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { v4 as uuidv4 } from "@/lib/utils/uuid"

export interface Template {
  id: string
  name: string
  content: string
  variables: Record<string, string>
}

const LOCAL_STORAGE_KEY = "email-templates"

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

export function useTemplates() {
  const [templates, setTemplates] = useState<Template[]>([])
  const { toast } = useToast()

  // Load templates from localStorage on component mount
  useEffect(() => {
    const storedTemplates = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (storedTemplates) {
      try {
        setTemplates(JSON.parse(storedTemplates))
      } catch (error) {
        console.error("Failed to parse stored templates:", error)
      }
    }
  }, [])

  // Save templates to localStorage when they change
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(templates))
  }, [templates])

  const saveTemplate = (
    name: string,
    content: string,
    variables: Record<string, string>
  ) => {
    // Check if we already have 10 templates
    if (templates.length >= 10 && !templates.some((t) => t.name === name)) {
      toast({
        title: "Limit Reached",
        description:
          "You can only save up to 10 templates. Please delete some templates before adding more.",
        variant: "destructive",
      })
      return
    }

    // Check if template with this name already exists
    const existingIndex = templates.findIndex((t) => t.name === name)

    if (existingIndex >= 0) {
      // Update existing template
      const updatedTemplates = [...templates]
      updatedTemplates[existingIndex] = {
        id: templates[existingIndex].id,
        name,
        content,
        variables,
      }
      setTemplates(updatedTemplates)
    } else {
      // Add new template
      setTemplates([
        ...templates,
        {
          id: uuidv4(),
          name,
          content,
          variables,
        },
      ])
    }
  }

  const loadTemplate = (id: string) => {
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
  }

  const deleteTemplate = (id: string) => {
    setTemplates(templates.filter((t) => t.id !== id))
    toast({
      title: "Template Deleted",
      description: "The template has been removed successfully.",
    })
  }

  return {
    templates,
    saveTemplate,
    loadTemplate,
    deleteTemplate,
    parseTemplateContent
  }
} 