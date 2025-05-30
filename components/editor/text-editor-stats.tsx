"use client"

interface TextEditorStatsProps {
  characterCount: number
  maxLength: number
  cursorPosition: number
}

export function TextEditorStats({ characterCount, maxLength, cursorPosition }: TextEditorStatsProps) {
  return (
    <div className="flex justify-between items-center text-sm text-muted-foreground">
      <div>
        {characterCount} / {maxLength} characters
      </div>
      <div>
        Cursor position: {cursorPosition}
      </div>
    </div>
  )
} 