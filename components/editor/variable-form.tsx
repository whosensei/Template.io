"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, X, Lock } from 'lucide-react'
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
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <h3 className="text-lg font-medium text-gray-900 dark:text-white ml-2">Variables</h3>
      
      {/* Variables List */}
      <div className="space-y-3">
        {Object.entries(variables).map(([name, value]) => {
          const isTemplateDefined = isVariableTemplateDefined(name)
          const isRemoving = removingVariable === name
          
          return (
            <div key={name} className="grid grid-cols-[100px_1fr_auto] gap-3 items-center w-full">
              <div className="min-w-0 pr-2 ml-2">
                <Label htmlFor={`var-${name}`} className="text-sm font-medium text-gray-700 dark:text-zinc-300 truncate block" title={name}>
                  {name}
                </Label>
              </div>
              <div className="min-w-0">
                <Input
                  id={`var-${name}`}
                  value={value}
                  onChange={(e) => onVariableChange(name, e.target.value)}
                  className="w-full"
                  disabled={disabled}
                  placeholder="Enter value..."
                />
              </div>
              <div className="w-9 flex justify-center flex-shrink-0">
                {isTemplateDefined ? (
                  <div className="w-9 h-9 flex items-center justify-center text-gray-400 dark:text-zinc-500" title="Template-defined variable">
                    <Lock className="w-4 h-4" />
                  </div>
                ) : (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveVariable(name)}
                    className="w-9 h-9 p-0 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400"
                    title={`Remove ${name} variable`}
                    disabled={disabled || isRemoving}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          )
        })}
      </div>
      
      {/* Add New Variable */}
      <div className="border-t border-gray-200 dark:border-zinc-700 pt-4">
        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-700 dark:text-zinc-300 ml-2">Add variable</Label>
          <div className="grid grid-cols-[1fr_auto] gap-3 items-start w-full">
            <div className="min-w-0">
              <Input
                value={newVarName}
                onChange={(e) => {
                  setNewVarName(e.target.value)
                  setError('')
                }}
                placeholder="Variable name"
                className="w-full ml-2"
                disabled={disabled}
              />
              {error && (
                <p className="text-sm text-red-600 dark:text-red-400 mt-1">{error}</p>
              )}
            </div>
            <Button
              type="button"
              onClick={handleAddVariable}
              disabled={disabled || !newVarName.trim()}
              size="sm"
              className="flex-shrink-0 ml-2"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}