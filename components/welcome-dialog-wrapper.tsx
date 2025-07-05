"use client"

import { useState, useEffect } from "react"
import { WelcomeDialog } from "./welcome-dialog"
import { toast } from "sonner"

interface WelcomeDialogWrapperProps {
  showWelcomeDialog: boolean
}

export function WelcomeDialogWrapper({ showWelcomeDialog }: WelcomeDialogWrapperProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isCompleting, setIsCompleting] = useState(false)

  useEffect(() => {
    if (showWelcomeDialog) {
      // Small delay to ensure the page is fully loaded
      const timer = setTimeout(() => {
        setIsOpen(true)
      }, 1000)
      
      return () => clearTimeout(timer)
    }
  }, [showWelcomeDialog])

  const handleComplete = async () => {
    setIsCompleting(true)
    try {
      const response = await fetch('/api/user/onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        setIsOpen(false)
        toast.success('Welcome to Template.io! 🎉')
      } else {
        throw new Error('Failed to complete onboarding')
      }
    } catch (error) {
      console.error('Error completing onboarding:', error)
      toast.error('Failed to complete onboarding')
    } finally {
      setIsCompleting(false)
    }
  }

  const handleClose = () => {
    setIsOpen(false)
  }

  if (!showWelcomeDialog) {
    return null
  }

  return (
    <WelcomeDialog
      isOpen={isOpen}
      onClose={handleClose}
      onComplete={handleComplete}
    />
  )
} 