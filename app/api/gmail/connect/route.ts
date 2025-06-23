import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { gmailService } from '@/lib/gmail'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('Creating Gmail auth URL for user:', userId)
    const authUrl = gmailService.getAuthUrl(userId)
    console.log('Auth URL created successfully')
    
    return NextResponse.json({ authUrl })
  } catch (error) {
    console.error('Gmail connect error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to initiate Gmail connection'
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
} 