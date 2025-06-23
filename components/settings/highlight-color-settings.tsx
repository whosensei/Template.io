"use client"

import * as React from "react"
import { Check } from "lucide-react"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface HighlightColorSettingsProps {
  currentColor: string
  onColorChange: (color: string) => void
}

interface ColorOption {
  name: string
  value: string
  lightColor: string
  darkColor: string
  lightRing: string
  darkRing: string
}

const colorOptions: ColorOption[] = [
  {
    name: "Blue",
    value: "blue",
    lightColor: "bg-blue-500",
    darkColor: "bg-blue-400",
    lightRing: "ring-blue-500",
    darkRing: "ring-blue-400",
  },
  {
    name: "Purple",
    value: "purple",
    lightColor: "bg-purple-500",
    darkColor: "bg-purple-400",
    lightRing: "ring-purple-500",
    darkRing: "ring-purple-400",
  },
  {
    name: "Pink",
    value: "pink",
    lightColor: "bg-pink-500",
    darkColor: "bg-pink-400",
    lightRing: "ring-pink-500",
    darkRing: "ring-pink-400",
  },
  {
    name: "Green",
    value: "green",
    lightColor: "bg-green-500",
    darkColor: "bg-green-400",
    lightRing: "ring-green-500",
    darkRing: "ring-green-400",
  },
  {
    name: "Orange",
    value: "orange",
    lightColor: "bg-orange-500",
    darkColor: "bg-orange-400",
    lightRing: "ring-orange-500",
    darkRing: "ring-orange-400",
  },
  {
    name: "Red",
    value: "red",
    lightColor: "bg-red-500",
    darkColor: "bg-red-400",
    lightRing: "ring-red-500",
    darkRing: "ring-red-400",
  },
]

export function HighlightColorSettings({ 
  currentColor, 
  onColorChange 
}: HighlightColorSettingsProps) {
  const { theme } = useTheme()
  const [isUpdating, setIsUpdating] = React.useState(false)

  const handleColorSelect = async (colorValue: string) => {
    if (colorValue === currentColor) return
    
    setIsUpdating(true)
    try {
      const response = await fetch('/api/user/preferences', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ highlightColor: colorValue }),
      })

      if (response.ok) {
        onColorChange(colorValue)
        // Dispatch custom event to notify other components
        window.dispatchEvent(new CustomEvent('highlightColorChanged', { 
          detail: { color: colorValue } 
        }))
        toast.success(`Highlight color changed to ${colorOptions.find(c => c.value === colorValue)?.name}`)
      } else {
        toast.error('Failed to update highlight color')
      }
    } catch (error) {
      console.error('Error updating highlight color:', error)
      toast.error('Failed to update highlight color')
    } finally {
      setIsUpdating(false)
    }
  }

  const selectedColorOption = colorOptions.find(c => c.value === currentColor) || colorOptions[0]
  const isDark = theme === 'dark'

  return (
    <div className="space-y-6">
      {/* Color Preview */}
      <div className="bg-muted/30 rounded-lg p-4">
        <h4 className="text-sm font-medium mb-3">Preview</h4>
        <div className="text-sm">
          <span className="text-muted-foreground">Text with highlighted </span>
          <span 
            className={cn(
              "px-2 py-1 rounded font-medium transition-colors",
              // Match the actual template preview styling
              selectedColorOption.value === 'blue' 
                ? "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300"
                : selectedColorOption.value === 'purple'
                ? "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300"
                : selectedColorOption.value === 'pink'
                ? "bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-300"
                : selectedColorOption.value === 'green'
                ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                : selectedColorOption.value === 'orange'
                ? "bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300"
                : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300"
            )}
          >
            {"{{variable}}"}
          </span>
          <span className="text-muted-foreground"> in template</span>
        </div>
      </div>

      {/* Color Options */}
      <div>
        <h4 className="text-sm font-medium mb-3">Choose Color</h4>
        <div className="grid grid-cols-6 gap-2">
          {colorOptions.map((color) => {
            const isSelected = currentColor === color.value
            
            return (
              <button
                key={color.value}
                onClick={() => handleColorSelect(color.value)}
                disabled={isUpdating}
                className={cn(
                  "relative flex flex-col items-center gap-1.5 p-2 rounded-lg border-2 transition-all duration-200",
                  "hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed",
                  isSelected
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border hover:border-primary/50 hover:bg-muted/50"
                )}
                title={color.name}
              >
                <div className="relative">
                  <div
                    className={cn(
                      "w-5 h-5 rounded-full ring-1 ring-offset-1 ring-offset-background transition-all duration-200",
                      isDark ? color.darkColor : color.lightColor,
                      isSelected
                        ? isDark ? color.darkRing : color.lightRing
                        : "ring-border"
                    )}
                  />
                  {isSelected && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Check className="w-3 h-3 text-white drop-shadow-sm" />
                    </div>
                  )}
                </div>
                <span className="text-xs font-medium text-center leading-tight">
                  {color.name}
                </span>
              </button>
            )
          })}
        </div>
      </div>
      
      <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-md p-3">
        <p className="text-xs text-amber-800 dark:text-amber-200">
          This color will be applied to the <span className="font-bold text-amber-800 dark:text-amber-200">{"{{variables}}"}</span> in the template.
        </p>
      </div>
    </div>
  )
} 