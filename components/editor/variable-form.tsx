"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PlusCircle, X, Lock } from 'lucide-react'
import { cn } from '@/lib/utils'

interface VariableFormProps {
  variables: Record<string, string>
  onVariableChange: (name: string, value: string) => void
  onAddVariable: (name: string) => void
  onRemoveVariable: (name: string) => void
  templateDefinedVariables?: Set<string>
  disabled?: boolean
  isAdding?: boolean
  removingVariable?: string
  className?: string
}

export function VariableForm({
  variables,
  onVariableChange,
  onAddVariable,
  onRemoveVariable,
  templateDefinedVariables = new Set(),
  disabled = false,
  isAdding = false,
  removingVariable,
  className
}: VariableFormProps) {
  const [newVarName, setNewVarName] = useState('')
  const [error, setError] = useState('')

  const handleAddVariable = () => {
    const trimmedName = newVarName.trim()
    
    if (!trimmedName) {
      setError('Variable name cannot be empty')
      return
    }
    
    if (trimmedName in variables) {
      setError('Variable name already exists')
      return
    }
    
    // Valid variable name should only contain letters, numbers, and underscores
    if (!/^[a-zA-Z0-9_]+$/.test(trimmedName)) {
      setError('Variable name can only contain letters, numbers, and underscores')
      return
    }
    
    onAddVariable(trimmedName)
    setNewVarName('')
    setError('')
  }

  const isVariableTemplateDefined = (variableName: string) => {
    return templateDefinedVariables.has(variableName)
  }

  return (
    <div className={cn("space-y-4", className)}>
      <h3 className="text-lg font-medium">Variable section</h3>
      
      <div className="space-y-3">
        {Object.entries(variables).map(([name, value]) => {
          const isTemplateDefined = isVariableTemplateDefined(name)
          const isRemoving = removingVariable === name
          
          return (
            <div key={name} className="grid grid-cols-[120px_1fr_auto] gap-3 items-center">
              <Label htmlFor={`var-${name}`} className="text-sm font-medium truncate">
                {name}:
              </Label>
              <Input
                id={`var-${name}`}
                value={value}
                onChange={(e) => onVariableChange(name, e.target.value)}
                className="w-full"
                disabled={disabled}
              />
              {isTemplateDefined ? (
                <div className="h-8 w-8 flex items-center justify-center flex-shrink-0">
                  <span title="Template-defined variable - cannot be removed. Use Edit button to modify template structure.">
                    <Lock className="h-4 w-4 text-muted-foreground" />
                  </span>
                </div>
              ) : (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => onRemoveVariable(name)}
                  className="h-8 w-8 flex-shrink-0"
                  title={`Remove ${name} variable`}
                  disabled={disabled}
                  loading={isRemoving}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Remove {name} variable</span>
                </Button>
              )}
            </div>
          )
        })}
      </div>
      
      <div className="space-y-2">
        <div className="grid grid-cols-[120px_1fr_auto] gap-3 items-center">
          <div className="text-sm font-medium text-muted-foreground">New:</div>
          <Input
            value={newVarName}
            onChange={(e) => {
              setNewVarName(e.target.value)
              setError('')
            }}
            placeholder="Variable name"
            className="w-full"
            disabled={disabled}
          />
          <Button
            type="button"
            variant="outline"
            onClick={handleAddVariable}
            className="h-8 px-3 flex items-center gap-1 flex-shrink-0"
            disabled={disabled}
            loading={isAdding}
          >
            <PlusCircle className="h-4 w-4" />
            <span>{isAdding ? 'Adding...' : 'Add'}</span>
          </Button>
        </div>
        {error && <p className="text-sm text-destructive col-span-3">{error}</p>}
      </div>
    </div>
  )
}