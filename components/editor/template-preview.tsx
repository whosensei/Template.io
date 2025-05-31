"use client"

import React, { useState, useRef, useEffect } from 'react'
import { replaceVariables } from '@/lib/utils/template'
import { Button } from '@/components/ui/button'
import { Copy, Check, Edit, Save, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Textarea } from '@/components/ui/textarea'

interface TemplatePreviewProps {
  template: string
  variables: Record<string, string>
  subject?: string
  className?: string
  onTemplateChange?: (newTemplate: string) => void
  onSubjectChange?: (newSubject: string) => void
  isSaving?: boolean
  isCopying?: boolean
}

export function TemplatePreview({ 
  template, 
  variables,
  subject = '',
  className,
  onTemplateChange,
  onSubjectChange,
  isSaving = false,
  isCopying = false
}: TemplatePreviewProps) {
  const [copied, setCopied] = useState(false)
  const [isEditingTemplate, setIsEditingTemplate] = useState(false)
  const [isEditingSubject, setIsEditingSubject] = useState(false)
  const [editedTemplate, setEditedTemplate] = useState('')
  const [editedSubject, setEditedSubject] = useState('')
  const templateTextareaRef = useRef<HTMLTextAreaElement>(null)
  const subjectTextareaRef = useRef<HTMLTextAreaElement>(null)
  
  const renderedTemplate = replaceVariables(template, variables)
  const renderedSubject = replaceVariables(subject, variables)
  
  useEffect(() => {
    if (isEditingTemplate) {
      setEditedTemplate(renderedTemplate)
    }
  }, [isEditingTemplate, renderedTemplate])
  
  useEffect(() => {
    if (isEditingSubject) {
      setEditedSubject(renderedSubject)
    }
  }, [isEditingSubject, renderedSubject])
  
  const handleCopy = async () => {
    const contentToCopy = isEditingTemplate ? editedTemplate : renderedTemplate
    const subjectToCopy = isEditingSubject ? editedSubject : renderedSubject
    const fullEmail = subject ? `Subject: ${subjectToCopy}\n\n${contentToCopy}` : contentToCopy
    await navigator.clipboard.writeText(fullEmail)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleEditTemplate = () => {
    setIsEditingTemplate(true)
    setEditedTemplate(renderedTemplate)
    setTimeout(() => {
      templateTextareaRef.current?.focus()
    }, 0)
  }

  const handleSaveTemplate = () => {
    if (onTemplateChange && editedTemplate !== renderedTemplate) {
      // Try to reverse the variable replacement to get back the template with variables
      let newTemplate = editedTemplate
      Object.entries(variables).forEach(([key, value]) => {
        if (value) {
          const regex = new RegExp(value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')
          newTemplate = newTemplate.replace(regex, `{{${key}}}`)
        }
      })
      onTemplateChange(newTemplate)
    }
    setIsEditingTemplate(false)
  }

  const handleCancelTemplateEdit = () => {
    setIsEditingTemplate(false)
    setEditedTemplate(renderedTemplate)
  }

  const handleEditSubject = () => {
    setIsEditingSubject(true)
    setEditedSubject(renderedSubject)
    setTimeout(() => {
      subjectTextareaRef.current?.focus()
    }, 0)
  }

  const handleSaveSubject = () => {
    if (onSubjectChange && editedSubject !== renderedSubject) {
      // Try to reverse the variable replacement to get back the subject with variables
      let newSubject = editedSubject
      Object.entries(variables).forEach(([key, value]) => {
        if (value) {
          const regex = new RegExp(value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')
          newSubject = newSubject.replace(regex, `{{${key}}}`)
        }
      })
      onSubjectChange(newSubject)
    }
    setIsEditingSubject(false)
  }

  const handleCancelSubjectEdit = () => {
    setIsEditingSubject(false)
    setEditedSubject(renderedSubject)
  }

  // Function to convert markdown-like syntax to HTML
  const formatText = (text: string) => {
    let formatted = text
      // Replace bold
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Replace italic
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // Replace h1
      .replace(/^# (.*?)$/gm, '<h1 class="text-2xl font-bold mt-4 mb-2">$1</h1>')
      // Replace h2
      .replace(/^## (.*?)$/gm, '<h2 class="text-xl font-bold mt-3 mb-2">$1</h2>')
      // Replace list items
      .replace(/^- (.*?)$/gm, '<li class="ml-4">$1</li>')
      // Replace paragraphs
      .replace(/(?:^|\n)(?!<h1|<h2|<li)(.*?)(?:\n|$)/g, (match, p1) => {
        if (p1.trim() === '') return match;
        return `<p class="mb-2">${p1}</p>`;
      });
    
    // Wrap lists in ul tags
    if (formatted.includes('<li')) {
      formatted = formatted.replace(/(<li.*?<\/li>)+/g, '<ul class="list-disc ml-4 mb-2">$&</ul>');
    }

    // Highlight variables that haven't been replaced
    formatted = formatted.replace(/{{(.*?)}}/g, '<span class="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">{{$1}}</span>');
    
    return formatted;
  };

  const canEdit = !!(onTemplateChange || onSubjectChange)

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Preview</h3>
        <div className="flex items-center gap-2">
          {canEdit && (
            <Button
              size="sm"
              variant="outline"
              onClick={isEditingTemplate ? handleSaveTemplate : handleEditTemplate}
              className="flex items-center gap-1"
              disabled={isSaving}
              loading={isSaving && isEditingTemplate}
            >
              {isEditingTemplate ? (
                <>
                  <Save className="h-4 w-4" />
                  <span>{isSaving ? 'Saving...' : 'Save'}</span>
                </>
              ) : (
                <>
                  <Edit className="h-4 w-4" />
                  <span>Edit</span>
                </>
              )}
            </Button>
          )}
          {isEditingTemplate && (
            <Button
              size="sm"
              variant="outline"
              onClick={handleCancelTemplateEdit}
              className="flex items-center gap-1"
              disabled={isSaving}
            >
              <X className="h-4 w-4" />
              <span>Cancel</span>
            </Button>
          )}
          <Button
            size="sm"
            variant="outline"
            onClick={handleCopy}
            className="flex items-center gap-1"
            loading={isCopying}
          >
            {copied ? (
              <>
                <Check className="h-4 w-4" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                <span>{isCopying ? 'Copying...' : 'Copy to clipboard'}</span>
              </>
            )}
          </Button>
        </div>
      </div>
      <div className="min-h-[500px] p-4 border rounded-md bg-card text-card-foreground whitespace-pre-wrap text-base leading-relaxed overflow-auto">
        {subject && (
          <div className="mb-4 pb-4 border-b border-border">
            <div className="flex justify-between items-center mb-1">
              <div className="text-sm font-semibold text-muted-foreground">Subject:</div>
              {canEdit && onSubjectChange && (
                <div className="flex items-center gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={isEditingSubject ? handleSaveSubject : handleEditSubject}
                    className="h-6 px-2 text-xs"
                    disabled={isSaving}
                    loading={isSaving && isEditingSubject}
                  >
                    {isEditingSubject ? <Save className="h-3 w-3" /> : <Edit className="h-3 w-3" />}
                  </Button>
                  {isEditingSubject && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleCancelSubjectEdit}
                      className="h-6 px-2 text-xs"
                      disabled={isSaving}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              )}
            </div>
            {isEditingSubject ? (
              <Textarea
                ref={subjectTextareaRef}
                value={editedSubject}
                onChange={(e) => setEditedSubject(e.target.value)}
                className="font-medium text-lg min-h-[60px] resize-none"
                disabled={isSaving}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.ctrlKey) {
                    handleSaveSubject()
                  } else if (e.key === 'Escape') {
                    handleCancelSubjectEdit()
                  }
                }}
              />
            ) : (
              <div 
                className="font-medium text-lg"
                dangerouslySetInnerHTML={{ __html: formatText(renderedSubject) }}
              />
            )}
          </div>
        )}
        {isEditingTemplate ? (
          <Textarea
            ref={templateTextareaRef}
            value={editedTemplate}
            onChange={(e) => setEditedTemplate(e.target.value)}
            className="w-full min-h-[400px] border-0 p-0 resize-none bg-transparent font-inherit text-inherit leading-inherit focus-visible:ring-0"
            disabled={isSaving}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.ctrlKey) {
                handleSaveTemplate()
              } else if (e.key === 'Escape') {
                handleCancelTemplateEdit()
              }
            }}
          />
        ) : (
          <div 
            dangerouslySetInnerHTML={{ __html: formatText(renderedTemplate) }}
          />
        )}
      </div>
      {(isEditingTemplate || isEditingSubject) && (
        <div className="text-xs text-muted-foreground">
          Press Ctrl+Enter to save, Escape to cancel
        </div>
      )}
    </div>
  )
}