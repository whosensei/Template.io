import { eq, and } from 'drizzle-orm'
import { getDbAsync } from './index'
import { templates } from './schema'

// Interface for template data
export interface Template {
  id: string
  userId: string // Required again - migration complete
  name: string
  content: string
  variables: Record<string, string>
  createdAt: string
  updatedAt: string
}

// Performance monitoring for database operations
function logDbOperation(operation: string, startTime: number) {
  const duration = Date.now() - startTime
  if (duration > 500) {
    console.warn(`Slow DB operation: ${operation} took ${duration}ms`)
  } else {
    console.log(`DB ${operation} completed in ${duration}ms`)
  }
}

// Add retry utility for database operations
const retryOperation = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 2,
  delay: number = 1000
): Promise<T> => {
  let lastError: Error
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation()
    } catch (error) {
      lastError = error as Error
      
      // Don't retry logical errors like "not found"
      if (error instanceof Error && 
          (error.message.includes('Template not found') || 
           error.message.includes('not found') ||
           error.message.includes('Invalid'))) {
        throw error
      }
      
      // Don't retry on the last attempt
      if (attempt === maxRetries) {
        break
      }
      
      console.log(`Database operation failed (attempt ${attempt + 1}/${maxRetries + 1}), retrying in ${delay}ms...`)
      await new Promise(resolve => setTimeout(resolve, delay))
      
      // Exponential backoff
      delay *= 2
    }
  }
  
  throw lastError!
}

// Template service with optimized queries
export class TemplateService {
  // Get all templates with performance monitoring and retry logic
  static async getAllTemplates(userId: string): Promise<Template[]> {
    const startTime = Date.now()
    
    console.log('[TemplateService.getAllTemplates] Querying for userId:', userId)
    
    return retryOperation(async () => {
      try {
        const db = await getDbAsync() // Use async version for better performance
        
        if (!db) {
          throw new Error('Database connection failed')
        }
        
        // Optimized query with explicit field selection and user filtering
        // During migration, also include templates with null userId (legacy templates)
        const result = await db
          .select({
            id: templates.id,
            userId: templates.userId,
            name: templates.name,
            content: templates.content,
            variables: templates.variables,
            createdAt: templates.createdAt,
            updatedAt: templates.updatedAt,
          })
          .from(templates)
          .where(eq(templates.userId, userId))
          .orderBy(templates.updatedAt) // Order by updated time for better UX
          .limit(50) // Reasonable limit to prevent huge responses
        
        console.log('[TemplateService.getAllTemplates] Found', result.length, 'templates for userId:', userId)
        
        // Convert timestamps to ISO strings
        const formattedResult = result.map(template => ({
          ...template,
          variables: template.variables as Record<string, string>,
          createdAt: template.createdAt.toISOString(),
          updatedAt: template.updatedAt.toISOString(),
        }))
        
        logDbOperation('getAllTemplates', startTime)
        return formattedResult
      } catch (error) {
        logDbOperation('getAllTemplates (error)', startTime)
        console.error('Error fetching templates:', error)
        throw new Error('Failed to fetch templates')
      }
    })
  }

  // Get a template by ID with optimized query
  static async getTemplateById(id: string, userId: string): Promise<Template | null> {
    const startTime = Date.now()
    try {
      const db = await getDbAsync()
      
      if (!db) {
        throw new Error('Database connection failed')
      }
      
      // Optimized single query with explicit fields and user filtering
      const result = await db
        .select({
          id: templates.id,
          userId: templates.userId,
          name: templates.name,
          content: templates.content,
          variables: templates.variables,
          createdAt: templates.createdAt,
          updatedAt: templates.updatedAt,
        })
        .from(templates)
        .where(and(eq(templates.id, id), eq(templates.userId, userId)))
        .limit(1)
      
      if (!result[0]) {
        logDbOperation('getTemplateById', startTime)
        return null
      }
      
      // Convert timestamps to ISO strings
      const template = {
        ...result[0],
        variables: result[0].variables as Record<string, string>,
        createdAt: result[0].createdAt.toISOString(),
        updatedAt: result[0].updatedAt.toISOString(),
      }
      
      logDbOperation('getTemplateById', startTime)
      return template
    } catch (error) {
      logDbOperation('getTemplateById (error)', startTime)
      console.error('Error fetching template:', error)
      throw new Error('Failed to fetch template')
    }
  }

