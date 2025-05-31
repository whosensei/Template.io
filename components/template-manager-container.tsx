"use client"

import { useState } from "react"
import { TemplateEditor } from "@/components/editor/template-editor"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RefreshCw, AlertCircle } from "lucide-react"
import { useTemplates } from "@/hooks/use-templates"

// Skeleton component for loading state
function TemplateSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {/* Header skeleton */}
      <div className="flex justify-between items-center">
        <div className="h-7 bg-muted rounded w-32"></div>
        <div className="h-9 w-9 bg-muted rounded"></div>
      </div>
      
      {/* Select skeleton */}
      <div className="space-y-2">
        <div className="h-4 bg-muted rounded w-24"></div>
        <div className="h-10 bg-muted rounded w-full"></div>
      </div>
      
      {/* Buttons skeleton */}
      <div className="space-y-3">
        <div className="h-10 bg-muted rounded w-full"></div>
        <div className="grid grid-cols-2 gap-3">
          <div className="h-10 bg-muted rounded"></div>
          <div className="h-10 bg-muted rounded"></div>
        </div>
      </div>
      
      {/* Variables skeleton */}
      <div className="space-y-3">
        <div className="h-6 bg-muted rounded w-32"></div>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="grid grid-cols-[120px_1fr_auto] gap-3">
            <div className="h-8 bg-muted rounded"></div>
            <div className="h-8 bg-muted rounded"></div>
            <div className="h-8 w-8 bg-muted rounded"></div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Error state component
function ErrorState({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-4">
      <div className="flex items-center gap-2 text-destructive">
        <AlertCircle className="h-5 w-5" />
        <h3 className="font-medium">Failed to load templates</h3>
      </div>
      <p className="text-sm text-muted-foreground text-center max-w-md">
        {error}
      </p>
      <Button onClick={onRetry} variant="outline" size="sm">
        <RefreshCw className="h-4 w-4 mr-2" />
        Try Again
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
    return (
      <Card>
        <CardContent className="p-6">
          <ErrorState error={error} onRetry={refetch} />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-6">
        {/* Show skeleton only during initial load without cached data */}
        {loading && templates.length === 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TemplateSkeleton />
            <div className="min-h-[600px] bg-muted/20 rounded-md animate-pulse"></div>
          </div>
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
      </CardContent>
    </Card>
  )
} 