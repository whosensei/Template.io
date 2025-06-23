import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { gmailService } from '@/lib/gmail'

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const connections = await gmailService.getConnections(userId)
    
    return NextResponse.json({ connections })
  } catch (error) {
    console.error('Get Gmail connections error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch Gmail connections' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const success = await gmailService.disconnectAccount(userId, email)
    
    if (success) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ error: 'Failed to disconnect account' }, { status: 500 })
    }
  } catch (error) {
    console.error('Disconnect Gmail account error:', error)
    return NextResponse.json(
      { error: 'Failed to disconnect Gmail account' },
      { status: 500 }
    )
  }
} 