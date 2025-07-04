import { NextRequest, NextResponse } from 'next/server'
import { gmailService } from '@/lib/gmail'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const state = searchParams.get('state') // This contains the userId
    const error = searchParams.get('error')

    // All logging of sensitive callback info removed

    if (error) {
      console.error('OAuth error from Google:', error)
      return NextResponse.redirect(
        new URL(`/?error=gmail_auth_denied&message=${encodeURIComponent(error)}`, request.url)
      )
    }

    if (!code || !state) {
      console.error('Missing required parameters:', { code: !!code, state: !!state })
      return NextResponse.redirect(
        new URL(`/?error=gmail_auth_missing_params`, request.url)
      )
    }

    const result = await gmailService.handleCallback(code, state)

    if (!result.success) {
      console.error('Gmail callback handling failed:', result.error)
      return NextResponse.redirect(
        new URL(`/?error=gmail_auth_failed&message=${encodeURIComponent(result.error || 'Unknown error')}`, request.url)
      )
    }

    return NextResponse.redirect(
      new URL(`/?gmail_connected=${encodeURIComponent(result.email || 'Unknown')}`, request.url)
    )
  } catch (error) {
    console.error('Gmail callback error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.redirect(
      new URL(`/?error=gmail_auth_error&message=${encodeURIComponent(errorMessage)}`, request.url)
    )
  }
} 