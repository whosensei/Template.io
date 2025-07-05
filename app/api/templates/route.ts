import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { TemplateService } from '@/lib/db/templates'

// Performance monitoring
function logPerformance(operation: string, startTime: number) {
  const duration = Date.now() - startTime
  // console.log(`${operation} completed in ${duration}ms`)
  return duration
}

// GET /api/templates - Get all templates with no caching
export async function GET() {
  const startTime = Date.now()
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    const userId = session.user.id
    // Always fetch from database
    const templates = await TemplateService.getAllTemplates(userId)
    return new NextResponse(JSON.stringify(templates), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
        'X-Cache': 'DISABLED'
      }
    })
  } catch (error) {
    console.error('Error in GET /api/templates:', error)
    return NextResponse.json(
      { error: 'Failed to fetch templates' },
      { status: 500 }
    )
  }
}

// POST /api/templates - Create a new template (no cache invalidation needed)
export async function POST(request: NextRequest) {
  const startTime = Date.now()
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    const userId = session.user.id
    const body = await request.json()
    const { name, content, variables } = body
    if (!name || !content) {
      return NextResponse.json(
        { error: 'Name and content are required' },
        { status: 400 }
      )
    }
    // Check if template already exists for this user
    const existingTemplate = await TemplateService.getTemplateByName(name, userId)
    if (existingTemplate) {
      // Update existing template
      const updatedTemplate = await TemplateService.updateTemplate(existingTemplate.id, userId, {
        content,
        variables: variables || {}
      })
      return NextResponse.json(updatedTemplate, { headers: { 'Cache-Control': 'no-store' } })
    }
    // Check template limit per user
    const userTemplates = await TemplateService.getAllTemplates(userId)
    if (userTemplates.length >= 10) {
      return NextResponse.json(
        { error: 'Template limit reached. Maximum 10 templates allowed.' },
        { status: 400 }
      )
    }
    // Create new template for this user
    const newTemplate = await TemplateService.createTemplate({
      userId,
      name,
      content,
      variables: variables || {}
    })
    return NextResponse.json(newTemplate, { status: 201, headers: { 'Cache-Control': 'no-store' } })
  } catch (error) {
    console.error('Error in POST /api/templates:', error)
    return NextResponse.json(
      { error: 'Failed to create template' },
      { status: 500 }
    )
  }
} 