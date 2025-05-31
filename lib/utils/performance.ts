// Performance monitoring utilities for the template application

interface PerformanceMetric {
  operation: string
  duration: number
  timestamp: number
  metadata?: Record<string, any>
}

interface PerformanceThresholds {
  fast: number      // < 100ms
  moderate: number  // 100-500ms
  slow: number      // 500-1000ms
  // > 1000ms is considered very slow
}

class PerformanceMonitor {
  private static instance: PerformanceMonitor
  private metrics: PerformanceMetric[] = []
  private maxMetrics = 100 // Keep last 100 metrics
  
  // Performance thresholds
  private thresholds: PerformanceThresholds = {
    fast: 100,
    moderate: 500,
    slow: 1000
  }

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor()
    }
    return PerformanceMonitor.instance
  }

  // Start timing an operation
  startTiming(operation: string): { end: (metadata?: Record<string, any>) => number } {
    const startTime = Date.now()
    
    return {
      end: (metadata?: Record<string, any>) => {
        const duration = Date.now() - startTime
        this.recordMetric(operation, duration, metadata)
        return duration
      }
    }
  }

  // Record a metric
  private recordMetric(operation: string, duration: number, metadata?: Record<string, any>) {
    const metric: PerformanceMetric = {
      operation,
      duration,
      timestamp: Date.now(),
      metadata
    }

    // Add to metrics array
    this.metrics.push(metric)
    
    // Keep only the last maxMetrics
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics)
    }

    // Log based on performance level
    this.logMetric(metric)
  }

  // Log metric with appropriate level
  private logMetric(metric: PerformanceMetric) {
    const { operation, duration } = metric
    const level = this.getPerformanceLevel(duration)
    
    const message = `${operation}: ${duration}ms (${level})`
    
    switch (level) {
      case 'fast':
        console.log(`🚀 ${message}`)
        break
      case 'moderate':
        console.log(`⚡ ${message}`)
        break
      case 'slow':
        console.warn(`🐌 ${message}`)
        break
      case 'very-slow':
        console.error(`🚨 ${message}`)
        break
    }
  }

  // Get performance level
  private getPerformanceLevel(duration: number): 'fast' | 'moderate' | 'slow' | 'very-slow' {
    if (duration < this.thresholds.fast) return 'fast'
    if (duration < this.thresholds.moderate) return 'moderate'
    if (duration < this.thresholds.slow) return 'slow'
    return 'very-slow'
  }

  // Get performance summary
  getPerformanceSummary(): {
    totalOperations: number
    averageDuration: number
    fastOperations: number
    moderateOperations: number
    slowOperations: number
    verySlowOperations: number
    recentMetrics: PerformanceMetric[]
  } {
    if (this.metrics.length === 0) {
      return {
        totalOperations: 0,
        averageDuration: 0,
        fastOperations: 0,
        moderateOperations: 0,
        slowOperations: 0,
        verySlowOperations: 0,
        recentMetrics: []
      }
    }

    const totalDuration = this.metrics.reduce((sum, metric) => sum + metric.duration, 0)
    const averageDuration = totalDuration / this.metrics.length

    const levelCounts = this.metrics.reduce((counts, metric) => {
      const level = this.getPerformanceLevel(metric.duration)
      counts[level]++
      return counts
    }, { fast: 0, moderate: 0, slow: 0, 'very-slow': 0 })

    return {
      totalOperations: this.metrics.length,
      averageDuration: Math.round(averageDuration),
      fastOperations: levelCounts.fast,
      moderateOperations: levelCounts.moderate,
      slowOperations: levelCounts.slow,
      verySlowOperations: levelCounts['very-slow'],
      recentMetrics: this.metrics.slice(-10) // Last 10 metrics
    }
  }

  // Clear metrics
  clearMetrics() {
    this.metrics = []
  }

  // Export metrics (for analysis)
  exportMetrics(): PerformanceMetric[] {
    return [...this.metrics]
  }
}

// Helper functions for easy use
export const performanceMonitor = PerformanceMonitor.getInstance()

// Simple timing function
export function timeOperation<T>(
  operation: string,
  fn: () => T | Promise<T>,
  metadata?: Record<string, any>
): T | Promise<T> {
  const timer = performanceMonitor.startTiming(operation)
  
  try {
    const result = fn()
    
    // Handle async operations
    if (result instanceof Promise) {
      return result.finally(() => {
        timer.end(metadata)
      })
    }
    
    // Handle sync operations
    timer.end(metadata)
    return result
  } catch (error) {
    timer.end({ ...metadata, error: true })
    throw error
  }
}

// React hook for performance monitoring
export function usePerformanceMonitor() {
  const startTiming = (operation: string) => {
    return performanceMonitor.startTiming(operation)
  }

  const getStats = () => {
    return performanceMonitor.getPerformanceSummary()
  }

  const clearStats = () => {
    performanceMonitor.clearMetrics()
  }

  return {
    startTiming,
    getStats,
    clearStats,
    timeOperation
  }
}

// Database operation wrapper
export function timeDbOperation<T>(
  operation: string,
  fn: () => Promise<T>,
  metadata?: Record<string, any>
): Promise<T> {
  const result = timeOperation(`DB: ${operation}`, fn, metadata)
  return Promise.resolve(result)
}

// API operation wrapper
export function timeApiOperation<T>(
  operation: string,
  fn: () => Promise<T>,
  metadata?: Record<string, any>
): Promise<T> {
  const result = timeOperation(`API: ${operation}`, fn, metadata)
  return Promise.resolve(result)
}

// Client operation wrapper
export function timeClientOperation<T>(
  operation: string,
  fn: () => T | Promise<T>,
  metadata?: Record<string, any>
): T | Promise<T> {
  return timeOperation(`Client: ${operation}`, fn, metadata)
}

// Performance debugging helper
export function debugPerformance() {
  if (typeof window !== 'undefined') {
    // Client-side debugging
    (window as any).__performanceMonitor = performanceMonitor
    console.log('Performance monitor available at window.__performanceMonitor')
    console.log('Use __performanceMonitor.getPerformanceSummary() to see stats')
  }
}

// Initialize debugging in development
if (process.env.NODE_ENV === 'development') {
  debugPerformance()
} 