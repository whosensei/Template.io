"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Plus, X, Lock, Edit } from 'lucide-react'
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
  showValues?: boolean
  showAddSection?: boolean
  useDottedContainer?: boolean
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
  className,
  showValues = true,
  showAddSection = true,
  useDottedContainer = false
}: VariableFormProps) {
  const [newVarName, setNewVarName] = useState('')
  const [error, setError] = useState('')
  const [editingVariable, setEditingVariable] = useState<string | null>(null)

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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAddVariable()
    }
  }

  const handleEditVariable = (variableName: string) => {
    if (showValues) {
      setEditingVariable(variableName)
    }
  }

  return (
    <div className={cn("w-full space-y-4", className)}>
      {/* Current Variables */}
      {Object.keys(variables).length > 0 && (
        <div className="space-y-3">
          <div className="text-sm font-medium text-muted-foreground">
            Variables
          </div>
          
          <div className={useDottedContainer ? "min-h-[80px] p-3 border-2 border-dashed border-muted rounded-lg" : ""}>
            {showValues ? (
              // Full variable editing with values
              <div className="space-y-3">
                {Object.entries(variables).map(([name, value]) => {
                  const isTemplateDefined = isVariableTemplateDefined(name)
                  const isRemoving = removingVariable === name
                  const isEditing = editingVariable === name
                  
                  return (
                    <div key={name} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg border">
                      <div className="min-w-0 flex-1">
                        <Label className="text-sm font-medium mb-2 block">{name}</Label>
                        {isEditing ? (
                          <Input
                            value={value}
                            onChange={(e) => onVariableChange(name, e.target.value)}
                            className="h-8 text-sm"
                            disabled={disabled}
                            placeholder="Enter value..."
                            onBlur={() => setEditingVariable(null)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === 'Escape') {
                                setEditingVariable(null)
                              }
                            }}
                            autoFocus
                          />
                        ) : (
                          <div 
                            className="h-8 px-3 py-1 bg-background border rounded-md flex items-center cursor-pointer hover:bg-muted/50 transition-colors"
                            onClick={() => !disabled && handleEditVariable(name)}
                          >
                            <span className="text-sm text-muted-foreground flex-1">
                              {value || 'Click to edit...'}
                            </span>
                            <Edit className="w-3 h-3 text-muted-foreground/50" />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-shrink-0">
                        {!isTemplateDefined ? (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => onRemoveVariable(name)}
                            className="h-8 w-8 p-0 hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400"
                            title={`Remove ${name} variable`}
                            disabled={disabled || isRemoving}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        ) : (
                          <div className="h-8 w-8 flex items-center justify-center" title="Template-defined variable">
                            <Lock className="w-4 h-4 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              // Simple variable badges without values (for template editing)
              <div className="flex flex-wrap gap-2">
                {Object.keys(variables).map((name) => {
                  const isTemplateDefined = isVariableTemplateDefined(name)
                  const isRemoving = removingVariable === name
                  
                  return (
                    <Badge
                      key={name}
                      variant="secondary"
                      className="h-8 px-3 py-1 text-sm font-medium flex items-center gap-2 bg-muted/50 hover:bg-muted/70 transition-colors"
                    >
                      <span>{name}</span>
                      {!isTemplateDefined ? (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => onRemoveVariable(name)}
                          className="h-4 w-4 p-0 ml-1 hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400 rounded-full"
                          title={`Remove ${name} variable`}
                          disabled={disabled || isRemoving}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      ) : (
                        <span title="Template-defined variable">
                          <Lock className="w-3 h-3 text-muted-foreground" />
                        </span>
                      )}
                    </Badge>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Add New Variable */}
      {showAddSection && (
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              value={newVarName}
              onChange={(e) => {
                setNewVarName(e.target.value)
                setError('')
              }}
              placeholder="Add variable name..."
              className="flex-1 h-9 text-sm"
              disabled={disabled}
              onKeyDown={handleKeyDown}
            />
            <Button
              type="button"
              onClick={handleAddVariable}
              disabled={disabled || !newVarName.trim()}
              size="sm"
              className="h-9"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          {error && (
            <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
          )}
        </div>
      )}

      {Object.keys(variables).length === 0 && (
        <div className="text-center py-6 px-4 border-2 border-dashed border-muted rounded-lg">
          <p className="text-sm text-muted-foreground mb-1">No variables yet</p>
          <p className="text-xs text-muted-foreground/60">Variables from your template will appear here</p>
        </div>
      )}
    </div>
  )
}