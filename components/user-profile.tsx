"use client"

import { useSession, signOut } from 'next-auth/react'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { LogOut, User, Settings } from 'lucide-react'
import { useTheme } from 'next-themes'

export function UserProfile() {
  const { data: session, status } = useSession()
  const { theme, resolvedTheme } = useTheme()

  // Determine if we're in dark mode
  const isDark = resolvedTheme === 'dark'

  if (status === "loading") {
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

  if (!session?.user) {
    return null
  }

  const user = session.user

  return (
    <Card className="mb-6 border-gray-200 dark:border-gray-700 shadow-sm bg-card">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={user.image || ''} alt={user.name || 'User'} />
              <AvatarFallback className="bg-black dark:bg-white text-white dark:text-black">
                {user.name?.charAt(0) || user.email?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                {user.name || 'User'}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {user.email}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Custom user dropdown menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="w-8 h-8 rounded-full p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={user.image || ''} alt={user.name || 'User'} />
                    <AvatarFallback className="bg-black dark:bg-white text-white dark:text-black text-xs">
                      {user.name?.charAt(0) || user.email?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end" 
                className={`w-48 ${isDark ? 'shadow-lg border border-gray-800 bg-gray-900' : 'shadow-lg border border-gray-200 bg-white'}`}
              >
                <DropdownMenuItem 
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className={`cursor-pointer ${isDark ? 'hover:bg-white/10 text-gray-300 hover:text-white' : 'hover:bg-black/10 text-gray-600 hover:text-black'}`}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 