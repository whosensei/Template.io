"use client"

import { Button } from "@/components/ui/button"

interface VariableInsertionButtonsProps {
  variables: string[]
  onInsertVariable: (variable: string) => void
  disabled?: boolean
}

export function VariableInsertionButtons({ 
  variables, 
  onInsertVariable,
  disabled = false 
}: VariableInsertionButtonsProps) {
  if (!variables || variables.length === 0) {
    return null
  }

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">Insert variables:</p>
      <div className="flex flex-wrap gap-2">
        {variables.map((variable) => (
          <Button
            key={variable}
            variant="outline"
            size="sm"
            onClick={() => onInsertVariable(variable)}
            className="h-8 text-xs"
            disabled={disabled}
          >
            {variable}
          </Button>
        ))}
      </div>
    </div>
  )
} 