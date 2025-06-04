"use client"

import { useState } from "react"
import { TemplateEditor } from "@/components/editor/template-editor"
import { Button } from "@/components/ui/button"
import { RefreshCw, AlertTriangle } from "lucide-react"
import { useTemplates } from "@/hooks/use-templates"

// Skeleton component for loading state
function TemplateSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="space-y-6">
        {/* Header skeleton */}
        <div className="border-b border-gray-200 dark:border-zinc-700 pb-4">
          <div className="h-8 bg-gray-200 dark:bg-zinc-700 rounded w-64 mb-2"></div>
          <div className="h-4 bg-gray-100 dark:bg-zinc-800 rounded w-96"></div>
        </div>
        
        {/* Content skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Template selection */}
            <div className="space-y-3">
              <div className="h-5 bg-gray-200 dark:bg-zinc-700 rounded w-24"></div>
              <div className="h-10 bg-gray-100 dark:bg-zinc-800 rounded"></div>
            </div>
            
            {/* Actions */}
            <div className="space-y-3">
              <div className="h-10 bg-gray-200 dark:bg-zinc-700 rounded"></div>
              <div className="flex gap-2">
                <div className="h-9 bg-gray-100 dark:bg-zinc-800 rounded flex-1"></div>
                <div className="h-9 bg-gray-100 dark:bg-zinc-800 rounded flex-1"></div>
              </div>
            </div>
            
            {/* Variables */}
            <div className="space-y-4">
              <div className="h-5 bg-gray-200 dark:bg-zinc-700 rounded w-20"></div>
              {[1,2,3].map(i => (
                <div key={i} className="flex gap-3">
                  <div className="h-9 bg-gray-100 dark:bg-zinc-800 rounded w-24"></div>
                  <div className="h-9 bg-gray-100 dark:bg-zinc-800 rounded flex-1"></div>
                  <div className="h-9 w-9 bg-gray-100 dark:bg-zinc-800 rounded"></div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="lg:col-span-3">
            <div className="h-96 bg-gray-100 dark:bg-zinc-800 rounded-lg"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Error state component
function ErrorState({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <div className="text-center py-12">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-full mb-4">
        <AlertTriangle className="w-8 h-8 text-red-500 dark:text-red-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Something went wrong</h3>
      <p className="text-gray-600 dark:text-zinc-400 mb-6 max-w-md mx-auto">
        {error}
      </p>
      <Button onClick={onRetry} variant="outline">
        <RefreshCw className="w-4 h-4 mr-2" />
        Try again
      </Button>
    </div>
  )
}

// Default email template
const DEFAULT_TEMPLATE = `Dear {{recipientTitle}},

I hope this email finds you well. I am writing to express my interest in the {{jobRole}} position at {{companyName}}.

With my experience in this field, I believe I would be a valuable addition to your team. I am particularly drawn to {{companyName}} because of its reputation for innovation and excellence.

I have attached my resume for your review. I would welcome the opportunity to discuss how my skills align with your requirements further.

Thank you for considering my application. I look forward to the possibility of working with {{companyName}}.

Best regards,
[Your Name]`

export function TemplateManagerContainer() {
  const { 
    templates, 
    loading, 
    error,
    saveTemplate, 
    updateTemplate,
    loadTemplate, 
    deleteTemplate,
    refetch
  } = useTemplates()
  
  const [currentTemplate, setCurrentTemplate] = useState(DEFAULT_TEMPLATE)
  const [currentSubject, setCurrentSubject] = useState('Application for {{jobRole}} Position')
  const [currentVariables, setCurrentVariables] = useState<Record<string, string>>({
    recipientTitle: "Sir/Madam",
    jobRole: "Software Developer",
    companyName: "Acme Corporation",
  })

  const handleSaveTemplate = (
    name: string,
    content: string,
    variables: Record<string, string>
  ) => {
    // Parse the saved content to extract subject and template
    const lines = content.split('\n')
    let subject = 'Application for {{jobRole}} Position' // default
    let template = content
    
    // Check if content starts with "Subject: "
    if (lines[0] && lines[0].startsWith('Subject: ')) {
      subject = lines[0].substring(9) // Remove "Subject: " prefix
      template = lines.slice(2).join('\n') // Skip subject line and empty line
    }
    
    // Update current state to reflect the saved template
    setCurrentTemplate(template)
    setCurrentSubject(subject)
    setCurrentVariables(variables)
    
    return saveTemplate(name, content, variables)
  }

  const handleUpdateTemplate = (
    id: string,
    name: string,
    content: string,
    variables: Record<string, string>
  ) => {
    // Parse the updated content to extract subject and template
    const lines = content.split('\n')
    let subject = 'Application for {{jobRole}} Position' // default
    let template = content
    
    // Check if content starts with "Subject: "
    if (lines[0] && lines[0].startsWith('Subject: ')) {
      subject = lines[0].substring(9) // Remove "Subject: " prefix
      template = lines.slice(2).join('\n') // Skip subject line and empty line
    }
    
    // Update current state to reflect the updated template
    setCurrentTemplate(template)
    setCurrentSubject(subject)
    setCurrentVariables(variables)
    
    return updateTemplate(id, name, content, variables)
  }

  const handleLoadTemplate = (id: string) => {
    const templateData = loadTemplate(id)
    if (templateData) {
      setCurrentTemplate(templateData.template)
      setCurrentSubject(templateData.subject)
      setCurrentVariables(templateData.variables)
    }
  }

  const handleDeleteTemplate = (id: string) => {
    deleteTemplate(id)
  }

  // Show error state
  if (error && !loading && templates.length === 0) {
    return <ErrorState error={error} onRetry={refetch} />
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Show skeleton only during initial load without cached data */}
        {loading && templates.length === 0 ? (
          <TemplateSkeleton />
        ) : (
          <TemplateEditor
            initialTemplate={currentTemplate}
            initialSubject={currentSubject}
            initialVariables={currentVariables}
            onSave={handleSaveTemplate}
            onUpdate={handleUpdateTemplate}
            templates={templates.map(t => ({ id: t.id, name: t.name }))}
            onLoadTemplate={handleLoadTemplate}
            onDeleteTemplate={handleDeleteTemplate}
          />
        )}
      </div>
    </div>
  )
} 