  // Create template with optimized insert
  static async createTemplate(data: {
    userId: string // Make required again
    name: string
    content: string
    variables: Record<string, string>
  }): Promise<Template> {
    const startTime = Date.now()
    try {
      const db = await getDbAsync()
      
      if (!db) {
        throw new Error('Database connection failed')
      }
      
      // Validate userId is provided
      if (!data.userId) {
        throw new Error('User ID is required')
      }
      
      // Let the database handle timestamps with defaultNow()
      const newTemplate = {
        userId: data.userId,
        name: data.name,
        content: data.content,
        variables: data.variables,
      }
      
      // Insert and return the created template
      const result = await db.insert(templates).values(newTemplate).returning()
      
      if (!result[0]) {
        throw new Error('Failed to create template - no result returned')
      }
      
      // Convert timestamps to ISO strings
      const createdTemplate = {
        ...result[0],
        variables: result[0].variables as Record<string, string>,
        createdAt: result[0].createdAt.toISOString(),
        updatedAt: result[0].updatedAt.toISOString(),
      }
      
      logDbOperation('createTemplate', startTime)
      return createdTemplate
    } catch (error) {
      logDbOperation('createTemplate (error)', startTime)
      console.error('Error creating template:', error)
      throw new Error('Failed to create template')
    }
  }

  // Update template with optimized query and retry logic
  static async updateTemplate(
    id: string,
    userId: string,
    data: {
      name?: string
      content?: string
      variables?: Record<string, string>
    }
  ): Promise<Template> {
    const startTime = Date.now()
    
    return retryOperation(async () => {
      try {
        const db = await getDbAsync()
        
        if (!db) {
          throw new Error('Database connection failed')
        }
        
        // Prepare update data with proper timestamp handling
        const updateData: any = {
          ...data,
          updatedAt: new Date(), // Use Date object, not string
        }
        
        // Optimized update with returning and user filtering
        const result = await db
          .update(templates)
          .set(updateData)
          .where(and(eq(templates.id, id), eq(templates.userId, userId)))
          .returning()
        
        if (!result[0]) {
          throw new Error('Template not found')
        }
        
        // Convert timestamps to ISO strings
        const updatedTemplate = {
          ...result[0],
          variables: result[0].variables as Record<string, string>,
          createdAt: result[0].createdAt.toISOString(),
          updatedAt: result[0].updatedAt.toISOString(),
        }
        
        logDbOperation('updateTemplate', startTime)
        return updatedTemplate
      } catch (error) {
        logDbOperation('updateTemplate (error)', startTime)
        console.error('Error updating template:', error)
        throw new Error('Failed to update template')
      }
    })
  }

  // Delete template with optimized query and retry logic
  static async deleteTemplate(id: string, userId: string): Promise<{ deleted: boolean; count: number }> {
    const startTime = Date.now()
    
    return retryOperation(async () => {
      try {
        const db = await getDbAsync()
        
        if (!db) {
          throw new Error('Database connection failed')
        }
        
        // Optimized delete with returning to check if anything was deleted and user filtering
        const result = await db
          .delete(templates)
          .where(and(eq(templates.id, id), eq(templates.userId, userId)))
          .returning({ id: templates.id })
        
        const deletedCount = result.length
        const wasDeleted = deletedCount > 0
        
        if (!wasDeleted) {
          logDbOperation('deleteTemplate (not found)', startTime)
          throw new Error('Template not found')
        }
        
        logDbOperation('deleteTemplate', startTime)
        return { deleted: wasDeleted, count: deletedCount }
      } catch (error) {
        logDbOperation('deleteTemplate (error)', startTime)
        console.error('Error deleting template:', error)
        
        // Re-throw the original error if it's already a "not found" error
        if (error instanceof Error && error.message.includes('Template not found')) {
          throw error
        }
        
        throw new Error('Failed to delete template')
      }
    })
  }

