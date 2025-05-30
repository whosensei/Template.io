"use client"

import { useRef, useState } from "react"
import { insertVariableAtCursor } from "@/lib/utils/template"

interface UseTextEditorProps {
  value: string
  onChange: (value: string) => void
}

export function useTextEditor({ value, onChange }: UseTextEditorProps) {
  const [cursorPosition, setCursorPosition] = useState(0)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleCursorChange = () => {
    if (textareaRef.current) {
      setCursorPosition(textareaRef.current.selectionStart)
    }
  }

  const handleInsertVariable = (variable: string) => {
    if (textareaRef.current) {
      const position = textareaRef.current.selectionStart
      const { newTemplate, newCursorPosition } = insertVariableAtCursor(value, variable, position)
      
      onChange(newTemplate)
      
      // Update cursor position after React has updated the DOM
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus()
          textareaRef.current.setSelectionRange(newCursorPosition, newCursorPosition)
          setCursorPosition(newCursorPosition)
        }
      }, 0)
    }
  }

  const handleFormatText = (format: string) => {
    if (!textareaRef.current) return

    const start = textareaRef.current.selectionStart
    const end = textareaRef.current.selectionEnd
    const selectedText = value.substring(start, end)
    let formattedText = ''
    let newCursorPos = start

    switch (format) {
      case 'bold':
        formattedText = `**${selectedText}**`
        newCursorPos = end + 4
        break
      case 'italic':
        formattedText = `*${selectedText}*`
        newCursorPos = end + 2
        break
      case 'h1':
        formattedText = `# ${selectedText}`
        newCursorPos = end + 2
        break
      case 'h2':
        formattedText = `## ${selectedText}`
        newCursorPos = end + 3
        break
      case 'list':
        formattedText = `- ${selectedText}`
        newCursorPos = end + 2
        break
      case 'align-left':
        // Simple implementation - would be more complex in a real editor
        formattedText = selectedText
        break
      case 'align-center':
        // Simple implementation - would be more complex in a real editor
        formattedText = selectedText
        break
      case 'align-right':
        // Simple implementation - would be more complex in a real editor
        formattedText = selectedText
        break
      default:
        formattedText = selectedText
    }

    const newValue = value.substring(0, start) + formattedText + value.substring(end)
    onChange(newValue)

    // Set cursor position after the inserted formatting
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus()
        textareaRef.current.setSelectionRange(newCursorPos, newCursorPos)
        setCursorPosition(newCursorPos)
      }
    }, 0)
  }

  return {
    textareaRef,
    cursorPosition,
    handleCursorChange,
    handleInsertVariable,
    handleFormatText
  }
} 