"use client";

import { useUser } from '@clerk/nextjs'
import { PageLayout } from "@/components/page-layout"
import { TemplateManagerContainer } from "@/components/template-manager-container"
import { UserProfile } from "@/components/user-profile"
import { LandingPage } from "@/components/landing-page"
import { Navbar } from "@/components/navbar"

export default function Home() {
  const { isSignedIn, isLoaded } = useUser()

  // Show loading state while checking authentication
  if (!isLoaded) {
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
  if (!isSignedIn) {
    return <LandingPage />
  }

  // Show main app for authenticated users
  return (
    <>
      <Navbar />
      <PageLayout>
        <TemplateManagerContainer />
      </PageLayout>
    </>
  )
}
