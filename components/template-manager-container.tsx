"use client"

import { useState } from "react"
import { TemplateEditor } from "@/components/editor/template-editor"
import { Card, CardContent } from "@/components/ui/card"
import { useTemplates } from "@/hooks/use-templates"

// Default email template
const DEFAULT_TEMPLATE = `Dear {{recipientTitle}},

I hope this email finds you well. I am writing to express my interest in the {{jobRole}} position at {{companyName}}.

With my experience in this field, I believe I would be a valuable addition to your team. I am particularly drawn to {{companyName}} because of its reputation for innovation and excellence.

I have attached my resume for your review. I would welcome the opportunity to discuss how my skills align with your requirements further.

Thank you for considering my application. I look forward to the possibility of working with {{companyName}}.

Best regards,
[Your Name]`

export function TemplateManagerContainer() {
  const { templates, saveTemplate, loadTemplate, deleteTemplate } = useTemplates()
  
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
    saveTemplate(name, content, variables)
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

  return (
    <Card>
      <CardContent className="p-6">
        <TemplateEditor
          initialTemplate={currentTemplate}
          initialSubject={currentSubject}
          initialVariables={currentVariables}
          onSave={handleSaveTemplate}
          templates={templates.map(t => ({ id: t.id, name: t.name }))}
          onLoadTemplate={handleLoadTemplate}
          onDeleteTemplate={handleDeleteTemplate}
        />
      </CardContent>
    </Card>
  )
} 