import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { gmailService } from '@/lib/gmail'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const userId = session.user.id

    // All logging of sensitive info removed
    const authUrl = gmailService.getAuthUrl(userId)
    
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