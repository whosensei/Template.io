import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { TemplateService } from '@/lib/db/templates'

// Performance monitoring
function logPerformance(operation: string, startTime: number) {
  const duration = Date.now() - startTime
  console.log(`${operation} completed in ${duration}ms`)
  return duration
}

// GET /api/templates/[id] - Get a specific template
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const startTime = Date.now()
  
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params
    
    const template = await TemplateService.getTemplateById(id, userId)
    
    if (!template) {
      logPerformance('GET /api/templates/[id] (not found)', startTime)
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      )
    }

    logPerformance('GET /api/templates/[id]', startTime)
    
    return new NextResponse(JSON.stringify(template), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=60, stale-while-revalidate=300',
      }
    })
  } catch (error) {
    console.error('Error in GET /api/templates/[id]:', error)
    logPerformance('GET /api/templates/[id] (error)', startTime)
    
    return NextResponse.json(
      { error: 'Failed to fetch template' },
      { status: 500 }
    )
  }
}

// PUT /api/templates/[id] - Update a specific template
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const startTime = Date.now()
  
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params
    const body = await request.json()
    const { name, content, variables } = body

    const updatedTemplate = await TemplateService.updateTemplate(id, userId, {
      name,
      content,
      variables
    })

    logPerformance('PUT /api/templates/[id]', startTime)
    
    return new NextResponse(JSON.stringify(updatedTemplate), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
      }
    })
  } catch (error) {
    console.error('Error in PUT /api/templates/[id]:', error)
    logPerformance('PUT /api/templates/[id] (error)', startTime)
    
    return NextResponse.json(
      { error: 'Failed to update template' },
      { status: 500 }
    )
  }
}

// DELETE /api/templates/[id] - Delete a specific template with optimizations
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const startTime = Date.now()
  
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params
    
    // Validate ID format (basic check)
    if (!id || id.length < 10) {
      return NextResponse.json(
        { error: 'Invalid template ID' },
        { status: 400 }
      )
    }

    // Perform deletion directly - no need to check existence first
    // The delete operation will handle non-existent templates gracefully
    try {
      await TemplateService.deleteTemplate(id, userId)
      
      logPerformance('DELETE /api/templates/[id]', startTime)
      
      return new NextResponse(null, {
        status: 200,
        headers: {
          'Cache-Control': 'no-cache',
          'X-Deleted-Template': id,
        }
      })
    } catch (deleteError: any) {
      // Handle specific delete errors
      if (deleteError.message?.includes('Template not found') || 
          deleteError.message?.includes('not found')) {
        logPerformance('DELETE /api/templates/[id] (not found)', startTime)
        return NextResponse.json(
          { error: 'Template not found' },
          { status: 404 }
        )
      }
      
      // Re-throw other errors to be handled by outer catch
      throw deleteError
    }

  } catch (error) {
    console.error('Error in DELETE /api/templates/[id]:', error)
    logPerformance('DELETE /api/templates/[id] (error)', startTime)
    
    // Provide more specific error messages based on error type
    let errorMessage = 'Failed to delete template'
    if (error instanceof Error) {
      if (error.message.includes('timeout')) {
        errorMessage = 'Database timeout - please try again'
      } else if (error.message.includes('connection')) {
        errorMessage = 'Database connection error - please try again'
      }
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
} 