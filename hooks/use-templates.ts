"use client"

import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { useToast } from "@/hooks/use-toast"

export interface Template {
  id: string
  name: string
  content: string
  variables: Record<string, string>
  createdAt?: string
  updatedAt?: string
}

// Client-side cache with TTL
interface CacheEntry {
  data: Template[]
  timestamp: number
  etag?: string
}

// Utility function to deduplicate templates by ID
function deduplicateTemplates(templates: Template[]): Template[] {
  const seen = new Set<string>()
  const deduped: Template[] = []
  
  for (const template of templates) {
    if (!seen.has(template.id)) {
      seen.add(template.id)
      deduped.push(template)
    }
  }
  
  return deduped
}

// Advanced cache manager
class TemplateCache {
  private static instance: TemplateCache
  private cache: CacheEntry | null = null
  private readonly TTL = 30000 // 30 seconds
  private refreshPromise: Promise<Template[]> | null = null
  
  static getInstance() {
    if (!TemplateCache.instance) {
      TemplateCache.instance = new TemplateCache()
    }
    return TemplateCache.instance
  }
  
  isValid(): boolean {
    if (!this.cache) return false
    return (Date.now() - this.cache.timestamp) < this.TTL
  }
  
  get(): Template[] | null {
    return this.isValid() ? this.cache!.data : null
  }
  
  set(data: Template[], etag?: string) {
    // Always deduplicate before caching
    const dedupedData = deduplicateTemplates(data)
    this.cache = {
      data: dedupedData,
      timestamp: Date.now(),
      etag
    }
  }
  
  invalidate() {
    this.cache = null
    this.refreshPromise = null
  }
  
  getEtag(): string | undefined {
    return this.cache?.etag
  }
  
  setRefreshPromise(promise: Promise<Template[]>) {
    this.refreshPromise = promise
  }
  
  getRefreshPromise(): Promise<Template[]> | null {
    return this.refreshPromise
  }
}

// Helper function to parse template content with subject
const parseTemplateContent = (content: string) => {
  const subjectMatch = content.match(/^Subject: (.+)\n\n([\s\S]*)$/)
  if (subjectMatch) {
    return {
      subject: subjectMatch[1],
      template: subjectMatch[2]
    }
  }
  return {
    subject: '',
    template: content
  }
}

// Performance monitoring
const usePerformanceMonitor = () => {
  const logOperation = useCallback((operation: string, duration: number) => {
    if (duration > 1000) {
      console.warn(`Slow operation detected: ${operation} took ${duration}ms`)
    } else {
      console.log(`${operation} completed in ${duration}ms`)
    }
  }, [])
  
  return { logOperation }
}

