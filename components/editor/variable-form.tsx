"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Plus, X, Lock, Settings } from 'lucide-react'
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
    <Card className={cn("w-full", className)}>
      <CardHeader className="pb-8 pt-2 px-0">
        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
          <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
          Variables
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4 p-0">
        {/* Variables List */}
        {Object.entries(variables).length > 0 && (
          <div className="space-y-3">
            {Object.entries(variables).map(([name, value]) => {
              const isTemplateDefined = isVariableTemplateDefined(name)
              const isRemoving = removingVariable === name
              
              return (
                <div key={name} className="grid grid-cols-1 sm:grid-cols-[120px_1fr_auto] gap-2 sm:gap-3 items-start sm:items-center w-full">
                  <div className="min-w-0">
                    <Label htmlFor={`var-${name}`} className="text-xs sm:text-sm font-medium text-gray-700 dark:text-zinc-300 truncate block" title={name}>
                      {name}
                    </Label>
                  </div>
                  <div className="min-w-0 sm:col-span-1">
                    <Input
                      id={`var-${name}`}
                      value={value}
                      onChange={(e) => onVariableChange(name, e.target.value)}
                      className="w-full text-sm"
                      disabled={disabled}
                      placeholder="Enter value..."
                    />
                  </div>
                  <div className="w-9 flex justify-center sm:justify-end flex-shrink-0 sm:ml-auto">
                    {isTemplateDefined ? (
                      <div className="w-9 h-9 flex items-center justify-center text-gray-400 dark:text-zinc-500" title="Template-defined variable">
                        <Lock className="w-3 h-3 sm:w-4 sm:h-4" />
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
                        <X className="w-3 h-3 sm:w-4 sm:h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
        
        {Object.entries(variables).length > 0 && <Separator />}
        
        {/* Add New Variable */}
        <div className="space-y-3">
          <Label className="text-xs sm:text-sm font-medium text-gray-700 dark:text-zinc-300">Add New Variable</Label>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 items-stretch sm:items-start w-full">
            <div className="min-w-0 flex-1">
              <Input
                value={newVarName}
                onChange={(e) => {
                  setNewVarName(e.target.value)
                  setError('')
                }}
                placeholder="Variable name"
                className="w-full text-sm"
                disabled={disabled}
              />
              {error && (
                <p className="text-xs sm:text-sm text-red-600 dark:text-red-400 mt-1 ml-1">{error}</p>
              )}
            </div>
            <Button
              type="button"
              onClick={handleAddVariable}
              disabled={disabled || !newVarName.trim()}
              className="flex-shrink-0 w-full sm:w-auto text-xs sm:text-sm h-10"
            >
              <Plus className="w-4 h-4 mr-1" />
              <span className="sm:hidden">Add Variable</span>
              <span className="hidden sm:inline">Add</span>
            </Button>
          </div>
        </div>

        {Object.entries(variables).length === 0 && (
          <p className="text-xs sm:text-sm text-gray-500 text-center py-4">
            No variables defined. Add variables to personalize your templates.
          </p>
        )}
      </CardContent>
    </Card>
  )
}