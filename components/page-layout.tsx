import { ReactNode } from "react"

interface PageLayoutProps {
  children: ReactNode
}

export function PageLayout({ children }: PageLayoutProps) {
  return (
    <main className="min-h-screen bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto py-6 px-4 md:px-6 lg:px-8">
        {children}
      </div>
    </main>
  )
} 