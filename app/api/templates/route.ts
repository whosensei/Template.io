import { NextRequest, NextResponse } from 'next/server'
import { TemplateService } from '@/lib/db/templates'

// In-memory cache for templates (persists during serverless container lifecycle)
let templatesCache: any[] | null = null
let cacheTimestamp: number = 0
const CACHE_TTL = 30000 // 30 seconds cache

// Performance monitoring
function logPerformance(operation: string, startTime: number) {
  const duration = Date.now() - startTime
  console.log(`${operation} completed in ${duration}ms`)
  return duration
}

// GET /api/templates - Get all templates with caching
export async function GET() {
  const startTime = Date.now()
  
  try {
    // Check cache first
    const now = Date.now()
    if (templatesCache && (now - cacheTimestamp) < CACHE_TTL) {
      logPerformance('GET /api/templates (cached)', startTime)
      return new NextResponse(JSON.stringify(templatesCache), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=30, stale-while-revalidate=60',
          'X-Cache': 'HIT'
        }
      })
    }

    // Fetch from database
    const templates = await TemplateService.getAllTemplates()
    
    // Update cache
    templatesCache = templates
    cacheTimestamp = now
    
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

// Invalidate cache helper
function invalidateCache() {
  templatesCache = null
  cacheTimestamp = 0
}

// POST /api/templates - Create a new template with cache invalidation
export async function POST(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    const body = await request.json()
    const { name, content, variables } = body

    if (!name || !content) {
      return NextResponse.json(
        { error: 'Name and content are required' },
        { status: 400 }
      )
    }

    // Check if template already exists
    const existingTemplate = await TemplateService.getTemplateByName(name)
    if (existingTemplate) {
      // Update existing template
      const updatedTemplate = await TemplateService.updateTemplate(existingTemplate.id, {
        content,
        variables: variables || {}
      })
      
      // Invalidate cache
      invalidateCache()
      
      logPerformance('POST /api/templates (update)', startTime)
      return NextResponse.json(updatedTemplate)
    }

    // Check template limit
    const templateCount = await TemplateService.getTemplateCount()
    if (templateCount >= 10) {
      return NextResponse.json(
        { error: 'Template limit reached. Maximum 10 templates allowed.' },
        { status: 400 }
      )
    }

    // Create new template
    const newTemplate = await TemplateService.createTemplate({
      name,
      content,
      variables: variables || {}
    })

    // Invalidate cache
    invalidateCache()
    
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