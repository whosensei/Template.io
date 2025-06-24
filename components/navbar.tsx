"use client"

import { Mail } from "lucide-react"
import { useSession, signOut } from "next-auth/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { LogOut } from "lucide-react"
import { ThemeToggle } from "./theme-toggle"

export function Navbar() {
  const { data: session } = useSession()

  return (
    <div className="top-0 z-50 w-full bg-white/90 dark:bg-black/90 backdrop-blur-md pt-4">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between bg-white/95 dark:bg-zinc-900/95 border border-gray-200/80 dark:border-zinc-700/80 rounded-2xl px-8 py-3 backdrop-blur-sm hover:shadow-sm transition-all duration-300">
          {/* Left side - Logo and brand */}
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-br from-gray-900 to-black dark:from-white dark:to-gray-100 rounded-xl flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105">
              <img 
                src="/Email Template App Logo Jun 24 2025 (1).png" 
                alt="Template.io" 
                className="w-6 h-6 object-contain"
              />
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
            {session?.user && (
              <div className="pt-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="w-8 h-8 rounded-full p-0 hover:scale-105 transition-transform duration-200 shadow-md hover:shadow-lg">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={session.user.image || ''} alt={session.user.name || 'User'} />
                        <AvatarFallback className="bg-black dark:bg-white text-white dark:text-black text-xs">
                          {session.user.name?.[0] || session.user.email?.[0] || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    align="end" 
                    className="shadow-2xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 backdrop-blur-md rounded-xl w-48"
                  >
                    <DropdownMenuItem 
                      onClick={() => signOut({ callbackUrl: '/' })}
                      className="cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-800 dark:text-zinc-200 transition-colors duration-200 text-gray-900 dark:bg-zinc-900"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 