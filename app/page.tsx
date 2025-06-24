"use client";

import { useSession } from 'next-auth/react'
import { TemplateManagerContainer } from "@/components/template-manager-container"
import { LandingPage } from "@/components/landing-page"

export default function Home() {
  const { data: session, status } = useSession()

  // Show loading state while checking authentication
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-black rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Show landing page for unauthenticated users
  if (status === "unauthenticated") {
    return <LandingPage />
  }

  // Show main app for authenticated users
  return (
    <div className="h-screen w-full">
      <TemplateManagerContainer />
    </div>
  )
}
