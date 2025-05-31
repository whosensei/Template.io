"use client"

import { UserButton, useUser } from '@clerk/nextjs'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { LogOut, User } from 'lucide-react'

export function UserProfile() {
  const { user, isLoaded } = useUser()

  if (!isLoaded) {
    return (
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded animate-pulse mb-2" />
              <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3" />
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
    <Card className="mb-6 border-gray-200 shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={user.imageUrl} alt={user.fullName || 'User'} />
              <AvatarFallback className="bg-black text-white">
                {user.firstName?.charAt(0) || user.emailAddresses[0]?.emailAddress.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">
                {user.fullName || user.firstName || 'User'}
              </h3>
              <p className="text-sm text-gray-600">
                {user.primaryEmailAddress?.emailAddress}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Clerk's built-in UserButton with custom appearance */}
            <UserButton 
              appearance={{
                elements: {
                  avatarBox: "w-8 h-8",
                  userButtonPopoverCard: "shadow-lg border border-gray-200",
                  userButtonPopoverActionButton: "hover:bg-gray-50",
                  userButtonPopoverActionButtonText: "text-gray-700",
                  userButtonPopoverFooter: "hidden", // Hide the footer
                },
                variables: {
                  colorPrimary: '#000000',
                  colorBackground: '#ffffff',
                  colorText: '#000000',
                  colorTextSecondary: '#666666',
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