"use client"

import { useRef } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface EmailSubjectSectionProps {
  subject: string
  onSubjectChange: (subject: string) => void
  variables: Record<string, string>
  onInsertVariable: (variable: string) => void
}

export function EmailSubjectSection({
  subject,
  onSubjectChange,
  variables,
  onInsertVariable
}: EmailSubjectSectionProps) {
  const subjectInputRef = useRef<HTMLInputElement>(null)

  const handleInsertVariable = (variable: string) => {
    if (subjectInputRef.current) {
      const start = subjectInputRef.current.selectionStart || 0
      const end = subjectInputRef.current.selectionEnd || 0
      const newValue = subject.substring(0, start) + `{{${variable}}}` + subject.substring(end)
      onSubjectChange(newValue)
      
      // Set cursor position after the inserted variable
      setTimeout(() => {
        if (subjectInputRef.current) {
          const newCursorPos = start + variable.length + 4 // 4 for {{ and }}
          subjectInputRef.current.focus()
          subjectInputRef.current.setSelectionRange(newCursorPos, newCursorPos)
        }
      }, 0)
    }
    onInsertVariable(variable)
  }

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-medium">Email Subject</h3>
      <Input
        ref={subjectInputRef}
        value={subject}
        onChange={(e) => onSubjectChange(e.target.value)}
        placeholder="Enter email subject line..."
        className="w-full"
      />
      {Object.keys(variables).length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Insert variables:</p>
          <div className="flex flex-wrap gap-2">
            {Object.keys(variables).map((variable) => (
              <Button
                key={variable}
                variant="outline"
                size="sm"
                onClick={() => handleInsertVariable(variable)}
                className="h-8 text-xs"
              >
                {variable}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
} 