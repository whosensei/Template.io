import * as React from "react"
import { Separator } from "@/components/ui/separator"

interface SettingsSectionProps {
  title: string
  description?: string
  children: React.ReactNode
  showSeparator?: boolean
}

export function SettingsSection({ 
  title, 
  description, 
  children, 
  showSeparator = true 
}: SettingsSectionProps) {
  return (
    <>
      <div className="space-y-2">
        <div className="space-y-0.5">
          <h4 className="text-sm font-medium">{title}</h4>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        <div className="space-y-2">
          {children}
        </div>
      </div>
      {showSeparator && <Separator />}
    </>
  )
} 