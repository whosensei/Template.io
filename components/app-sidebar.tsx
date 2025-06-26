"use client"

import * as React from "react"
import { Mail, Plus, Edit, Trash2, Settings, LogOut, Sun, Moon } from "lucide-react"
import { useSession, signOut } from "next-auth/react"
import { useTheme } from "next-themes"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { SettingsDialog } from "@/components/settings-dialog"

interface Template {
  id: string
  name: string
}

interface AppSidebarProps {
  templates: Template[]
  selectedTemplateId: string
  currentTemplateName?: string
  onTemplateSelect: (templateId: string) => void
  onNewTemplate: () => void
  onEditTemplate: () => void
  onDeleteTemplate: () => void
  isDeleting?: boolean
  isLoading?: boolean
}

export function AppSidebar({
  templates,
  selectedTemplateId,
  currentTemplateName,
  onTemplateSelect,
  onNewTemplate,
  onEditTemplate,
  onDeleteTemplate,
  isDeleting = false,
  isLoading = false
}: AppSidebarProps) {
  const { data: session } = useSession()
  const { theme, setTheme } = useTheme()
  
  const user = session?.user

  const selectedTemplate = templates.find(t => t.id === selectedTemplateId)
  const displayName = currentTemplateName || selectedTemplate?.name || "No template selected"

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <Sidebar className="border-r border-border/50">
      <SidebarHeader className="">
        {/* App Brand */}
        <div className="flex items-center gap-3 p-4">
          <div className="w-8 h-8 bg-gradient-to-br from-gray-900 to-black dark:from-white dark:to-gray-100 rounded-lg flex items-center justify-center">
            <img 
              src="/Email Template App Logo Jun 24 2025 (2).png" 
              alt="Template.io" 
              className="w-5 h-5 object-contain"
            />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">Template.io</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">Email Templates</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* Current Template Section */}
        <SidebarGroup>
          <SidebarGroupLabel>Current Template</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="p-2 space-y-2">
              <div className="flex h-10 w-full items-center rounded-md border border-sidebar-border bg-sidebar-accent px-3 py-2 text-sm text-sidebar-accent-foreground transition-colors">
                {displayName}
              </div>
              <div className="space-y-2">
                {/* New Template Button - Primary */}
                <Button
                  onClick={onNewTemplate}
                  size="sm"
                  variant="default"
                  className="w-full"
                  disabled={isLoading}
                >
                  <Plus className="w-3 h-3 mr-2" />
                  New Template
                </Button>
                
                {/* Edit and Delete Buttons - Secondary Row */}
                <div className="flex gap-2">
                  <Button
                    onClick={onEditTemplate}
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    disabled={!selectedTemplateId || isLoading}
                  >
                    <Edit className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 border-red-200 dark:border-red-800 bg-red-50/80 dark:bg-red-950/50 text-red-600 dark:text-red-400 hover:bg-red-100/90 dark:hover:bg-red-900/60 hover:border-red-300 dark:hover:border-red-700 backdrop-blur-sm transition-all duration-200"
                        loading={isDeleting}
                        loadingText="Deleting..."
                        disabled={!selectedTemplateId || isLoading}
                      >
                        <Trash2 className="w-3 h-3 mr-1" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Template</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{displayName}"? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={onDeleteTemplate}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          {isDeleting ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>

        <Separator />

        {/* Templates List */}
        <SidebarGroup className="flex-1">
          <SidebarGroupLabel>All Templates</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {templates.length === 0 ? (
                <div className="px-2 py-4 text-sm text-gray-500 dark:text-gray-400 text-center">
                  No templates yet.<br />
                  Create your first template!
                </div>
              ) : (
                templates.map((template) => (
                  <SidebarMenuItem key={template.id}>
                    <SidebarMenuButton
                      onClick={() => onTemplateSelect(template.id)}
                      isActive={template.id === selectedTemplateId}
                      className="w-full justify-start"
                    >
                      <Mail className="w-4 h-4" />
                      <span className="truncate">{template.name}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="">
        {/* Settings and Theme */}
        <SidebarGroup>
          <SidebarGroupLabel>Settings</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={toggleTheme} className="w-full justify-start">
                  {theme === 'dark' ? (
                    <Moon className="w-4 h-4" />
                  ) : (
                    <Sun className="w-4 h-4" />
                  )}
                  <span>{theme === 'dark' ? 'Dark' : 'Light'} Mode</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SettingsDialog />
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <Separator />

        {/* User Profile */}
        {user && (
          <SidebarGroup>
            <SidebarGroupContent>
              <div className="flex items-center gap-3 p-2">
                {/* Left side - Avatar, Name, Email */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Avatar className="w-9 h-9 ring-2 ring-gray-200 dark:ring-gray-700">
                    <AvatarImage src={user.image || ''} alt={user.name || ""} />
                    <AvatarFallback className="text-sm font-medium bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
                      {user.name?.[0] || user.email?.[0] || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {user.name || "User"}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {user.email}
                    </div>
                  </div>
                </div>
                
                {/* Right side - Logout Button */}
                <Button 
                  onClick={() => signOut({ callbackUrl: '/' })}
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0 hover:bg-red-50 dark:hover:bg-red-950/50 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarFooter>
    </Sidebar>
  )
} 