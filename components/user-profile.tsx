"use client"

import { UserButton, useUser } from '@clerk/nextjs'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { LogOut, User } from 'lucide-react'
import { useTheme } from 'next-themes'

export function UserProfile() {
  const { user, isLoaded } = useUser()
  const { theme, resolvedTheme } = useTheme()

  // Determine if we're in dark mode
  const isDark = resolvedTheme === 'dark'

  if (!isLoaded) {
    return (
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
            <div className="flex-1">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2" />
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-2/3" />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!user) {
    return null
  }

  return (
    <Card className="mb-6 border-gray-200 dark:border-gray-700 shadow-sm bg-card">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={user.imageUrl} alt={user.fullName || 'User'} />
              <AvatarFallback className="bg-black dark:bg-white text-white dark:text-black">
                {user.firstName?.charAt(0) || user.emailAddresses[0]?.emailAddress.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                {user.fullName || user.firstName || 'User'}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {user.primaryEmailAddress?.emailAddress}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Clerk's built-in UserButton with theme-aware appearance */}
            <UserButton 
              appearance={{
                elements: {
                  avatarBox: "w-8 h-8",
                  userButtonPopoverCard: isDark 
                    ? "shadow-lg border border-gray-800 bg-gray-900" 
                    : "shadow-lg border border-gray-200 bg-white",
                  userButtonPopoverActionButton: isDark 
                    ? "hover:bg-white/10 text-gray-300 hover:text-white transition-colors" 
                    : "hover:bg-black/10 text-gray-600 hover:text-black transition-colors",
                  userButtonPopoverActionButtonText: isDark ? "text-gray-100" : "text-gray-700",
                  userButtonPopoverFooter: "hidden", // Hide the footer
                },
                variables: {
                  colorPrimary: isDark ? '#ffffff' : '#000000',
                  colorBackground: isDark ? '#141517' : '#ffffff',
                  colorText: isDark ? '#f3f4f6' : '#000000',
                  colorTextSecondary: isDark ? '#d1d5db' : '#666666',
                  borderRadius: '6px',
                }
              }}
              afterSignOutUrl="/"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 