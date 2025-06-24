import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

const publicRoutes = [
  '/', // Allow landing page to be public
  '/sign-in',
  '/sign-up',
  '/api/auth',
  '/api/webhooks',
]

const protectedApiRoutes = [
  '/api/templates',
  '/api/gmail',
  '/api/user',
]

export default auth((req) => {
  const { pathname } = req.nextUrl
  
  // Check if it's a public route
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  )
  
  // Check if it's a protected API route
  const isProtectedApiRoute = protectedApiRoutes.some(route =>
    pathname.startsWith(route)
  )
  
  // If it's a protected API route, require authentication
  if (isProtectedApiRoute && !req.auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  // If it's a public route, allow it
  if (isPublicRoute) {
    return NextResponse.next()
  }
  
  // For all other routes, require authentication
  if (!req.auth) {
    const signInUrl = new URL('/sign-in', req.url)
    signInUrl.searchParams.set('callbackUrl', req.url)
    return NextResponse.redirect(signInUrl)
  }
  
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