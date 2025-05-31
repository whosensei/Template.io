"use client"

import React from 'react'
import { Textarea } from '@/components/ui/textarea'
import { TextEditorToolbar } from './text-editor-toolbar'
import { TextEditorStats } from './text-editor-stats'
import { VariableInsertionButtons } from './variable-insertion-buttons'
import { useTextEditor } from '@/hooks/use-text-editor'
import { cn } from '@/lib/utils'

interface TextEditorProps {
  value: string
  onChange: (value: string) => void
  variables: string[]
  maxLength?: number
  disabled?: boolean
  className?: string
}

export function TextEditor({
  value,
  onChange,
  variables,
  maxLength = 5000,
  disabled = false,
  className
}: TextEditorProps) {
  const {
    textareaRef,
    cursorPosition,
    handleCursorChange,
    handleInsertVariable,
    handleFormatText
  } = useTextEditor({ value, onChange })

  return (
    <div className={cn("space-y-2", className)}>
      <h3 className="text-lg font-medium">Template Editor</h3>
      
      <TextEditorToolbar onFormat={handleFormatText} disabled={disabled} />
      
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onClick={handleCursorChange}
        onKeyUp={handleCursorChange}
        onSelect={handleCursorChange}
        placeholder="Type your email template here..."
        className="min-h-[250px] font-mono text-base leading-relaxed resize-y"
        maxLength={maxLength}
        disabled={disabled}
      />
      
      <TextEditorStats 
        characterCount={value.length}
        maxLength={maxLength}
        cursorPosition={cursorPosition}
      />
      
      <VariableInsertionButtons 
        variables={variables}
        onInsertVariable={handleInsertVariable}
        disabled={disabled}
      />
    </div>
  )
}