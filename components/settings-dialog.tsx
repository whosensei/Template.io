"use client"

import * as React from "react"
import { Settings, Mail, Palette, Monitor, Info } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { SidebarMenuButton } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { GmailConnectionsSettings } from "@/components/settings/gmail-connections-settings"
import { HighlightColorSettings } from "@/components/settings/highlight-color-settings"
import { ThemeSettings } from "@/components/settings/theme-settings"

interface SettingsDialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

type SettingCategory = 'gmail' | 'appearance' | 'colors' | 'about'

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [activeCategory, setActiveCategory] = React.useState<SettingCategory>('gmail')
  const [gmailConnections, setGmailConnections] = React.useState<any[]>([])
  const [userPreferences, setUserPreferences] = React.useState<any>(null)
  const [isLoading, setIsLoading] = React.useState(true)

  const handleOpenChange = (newOpen: boolean) => {
    if (onOpenChange) {
      onOpenChange(newOpen)
    } else {
      setIsOpen(newOpen)
    }

    // Load data when dialog opens
    if (newOpen && !isLoading) {
      loadData()
    }
  }

  const dialogOpen = open !== undefined ? open : isOpen

  const loadData = async () => {
    setIsLoading(true)
    try {
      const [connectionsRes, preferencesRes] = await Promise.all([
        fetch('/api/gmail/connections'),
        fetch('/api/user/preferences')
      ])

      if (connectionsRes.ok) {
        const connectionsData = await connectionsRes.json()
        setGmailConnections(connectionsData.connections || [])
      }

      if (preferencesRes.ok) {
        const preferencesData = await preferencesRes.json()
        setUserPreferences(preferencesData)
      }
    } catch (error) {
      console.error('Error loading settings data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Load data when component mounts
  React.useEffect(() => {
    loadData()
  }, [])

  const handleConnectionUpdate = () => {
    loadData()
  }

  const handleColorChange = (color: string) => {
    setUserPreferences((prev: any) => ({ ...prev, highlightColor: color }))
  }

  const settingCategories = [
    {
      id: 'gmail' as SettingCategory,
      label: 'Connected Gmail',
      icon: Mail,
      description: 'Manage Gmail connections'
    },
    {
      id: 'colors' as SettingCategory,
      label: 'Highlight Color',
      icon: Palette,
      description: 'Choose accent color'
    },
    {
      id: 'appearance' as SettingCategory,
      label: 'Appearance',
      icon: Monitor,
      description: 'Theme settings'
    },
    {
      id: 'about' as SettingCategory,
      label: 'About',
      icon: Info,
      description: 'App information'
    }
  ]

  const renderSettingContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full mx-auto mb-4" />
            <p className="text-sm text-muted-foreground">Loading settings...</p>
          </div>
        </div>
      )
    }

    switch (activeCategory) {
      case 'gmail':
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-foreground">Connected Gmail</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Manage your Gmail account connections for sending emails. You can connect multiple accounts and switch between them when composing emails.
              </p>
            </div>
            <GmailConnectionsSettings
              connections={gmailConnections}
              onConnectionUpdate={handleConnectionUpdate}
            />
          </div>
        )
      case 'colors':
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-foreground">Highlight Color</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Choose your preferred accent color for the interface. This color will be used for variables throughout the application.
              </p>
            </div>
            <HighlightColorSettings
              currentColor={userPreferences?.highlightColor || 'blue'}
              onColorChange={handleColorChange}
            />
          </div>
        )
      case 'appearance':
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-foreground">Appearance</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Switch between light and dark themes to match your preference and working environment.
              </p>
            </div>
            <ThemeSettings />
          </div>
        )
      case 'about':
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-foreground">About</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Application information and version details.
              </p>
            </div>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
                  <Mail className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-foreground">Template.io</h4>
                  <p className="text-sm text-muted-foreground">Email Templates Made Easy</p>
                </div>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-foreground">Version</span>
                  <p className="text-muted-foreground mt-1">1.0.0</p>
                </div>
                <div>
                  <span className="font-medium text-foreground">Status</span>
                  <p className="text-muted-foreground mt-1">Stable</p>
                </div>
              </div>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <SidebarMenuButton className="w-full justify-start">
          <Settings className="w-4 h-4" />
          <span>Settings</span>
        </SidebarMenuButton>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[850px] h-[650px] p-0">
        <div className="flex flex-col h-full">
          {/* Header */}
          <DialogHeader className="px-6 pt-6 pb-4 border-b">
            <DialogTitle className="text-xl">Settings</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground mt-1">
              Configure your Template.io preferences and settings.
            </DialogDescription>
          </DialogHeader>
          
          {/* Main Content */}
          <div className="flex flex-1 overflow-hidden">
            {/* Settings Navigation */}
            <div className="w-80 border-r bg-muted/20">
              <div className="p-4">
                <div className="space-y-2">
                  {settingCategories.map((category) => {
                    const Icon = category.icon
                    const isActive = activeCategory === category.id
                    
                    return (
                      <Button
                        key={category.id}
                        variant={isActive ? "secondary" : "ghost"}
                        className={cn(
                          "w-full justify-start h-auto p-4 text-left transition-all duration-200",
                          isActive 
                            ? "bg-background border shadow-sm hover:bg-background" 
                            : "hover:bg-background/50"
                        )}
                        onClick={() => setActiveCategory(category.id)}
                      >
                        <div className="flex items-start gap-3 w-full">
                          <div className={cn(
                            "p-2 rounded-md transition-colors flex-shrink-0",
                            isActive 
                              ? "bg-primary text-primary-foreground" 
                              : "bg-muted text-muted-foreground"
                          )}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="min-w-0 flex-1 pt-0.5 space-y-1">
                            <div className="text-sm font-medium leading-tight break-words">
                              {category.label}
                            </div>
                            <div className="text-xs text-muted-foreground leading-tight break-words">
                              {category.description}
                            </div>
                          </div>
                        </div>
                      </Button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Settings Content */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-6">
                {renderSettingContent()}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 