  // Get templates by name with optimized search and retry logic
  static async getTemplateByName(name: string, userId: string): Promise<Template | null> {
    const startTime = Date.now()
    
    return retryOperation(async () => {
      try {
        const db = await getDbAsync()
        
        if (!db) {
          throw new Error('Database connection failed')
        }
        
        // Optimized name search with user filtering
        const result = await db
          .select({
            id: templates.id,
            userId: templates.userId,
            name: templates.name,
            content: templates.content,
            variables: templates.variables,
            createdAt: templates.createdAt,
            updatedAt: templates.updatedAt,
          })
          .from(templates)
          .where(and(eq(templates.name, name), eq(templates.userId, userId)))
          .limit(1)
        
        if (!result[0]) {
          logDbOperation('getTemplateByName', startTime)
          return null
        }
        
        // Convert timestamps to ISO strings
        const template = {
          ...result[0],
          variables: result[0].variables as Record<string, string>,
          createdAt: result[0].createdAt.toISOString(),
          updatedAt: result[0].updatedAt.toISOString(),
        }
        
        logDbOperation('getTemplateByName', startTime)
        return template
      } catch (error) {
        logDbOperation('getTemplateByName (error)', startTime)
        console.error('Error fetching template by name:', error)
        throw new Error('Failed to fetch template by name')
      }
    })
  }

  // Count total templates with optimized query
  static async getTemplateCount(): Promise<number> {
    const startTime = Date.now()
    try {
      const db = await getDbAsync()
      
      if (!db) {
        throw new Error('Database connection failed')
      }
      
      // Optimized count query
      const result = await db
        .select({ count: templates.id })
        .from(templates)
      
      logDbOperation('getTemplateCount', startTime)
      return result.length
    } catch (error) {
      logDbOperation('getTemplateCount (error)', startTime)
      console.error('Error counting templates:', error)
      throw new Error('Failed to count templates')
    }
  }

  // Batch operations for better performance
  static async createMultipleTemplates(userId: string, templatesData: Array<{
    name: string
    content: string
    variables: Record<string, string>
  }>): Promise<Template[]> {
    const startTime = Date.now()
    try {
      const db = await getDbAsync()
      
      if (!db) {
        throw new Error('Database connection failed')
      }
      
      // Prepare batch data (let database handle timestamps)
      const batchData = templatesData.map(data => ({
        userId: userId,
        name: data.name,
        content: data.content,
        variables: data.variables,
      }))
      
      // Batch insert with returning
      const result = await db.insert(templates).values(batchData).returning()
      
      // Convert timestamps to ISO strings
      const createdTemplates = result.map(template => ({
        ...template,
        variables: template.variables as Record<string, string>,
        createdAt: template.createdAt.toISOString(),
        updatedAt: template.updatedAt.toISOString(),
      }))
      
      logDbOperation('createMultipleTemplates', startTime)
      return createdTemplates
    } catch (error) {
      logDbOperation('createMultipleTemplates (error)', startTime)
      console.error('Error creating multiple templates:', error)
      throw new Error('Failed to create multiple templates')
    }
  }

  // Health check for database connection
  static async healthCheck(): Promise<boolean> {
    const startTime = Date.now()
    try {
      const db = await getDbAsync()
      
      if (!db) {
        throw new Error('Database connection failed')
      }
      
      await db.select({ check: templates.id }).from(templates).limit(1)
      
      logDbOperation('healthCheck', startTime)
      return true
    } catch (error) {
      logDbOperation('healthCheck (error)', startTime)
      console.error('Database health check failed:', error)
      return false
    }
  }
} 