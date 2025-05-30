"use client"

import React, { useState } from 'react'
import { replaceVariables } from '@/lib/utils/template'
import { Button } from '@/components/ui/button'
import { Copy, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TemplatePreviewProps {
  template: string
  variables: Record<string, string>
  subject?: string
  className?: string
}

export function TemplatePreview({ 
  template, 
  variables,
  subject = '',
  className
}: TemplatePreviewProps) {
  const [copied, setCopied] = useState(false)
  
  const renderedTemplate = replaceVariables(template, variables)
  const renderedSubject = replaceVariables(subject, variables)
  
  const handleCopy = async () => {
    const fullEmail = subject ? `Subject: ${renderedSubject}\n\n${renderedTemplate}` : renderedTemplate
    await navigator.clipboard.writeText(fullEmail)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
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

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Preview</h3>
        <Button
          size="sm"
          variant="outline"
          onClick={handleCopy}
          className="flex items-center gap-1"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              <span>Copy to clipboard</span>
            </>
          )}
        </Button>
      </div>
      <div className="min-h-[500px] p-4 border rounded-md bg-card text-card-foreground whitespace-pre-wrap text-base leading-relaxed overflow-auto">
        {subject && (
          <div className="mb-4 pb-4 border-b border-border">
            <div className="text-sm font-semibold text-muted-foreground mb-1">Subject:</div>
            <div 
              className="font-medium text-lg"
              dangerouslySetInnerHTML={{ __html: formatText(renderedSubject) }}
            />
          </div>
        )}
        <div 
          dangerouslySetInnerHTML={{ __html: formatText(renderedTemplate) }}
        />
      </div>
    </div>
  )
}