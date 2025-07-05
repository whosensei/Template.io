import { auth } from "@/lib/auth"
import { TemplateManagerContainer } from "@/components/template-manager-container"
import { LandingPage } from "@/components/landing-page"
import { WelcomeDialogWrapper } from "@/components/welcome-dialog-wrapper"
import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

export default async function Home() {
  // Get session on the server side
  const session = await auth()

  // Show landing page for unauthenticated users
  if (!session) {
    return <LandingPage />
  }

  // Check if user has completed onboarding
  const user = await db
    .select()
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1)

  const userRecord = user[0]
  const showWelcomeDialog = !userRecord?.onboardingCompleted

  // Show main app for authenticated users
  return (
    <div className="h-screen w-full">
      <TemplateManagerContainer />
      <WelcomeDialogWrapper showWelcomeDialog={showWelcomeDialog} />
    </div>
  )
}
