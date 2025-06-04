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
    let selectionEnd = start

    switch (format) {
      case 'bold':
        formattedText = `**${selectedText}**`
        newCursorPos = end + 4
        selectionEnd = newCursorPos
        break
      case 'italic':
        formattedText = `*${selectedText}*`
        newCursorPos = end + 2
        selectionEnd = newCursorPos
        break
      case 'underline':
        formattedText = `<u>${selectedText}</u>`
        newCursorPos = end + 7
        selectionEnd = newCursorPos
        break
      case 'hyperlink':
        formattedText = `[${selectedText}](https://example.com)`
        newCursorPos = start + selectedText.length + 3 // Start of URL
        selectionEnd = newCursorPos + 19 // End of "https://example.com"
        break
      case 'h1':
        formattedText = `# ${selectedText}`
        newCursorPos = end + 2
        selectionEnd = newCursorPos
        break
      case 'h2':
        formattedText = `## ${selectedText}`
        newCursorPos = end + 3
        selectionEnd = newCursorPos
        break
      case 'list':
        formattedText = `- ${selectedText}`
        newCursorPos = end + 2
        selectionEnd = newCursorPos
        break
      default:
        formattedText = selectedText
        selectionEnd = newCursorPos
    }

    const newValue = value.substring(0, start) + formattedText + value.substring(end)
    onChange(newValue)

    // Set cursor position after the inserted formatting
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus()
        textareaRef.current.setSelectionRange(newCursorPos, selectionEnd)
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