export function useTemplates() {
  const [templates, setTemplatesRaw] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [backgroundRefreshing, setBackgroundRefreshing] = useState(false)
  const { toast } = useToast()
  const { logOperation } = usePerformanceMonitor()
  const cache = useMemo(() => TemplateCache.getInstance(), [])
  const abortControllerRef = useRef<AbortController | null>(null)
  
  // Wrapper function to always deduplicate when setting templates
  const setTemplates = useCallback((templates: Template[] | ((prev: Template[]) => Template[])) => {
    setTemplatesRaw(prev => {
      const newTemplates = typeof templates === 'function' ? templates(prev) : templates
      const deduplicated = deduplicateTemplates(newTemplates)
      
      // Log if we found duplicates
      if (deduplicated.length !== newTemplates.length) {
        console.warn(`Removed ${newTemplates.length - deduplicated.length} duplicate templates`)
      }
      
      return deduplicated
    })
  }, [])
  
  // Optimized fetch with caching, retry logic, and performance monitoring
  const fetchTemplates = useCallback(async (forceRefresh = false): Promise<Template[]> => {
    const startTime = Date.now()
    
    // Cancel any existing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    
    // Create new abort controller
    abortControllerRef.current = new AbortController()
    
    try {
      // Check cache first (unless force refresh)
      if (!forceRefresh) {
        const cachedData = cache.get()
        if (cachedData) {
          logOperation('Template fetch (cache hit)', Date.now() - startTime)
          return cachedData
        }
        
        // Check if refresh is already in progress
        const refreshPromise = cache.getRefreshPromise()
        if (refreshPromise) {
          return await refreshPromise
        }
      }
      
      // Prepare headers for conditional requests
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      }
      
      const etag = cache.getEtag()
      if (etag && !forceRefresh) {
        headers['If-None-Match'] = etag
      }
      
      // Create fetch promise
      const fetchPromise = fetch('/api/templates', {
        headers,
        signal: abortControllerRef.current.signal,
        // Add cache busting for force refresh
        cache: forceRefresh ? 'no-cache' : 'default'
      }).then(async (response) => {
        if (response.status === 304) {
          // Not modified, use cache
          const cachedData = cache.get()
          if (cachedData) {
            logOperation('Template fetch (304 not modified)', Date.now() - startTime)
            return cachedData
          }
        }
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }
        
        const data = await response.json()
        const newEtag = response.headers.get('etag')
        
        // Deduplicate and update cache
        const dedupedData = deduplicateTemplates(data)
        cache.set(dedupedData, newEtag || undefined)
        
        logOperation('Template fetch (server)', Date.now() - startTime)
        return dedupedData
      })
      
      // Store promise for deduplication
      cache.setRefreshPromise(fetchPromise)
      
      const data = await fetchPromise
      setTemplates(data)
      setError(null)
      return data
      
    } catch (error: any) {
      // Handle abort gracefully
      if (error.name === 'AbortError') {
        logOperation('Template fetch (aborted)', Date.now() - startTime)
        throw error
      }
      
      console.error('Error fetching templates:', error)
      logOperation('Template fetch (error)', Date.now() - startTime)
      
      // Use cache as fallback if available
      const cachedData = cache.get()
      if (cachedData && !forceRefresh) {
        console.log('Using cached data as fallback')
        return cachedData
      }
      
      setError(error.message || 'Failed to fetch templates')
      throw error
    } finally {
      abortControllerRef.current = null
    }
  }, [cache, logOperation])

  // Background refresh without affecting loading state
  const backgroundRefresh = useCallback(async () => {
    try {
      setBackgroundRefreshing(true)
      await fetchTemplates(true)
    } catch (error) {
      console.error('Background refresh failed:', error)
    } finally {
      setBackgroundRefreshing(false)
    }
  }, [fetchTemplates])

  // Load templates with smart caching
  useEffect(() => {
    let isMounted = true
    
    const loadTemplates = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Check cache first for instant loading
        const cachedData = cache.get()
        if (cachedData) {
          setTemplates(cachedData)
          setLoading(false)
          
          // Start background refresh if cache is getting stale
          const cacheAge = Date.now() - (cache as any).cache?.timestamp || 0
          if (cacheAge > 15000) { // Refresh if cache is > 15 seconds old
            backgroundRefresh()
          }
          return
        }
        
        // Fetch from server
        await fetchTemplates()
        
      } catch (error: any) {
        if (error.name !== 'AbortError' && isMounted) {
          console.error('Failed to load templates:', error)
          toast({
            title: "Error",
            description: "Failed to load templates. Please refresh the page.",
            variant: "destructive",
          })
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }
    
    loadTemplates()
    
    return () => {
      isMounted = false
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [cache, fetchTemplates, backgroundRefresh, toast])

  // Optimistic update for save operation
  const saveTemplate = useCallback(async (
    name: string,
    content: string,
    variables: Record<string, string>
  ) => {
    const startTime = Date.now()
    
    // Declare tempTemplate outside try block so it's accessible in catch
    const tempTemplate: Template = {
      id: `temp-${Date.now()}`,
      name,
      content,
      variables,
      createdAt: new Date().toISOString()
    }
    
    try {
      // Optimistic update - add temporary template immediately
      setTemplates(prev => [tempTemplate, ...prev])
      
      const response = await fetch('/api/templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          content,
          variables
        })
      })

      const data = await response.json()

      if (response.ok) {
        // Replace temp template with real one
        setTemplates(prev => 
          prev.map(t => t.id === tempTemplate.id ? data : t)
        )
        
        // Update cache with the new template data
        const currentCachedData = cache.get()
        if (currentCachedData) {
          const updatedCacheData = currentCachedData.map(t => 
            t.name === data.name ? data : t
          )
          // If it's a new template (not an update), add it to cache
          if (!currentCachedData.find(t => t.name === data.name)) {
            updatedCacheData.unshift(data)
          }
          cache.set(updatedCacheData)
        } else {
          // If no cache, invalidate it so next fetch will be fresh
          cache.invalidate()
        }
        
        logOperation('Template save', Date.now() - startTime)
        
        toast({
          title: "Template Saved",
          description: "Your template has been saved successfully.",
        })
      } else {
        // Remove temp template on error
        setTemplates(prev => prev.filter(t => t.id !== tempTemplate.id))
        
        toast({
          title: "Error",
          description: data.error || "Failed to save template",
          variant: "destructive",
        })
      }
    } catch (error) {
      // Remove temp template on error - fix the bug here too
      setTemplates(prev => prev.filter(t => t.id !== tempTemplate.id))
      
      console.error('Error saving template:', error)
      logOperation('Template save (error)', Date.now() - startTime)
      
      toast({
        title: "Error",
        description: "Failed to save template",
        variant: "destructive",
      })
    }
  }, [cache, toast, logOperation])

  // Update existing template by ID
  const updateTemplate = useCallback(async (
    id: string,
    name: string,
    content: string,
    variables: Record<string, string>
  ) => {
    const startTime = Date.now()
    
    try {
      // Find the original template for rollback
      const originalTemplate = templates.find(t => t.id === id)
      if (!originalTemplate) {
        throw new Error('Template not found')
      }
      
      // Optimistic update - update immediately
      const updatedTemplate = {
        ...originalTemplate,
        name,
        content,
        variables,
        updatedAt: new Date().toISOString()
      }
      
      setTemplates(prev => 
        prev.map(t => t.id === id ? updatedTemplate : t)
      )
      
      const response = await fetch(`/api/templates/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          content,
          variables
        })
      })

      const data = await response.json()

      if (response.ok) {
        // Update with real data from server
        setTemplates(prev => 
          prev.map(t => t.id === id ? data : t)
        )
        
        // Update cache
        const currentCachedData = cache.get()
        if (currentCachedData) {
          const updatedCacheData = currentCachedData.map(t => 
            t.id === id ? data : t
          )
          cache.set(updatedCacheData)
        } else {
          cache.invalidate()
        }
        
        logOperation('Template update', Date.now() - startTime)
        
        toast({
          title: "Template Updated",
          description: "Your template has been updated successfully.",
        })
        
        return data
      } else {
        // Rollback optimistic update on error
        setTemplates(prev => 
          prev.map(t => t.id === id ? originalTemplate : t)
        )
        
        toast({
          title: "Error",
          description: data.error || "Failed to update template",
          variant: "destructive",
        })
        throw new Error(data.error || "Failed to update template")
      }
    } catch (error) {
      // Rollback optimistic update on error
      const originalTemplate = templates.find(t => t.id === id)
      if (originalTemplate) {
        setTemplates(prev => 
          prev.map(t => t.id === id ? originalTemplate : t)
        )
      }
      
      console.error('Error updating template:', error)
      logOperation('Template update (error)', Date.now() - startTime)
      
      toast({
        title: "Error",
        description: "Failed to update template",
        variant: "destructive",
      })
      throw error
    }
  }, [templates, cache, toast, logOperation])

  const loadTemplate = useCallback((id: string) => {
    const template = templates.find((t) => t.id === id)
    if (template) {
      const parsed = parseTemplateContent(template.content)
      return {
        template: parsed.template,
        subject: parsed.subject,
        variables: template.variables
      }
    }
    return null
  }, [templates])

  // Optimistic delete with improved error handling
  const deleteTemplate = useCallback(async (id: string) => {
    const startTime = Date.now()
    
    try {
      // Optimistic update - remove immediately
      const templateToDelete = templates.find(t => t.id === id)
      if (!templateToDelete) {
        toast({
          title: "Error",
          description: "Template not found in current list",
          variant: "destructive",
        })
        return
      }
      
      setTemplates(prev => prev.filter(t => t.id !== id))
      
      const response = await fetch(`/api/templates/${id}`, {
        method: 'DELETE',
        // Add timeout for the request
        signal: AbortSignal.timeout(10000) // 10 second timeout
      })

      if (response.ok) {
        // Invalidate cache
        cache.invalidate()
        
        logOperation('Template delete', Date.now() - startTime)
        
        toast({
          title: "Template Deleted",
          description: "The template has been removed successfully.",
        })
      } else {
        // Restore template on error
        setTemplates(prev => [templateToDelete, ...prev])
        
        const data = await response.json()
        let errorMessage = data.error || "Failed to delete template"
        
        // Provide more user-friendly error messages
        if (response.status === 404) {
          errorMessage = "Template not found - it may have already been deleted"
        } else if (response.status >= 500) {
          errorMessage = "Server error - please try again in a moment"
        }
        
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        })
      }
    } catch (error: any) {
      // Restore template on error
      const templateToDelete = templates.find(t => t.id === id)
      if (templateToDelete) {
        setTemplates(prev => [templateToDelete, ...prev])
      } else {
        // If we can't find the template, refresh the list
        await fetchTemplates(true)
      }
      
      console.error('Error deleting template:', error)
      logOperation('Template delete (error)', Date.now() - startTime)
      
      // Provide specific error messages based on error type
      let errorMessage = "Failed to delete template"
      if (error.name === 'TimeoutError' || error.message?.includes('timeout')) {
        errorMessage = "Request timed out - please check your connection and try again"
      } else if (error.name === 'AbortError') {
        errorMessage = "Request was cancelled - please try again"
      } else if (error.message?.includes('fetch')) {
        errorMessage = "Network error - please check your connection"
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    }
  }, [templates, fetchTemplates, cache, toast, logOperation])

  // Force refresh function
  const refetch = useCallback(async () => {
    try {
      setLoading(true)
      await fetchTemplates(true)
    } finally {
      setLoading(false)
    }
  }, [fetchTemplates])

  return {
    templates,
    loading,
    error,
    backgroundRefreshing,
    saveTemplate,
    updateTemplate,
    loadTemplate,
    deleteTemplate,
    parseTemplateContent,
    refetch,
    // Expose cache stats for debugging
    cacheStats: {
      isValid: cache.isValid(),
      hasData: !!cache.get()
    }
  }
} 