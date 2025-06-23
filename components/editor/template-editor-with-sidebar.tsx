"use client"

import { useState, useEffect, useCallback } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { VariableForm } from "./variable-form"
import { TemplatePreview } from "./template-preview"
import { MailingSection } from "@/components/mailing-section"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useGmailConnections, useEmailSending } from "@/hooks/use-gmail"

interface TemplateEditorWithSidebarProps {
  // Template management
  templates: Array<{ id: string, name: string }>
  selectedTemplateId: string
  currentTemplateName?: string
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

export function TemplateEditorWithSidebar({
  templates,
  selectedTemplateId,
  currentTemplateName,
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
}: TemplateEditorWithSidebarProps) {
  const [highlightColor, setHighlightColor] = useState<string>('blue')
  const [emailData, setEmailData] = useState<{
    to: { email: string; name?: string }[]
    cc: { email: string; name?: string }[]
    bcc: { email: string; name?: string }[]
    from: string
    canSend: boolean
  }>({
    to: [],
    cc: [],
    bcc: [],
    from: '',
    canSend: false
  })
  
  const { connections, connecting, connectGmail } = useGmailConnections()
  const { sending, sendEmail } = useEmailSending()

  // Fetch user preferences for highlight color
  useEffect(() => {
    const fetchHighlightColor = async () => {
      try {
        const response = await fetch('/api/user/preferences')
        if (response.ok) {
          const data = await response.json()
          setHighlightColor(data.highlightColor || 'blue')
        }
      } catch (error) {
        console.error('Error fetching highlight color:', error)
      }
    }
    fetchHighlightColor()

    // Listen for highlight color changes
    const handleColorChange = (event: CustomEvent) => {
      setHighlightColor(event.detail.color)
    }

    window.addEventListener('highlightColorChanged', handleColorChange as EventListener)
    
    return () => {
      window.removeEventListener('highlightColorChanged', handleColorChange as EventListener)
    }
  }, [])

  const handleSendEmail = async (emailDataParam: {
    to: { email: string; name?: string }[]
    cc: { email: string; name?: string }[]
    bcc: { email: string; name?: string }[]
    from: string
  }) => {
    await sendEmail(
      emailDataParam,
      subject,
      template,
      variables,
      selectedTemplateId
    )
  }

  const handleEmailDataChange = useCallback((newEmailData: {
    to: { email: string; name?: string }[]
    cc: { email: string; name?: string }[]
    bcc: { email: string; name?: string }[]
    from: string
    canSend: boolean
  }) => {
    setEmailData(newEmailData)
  }, [])

  const handlePreviewSend = async () => {
    if (!emailData.canSend) {
      if (emailData.to.length === 0) {
        alert("Please add at least one recipient")
      } else if (!emailData.from) {
        alert("Please select a sender email")
      } else if (connections.length === 0) {
        alert("Please connect a Gmail account")
      }
      return
    }

    await sendEmail(
      emailData,
      subject,
      template,
      variables,
      selectedTemplateId
    )
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        {/* Sidebar */}
        <AppSidebar
          templates={templates}
          selectedTemplateId={selectedTemplateId}
          currentTemplateName={currentTemplateName}
          onTemplateSelect={onTemplateSelect}
          onNewTemplate={onNewTemplate}
          onEditTemplate={onEditTemplate}
          onDeleteTemplate={onDeleteTemplate}
          isDeleting={isDeleting}
          isLoading={isLoading}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-h-0 gap-2 sm:gap-4 p-2 sm:p-4">
          {/* Mobile Sidebar Trigger - At the top */}
          <div className="xl:hidden p-2 sm:p-4 border-b border rounded-lg bg-background">
            <SidebarTrigger />
          </div>

          {/* Content Area */}
          <div className="flex flex-col xl:flex-row min-h-0 gap-2 sm:gap-4 items-stretch flex-1">
            {/* Left Section - Variables and Mailing */}
            <div className="w-full xl:w-1/3 flex flex-col min-h-0 order-2 xl:order-1">
              {/* Single Card Container for Equal Heights */}
              <Card className="flex-1 min-h-0 flex flex-col">
              <CardContent className="flex-1 overflow-y-auto p-3 sm:p-6">
                <div className="space-y-6">
                  {/* Variables Section */}
                  <div>
                    <VariableForm
                      variables={variables}
                      onVariableChange={onVariableChange}
                      onAddVariable={onAddVariable}
                      onRemoveVariable={onRemoveVariable}
                      templateDefinedVariables={templateDefinedVariables}
                      disabled={isLoading}
                      className="border-0 shadow-none bg-transparent"
                    />
                  </div>

                  {/* Separator */}
                  <Separator />

                  {/* Mailing Section */}
                  <div>
                    <MailingSection
                      onSend={handleSendEmail}
                      gmailConnections={connections.map(conn => ({
                        id: conn.id,
                        email: conn.email,
                        isActive: conn.isActive
                      }))}
                      onConnectGmail={connectGmail}
                      isLoading={connecting}
                      isSending={sending}
                      onEmailDataChange={handleEmailDataChange}
                      className="border-0 shadow-none bg-transparent"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Section - Preview */}
          <div className="flex-1 min-h-0 flex flex-col order-1 xl:order-2 min-h-[400px] sm:min-h-[500px] xl:min-h-0">
            <TemplatePreview
              template={template}
              variables={variables}
              subject={subject}
              onTemplateChange={onTemplateChange}
              onSubjectChange={onSubjectChange}
              onSend={handlePreviewSend}
              isSaving={isSaving}
              isSending={sending}
              highlightColor={highlightColor}
              canSend={emailData.canSend}
              className="h-full flex flex-col"
            />
          </div>
        </div>
      </div>
      </div>
    </SidebarProvider>
  )
} 