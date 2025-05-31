import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isPublicRoute = createRouteMatcher([
  '/', // Allow landing page to be public
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/webhooks(.*)',
])

const isProtectedApiRoute = createRouteMatcher([
  '/api/templates(.*)',
])

export default clerkMiddleware(async (auth, req) => {
  // Protect API routes that require authentication
  if (isProtectedApiRoute(req)) {
    await auth.protect()
  }
  
  // Allow public routes to pass through
  if (isPublicRoute(req)) {
    return NextResponse.next()
  }
  
  // Protect all other routes
  await auth.protect()
  
  return NextResponse.next()
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
} 