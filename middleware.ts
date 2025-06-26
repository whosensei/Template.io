import { NextRequest, NextResponse } from 'next/server'

const publicRoutes = [
  '/', // Allow landing page to be public
  '/sign-in',
  '/sign-up',
  '/api/auth',
  '/api/webhooks',
  '/privacy',
  '/terms',
  '/_next',
  '/favicon.ico',
]

const protectedApiRoutes = [
  '/api/templates',
  '/api/gmail',
  '/api/user',
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Check if it's a public route
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  )
  
  // Check if it's a protected API route - for now, let the API routes handle their own auth
  const isProtectedApiRoute = protectedApiRoutes.some(route =>
    pathname.startsWith(route)
  )
  
  // If it's a public route, allow it
  if (isPublicRoute) {
    return NextResponse.next()
  }
  
  // For protected API routes, let them handle their own authentication
  if (isProtectedApiRoute) {
    return NextResponse.next()
  }
  
  // For all other routes, redirect to sign-in (NextAuth will handle session checking)
  const signInUrl = new URL('/sign-in', request.url)
  signInUrl.searchParams.set('callbackUrl', request.url)
  return NextResponse.redirect(signInUrl)
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
} 