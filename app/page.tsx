import { auth } from "@/lib/auth"
import { TemplateManagerContainer } from "@/components/template-manager-container"
import { LandingPage } from "@/components/landing-page"

export default async function Home() {
  // Get session on the server side
  const session = await auth()

  // Show landing page for unauthenticated users
  if (!session) {
    return <LandingPage />
  }

  // Show main app for authenticated users
  return (
    <div className="h-screen w-full">
      <TemplateManagerContainer />
    </div>
  )
}
