"use client"

import { Button } from "@/components/ui/button"
import { Bold, Italic, Underline, Link, List, Heading1, Heading2 } from "lucide-react"

interface TextEditorToolbarProps {
  onFormat: (format: string) => void
  disabled?: boolean
}

export function TextEditorToolbar({ onFormat, disabled = false }: TextEditorToolbarProps) {
  const formatButtons = [
    { format: 'bold', icon: Bold, label: 'Bold' },
    { format: 'italic', icon: Italic, label: 'Italic' },
    { format: 'underline', icon: Underline, label: 'Underline' },
    { format: 'hyperlink', icon: Link, label: 'Hyperlink' },
    { format: 'h1', icon: Heading1, label: 'Heading 1' },
    { format: 'h2', icon: Heading2, label: 'Heading 2' },
    { format: 'list', icon: List, label: 'List' }
  ]

  return (
    <div className="flex items-center space-x-1 bg-muted/40 rounded-md p-1">
      {formatButtons.map(({ format, icon: Icon, label }) => (
        <Button 
          key={format}
          type="button" 
          variant="ghost" 
          size="sm" 
          onClick={() => onFormat(format)}
          className="h-8 px-2 rounded-sm"
          disabled={disabled}
        >
          <Icon className="h-4 w-4" />
          <span className="sr-only">{label}</span>
        </Button>
      ))}
    </div>
  )
} 