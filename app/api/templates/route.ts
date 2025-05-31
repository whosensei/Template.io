import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { TemplateService } from '@/lib/db/templates'

// In-memory cache for templates per user (persists during serverless container lifecycle)
let templatesCache: Map<string, any[]> = new Map()
let cacheTimestamps: Map<string, number> = new Map()
const CACHE_TTL = 30000 // 30 seconds cache

// Performance monitoring
function logPerformance(operation: string, startTime: number) {
  const duration = Date.now() - startTime
  console.log(`${operation} completed in ${duration}ms`)
  return duration
}

// GET /api/templates - Get all templates with caching per user
export async function GET() {
  const startTime = Date.now()
  
  try {
    const { userId } = await auth()
    
    console.log('[GET /api/templates] Clerk userId:', userId)
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check cache first
    const now = Date.now()
    const userCache = templatesCache.get(userId)
    const userCacheTimestamp = cacheTimestamps.get(userId) || 0
    
    if (userCache && (now - userCacheTimestamp) < CACHE_TTL) {
      logPerformance('GET /api/templates (cached)', startTime)
      console.log('[GET /api/templates] Returning cached templates for user:', userId, 'count:', userCache.length)
      return new NextResponse(JSON.stringify(userCache), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=30, stale-while-revalidate=60',
          'X-Cache': 'HIT'
        }
      })
    }

    // Fetch from database for specific user
    const templates = await TemplateService.getAllTemplates(userId)
    console.log('[GET /api/templates] Fetched templates from DB for user:', userId, 'count:', templates.length)
    
    // Update cache for this user
    templatesCache.set(userId, templates)
    cacheTimestamps.set(userId, now)
    
    logPerformance('GET /api/templates (database)', startTime)
    
    return new NextResponse(JSON.stringify(templates), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=30, stale-while-revalidate=60',
        'X-Cache': 'MISS'
      }
    })
  } catch (error) {
    console.error('Error in GET /api/templates:', error)
    logPerformance('GET /api/templates (error)', startTime)
    
    return NextResponse.json(
      { error: 'Failed to fetch templates' },
      { status: 500 }
    )
  }
}

// Invalidate cache helper for specific user
function invalidateUserCache(userId: string) {
  templatesCache.delete(userId)
  cacheTimestamps.delete(userId)
}

// POST /api/templates - Create a new template with cache invalidation
export async function POST(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    const { userId } = await auth()
    
    console.log('[POST /api/templates] Clerk userId:', userId)
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

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
      console.log('[POST /api/templates] Updating existing template for user:', userId, 'template:', existingTemplate.id)
      // Update existing template
      const updatedTemplate = await TemplateService.updateTemplate(existingTemplate.id, userId, {
        content,
        variables: variables || {}
      })
      
      // Invalidate cache for this user
      invalidateUserCache(userId)
      
      logPerformance('POST /api/templates (update)', startTime)
      return NextResponse.json(updatedTemplate)
    }

    // Check template limit per user
    const userTemplates = await TemplateService.getAllTemplates(userId)
    if (userTemplates.length >= 10) {
      return NextResponse.json(
        { error: 'Template limit reached. Maximum 10 templates allowed.' },
        { status: 400 }
      )
    }

    console.log('[POST /api/templates] Creating new template for user:', userId, 'name:', name)
    // Create new template for this user
    const newTemplate = await TemplateService.createTemplate({
      userId,
      name,
      content,
      variables: variables || {}
    })

    console.log('[POST /api/templates] Created template:', newTemplate.id, 'for user:', newTemplate.userId)

    // Invalidate cache for this user
    invalidateUserCache(userId)
    
    logPerformance('POST /api/templates (create)', startTime)
    return NextResponse.json(newTemplate, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/templates:', error)
    logPerformance('POST /api/templates (error)', startTime)
    
    return NextResponse.json(
      { error: 'Failed to create template' },
      { status: 500 }
    )
  }
} 