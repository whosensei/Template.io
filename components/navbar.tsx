"use client"

import { Mail } from "lucide-react"
import { UserButton } from "@clerk/nextjs"
import { ThemeToggle } from "./theme-toggle"

export function Navbar() {
  return (
    <div className="top-0 z-50 w-full bg-white/90 dark:bg-black/90 backdrop-blur-md pt-4">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between bg-white/95 dark:bg-zinc-900/95 border border-gray-200/80 dark:border-zinc-700/80 rounded-2xl px-8 py-3 backdrop-blur-sm hover:shadow-sm transition-all duration-300">
          {/* Left side - Logo and brand */}
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-br from-gray-900 to-black dark:from-white dark:to-gray-100 rounded-xl flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105">
              <Mail className="w-5 h-5 text-white dark:text-black" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Template.io</span>
              <span className="text-xs text-gray-500 dark:text-zinc-400 font-medium">Email Templates</span>
            </div>
          </div>

          {/* Right side - Controls */}
          <div className="flex items-center gap-4">
            <div className="bg-gray-100 dark:bg-zinc-800 rounded-full p-1">
              <ThemeToggle />
            </div>
            <div className="w-px h-8 bg-gradient-to-b from-transparent via-gray-300 dark:via-zinc-600 to-transparent"></div>
            <div className="pt-2" >
              <UserButton 
                appearance={{
                  elements: {
                    userButtonAvatarBox: "w-8 h-8 hover:scale-105 transition-transform duration-200 shadow-md hover:shadow-lg",
                    userButtonPopoverCard: "shadow-2xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 backdrop-blur-md rounded-xl",
                    userButtonPopoverMain: "bg-white dark:bg-zinc-900",
                    userButtonPopoverActions: "bg-white dark:bg-zinc-900 border-t border-gray-100 dark:border-zinc-800",
                    userButtonPopoverActionButton: "hover:bg-gray-50 dark:hover:bg-zinc-800 dark:text-zinc-200 transition-colors duration-200 text-gray-900 dark:bg-zinc-900",
                    userButtonPopoverActionButtonText: "text-gray-900 dark:text-zinc-200 font-medium",
                    userButtonPopoverActionButtonIcon: "text-gray-600 dark:text-zinc-400",
                    userButtonPopoverFooter: "hidden",
                    avatarBox: "rounded-full ring-2 ring-white dark:ring-zinc-700 shadow-lg",
                    userPreview: "bg-white dark:bg-zinc-900 p-4",
                    userPreviewMainIdentifier: "text-gray-900 dark:text-white font-semibold text-sm",
                    userPreviewSecondaryIdentifier: "text-gray-600 dark:text-zinc-400 text-xs",
                    userPreviewAvatarContainer: "bg-white dark:bg-zinc-900",
                    userPreviewTextContainer: "bg-white dark:bg-zinc-900",
                    userButtonPopoverContent: "bg-white dark:bg-zinc-900",
                    modalContent: "bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700",
                    modalCloseButton: "text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white",
                    card: "bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 shadow-xl",
                    headerTitle: "text-gray-900 dark:text-white font-semibold",
                    headerSubtitle: "text-gray-600 dark:text-zinc-400",
                    socialButtonsBlockButton: "bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-600 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-zinc-700",
                    formButtonPrimary: "bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200",
                    formFieldInput: "bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-600 text-gray-900 dark:text-white",
                    formFieldLabel: "text-gray-700 dark:text-zinc-300",
                    identityPreview: "bg-white dark:bg-zinc-900",
                    identityPreviewText: "text-gray-900 dark:text-white",
                    identityPreviewEditButton: "text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white"
                  },
                  variables: {
                    colorPrimary: '#000000',
                    colorBackground: '#ffffff',
                    colorInputBackground: '#ffffff',
                    colorInputText: '#111827',
                    colorText: '#111827',
                    colorTextSecondary: '#6b7280',
                    colorDanger: '#dc2626',
                    colorSuccess: '#16a34a',
                    colorWarning: '#ca8a04',
                    colorNeutral: '#6b7280',
                    borderRadius: '12px',
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 