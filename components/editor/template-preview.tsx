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
      // Replace underline
      .replace(/<u>(.*?)<\/u>/g, '<u>$1</u>')
      // Replace hyperlinks [text](url)
      .replace(/\[([^\]]*)\]\(([^)]*)\)/g, '<a href="$2" class="text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-300" target="_blank" rel="noopener noreferrer">$1</a>')
      // Replace h1
      .replace(/^# (.*?)$/gm, '<h1 class="text-xl font-semibold mt-4 mb-2 text-gray-900 dark:text-white">$1</h1>')
      // Replace h2
      .replace(/^## (.*?)$/gm, '<h2 class="text-lg font-medium mt-3 mb-2 text-gray-900 dark:text-white">$1</h2>')
      // Replace list items
      .replace(/^- (.*?)$/gm, '<li class="ml-4 text-gray-900 dark:text-white">$1</li>')
      // Replace paragraphs
      .replace(/(?:^|\n)(?!<h1|<h2|<li)(.*?)(?:\n|$)/g, (match, p1) => {
        if (p1.trim() === '') return match;
        return `<p class="mb-3 text-gray-900 dark:text-white leading-relaxed">${p1}</p>`;
      });
    
    // Wrap lists in ul tags
    if (formatted.includes('<li')) {
      formatted = formatted.replace(/(<li.*?<\/li>)+/g, '<ul class="list-disc ml-4 mb-4">$&</ul>');
    }

    // Highlight variables that haven't been replaced
    formatted = formatted.replace(/{{(.*?)}}/g, '<span class="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-1 rounded font-medium">{{$1}}</span>');
    
    return formatted;
  };

  const canEdit = !!(onTemplateChange || onSubjectChange)

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Preview</h3>
        <div className="flex items-center gap-2">
          {canEdit && (
            <Button
              onClick={isEditingTemplate ? handleSaveTemplate : handleEditTemplate}
              variant="outline"
              size="sm"
              disabled={isSaving}
            >
              {isEditingTemplate ? (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? 'Saving...' : 'Save'}
                </>
              ) : (
                <>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </>
              )}
            </Button>
          )}
          {isEditingTemplate && (
            <Button
              onClick={handleCancelTemplateEdit}
              variant="outline"
              size="sm"
              disabled={isSaving}
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          )}
          <Button
            onClick={handleCopy}
            disabled={isCopying}
            size="sm"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Preview Content */}
      <div className="border border-gray-200 dark:border-zinc-700 rounded-lg bg-gray-50 dark:bg-zinc-900 max-h-[670px] flex flex-col">
        {subject && (
          <div className="border-b border-gray-200 dark:border-zinc-700 p-4 flex-shrink-0">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-zinc-300">Subject</span>
              {canEdit && onSubjectChange && (
                <div className="flex items-center gap-1">
                  <Button
                    onClick={isEditingSubject ? handleSaveSubject : handleEditSubject}
                    variant="ghost"
                    size="sm"
                    disabled={isSaving}
                  >
                    {isEditingSubject ? <Save className="w-3 h-3" /> : <Edit className="w-3 h-3" />}
                  </Button>
                  {isEditingSubject && (
                    <Button
                      onClick={handleCancelSubjectEdit}
                      variant="ghost"
                      size="sm"
                      disabled={isSaving}
                    >
                      <X className="w-3 h-3" />
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
                className="font-medium text-gray-900 dark:text-white min-h-[40px] resize-none border border-white dark:border-zinc-900 focus-visible:ring-0 focus:ring-0 focus:border-white dark:focus:border-zinc-900 focus:outline-none shadow-none bg-transparent"
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
                className="font-medium text-gray-900 dark:text-white break-words"
                dangerouslySetInnerHTML={{ __html: formatText(renderedSubject) }}
              />
            )}
          </div>
        )}
        
        <div className="p-6 flex-1 overflow-y-auto min-h-0 custom-scrollbar">
          {isEditingTemplate ? (
            <Textarea
              ref={templateTextareaRef}
              value={editedTemplate}
              onChange={(e) => setEditedTemplate(e.target.value)}
              className="w-full h-full min-h-[400px] border border-white dark:border-zinc-900 p-0 resize-none bg-transparent focus-visible:ring-0 focus:ring-0 focus:border-white dark:focus:border-zinc-900 focus:outline-none shadow-none text-gray-900 dark:text-white"
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
              className="prose prose-sm max-w-none break-words text-gray-900 dark:text-white dark:prose-invert"
              dangerouslySetInnerHTML={{ __html: formatText(renderedTemplate) }}
            />
          )}
        </div>
      </div>
      
      {(isEditingTemplate || isEditingSubject) && (
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-zinc-400">
            Press <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-zinc-700 border border-gray-300 dark:border-zinc-600 rounded text-xs font-mono">Ctrl+Enter</kbd> to save, <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-zinc-700 border border-gray-300 dark:border-zinc-600 rounded text-xs font-mono">Escape</kbd> to cancel
          </p>
        </div>
      )}
    </div>
  )
}