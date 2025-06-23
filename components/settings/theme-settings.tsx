"use client"

import * as React from "react"
import { Sun, Moon } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

export function ThemeSettings() {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <div className="flex items-center justify-between">
      <div className="space-y-0.5">
        <label className="text-sm font-medium">Theme</label>
        <p className="text-sm text-muted-foreground">
          Choose your preferred theme
        </p>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={toggleTheme}
        className="flex items-center gap-2"
      >
        {theme === 'dark' ? (
          <>
            <Moon className="w-4 h-4" />
            Dark
          </>
        ) : (
          <>
            <Sun className="w-4 h-4" />
            Light
          </>
        )}
      </Button>
    </div>
  )
} 