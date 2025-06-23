import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { userPreferences } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function GET() {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get existing preferences or create default ones
    let preferences = await db
      .select()
      .from(userPreferences)
      .where(eq(userPreferences.userId, userId))
      .limit(1)

    if (preferences.length === 0) {
      // Create default preferences
      const [newPreferences] = await db
        .insert(userPreferences)
        .values({
          userId,
          highlightColor: 'blue',
        })
        .returning()
      
      return NextResponse.json(newPreferences)
    }

    return NextResponse.json(preferences[0])
  } catch (error) {
    console.error('Get preferences error:', error)
    return NextResponse.json(
      { error: 'Failed to get preferences' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { highlightColor } = body

    // Validate highlight color
    const validColors = ['blue', 'purple', 'pink', 'green', 'orange', 'red']
    if (highlightColor && !validColors.includes(highlightColor)) {
      return NextResponse.json(
        { error: 'Invalid highlight color' },
        { status: 400 }
      )
    }

    // Update or create preferences
    const existingPreferences = await db
      .select()
      .from(userPreferences)
      .where(eq(userPreferences.userId, userId))
      .limit(1)

    if (existingPreferences.length === 0) {
      // Create new preferences
      const [newPreferences] = await db
        .insert(userPreferences)
        .values({
          userId,
          highlightColor: highlightColor || 'blue',
        })
        .returning()
      
      return NextResponse.json(newPreferences)
    } else {
      // Update existing preferences
      const [updatedPreferences] = await db
        .update(userPreferences)
        .set({
          highlightColor: highlightColor || existingPreferences[0].highlightColor,
          updatedAt: new Date(),
        })
        .where(eq(userPreferences.userId, userId))
        .returning()
      
      return NextResponse.json(updatedPreferences)
    }
  } catch (error) {
    console.error('Update preferences error:', error)
    return NextResponse.json(
      { error: 'Failed to update preferences' },
      { status: 500 }
    )
  }
} 