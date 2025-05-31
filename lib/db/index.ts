import { drizzle } from 'drizzle-orm/neon-serverless'
import { Pool, neonConfig } from '@neondatabase/serverless'
import * as schema from './schema'

// Advanced singleton pattern with connection warming
let cachedDb: ReturnType<typeof drizzle> | null = null
let cachedPool: Pool | null = null
let isWarmingUp = false

// Connection pool configuration for optimal performance
const POOL_CONFIG = {
  connectionString: process.env.DATABASE_URL!,
  connectionTimeoutMillis: 5000,
  max: 10, // Maximum connections in pool
  idleTimeoutMillis: 30000, // 30s idle timeout
  maxUses: 7500, // Maximum uses per connection
}

async function warmUpConnection() {
  if (isWarmingUp || cachedDb) return cachedDb
  
  isWarmingUp = true
  try {
    // Create optimized pool
    cachedPool = new Pool(POOL_CONFIG)
    cachedDb = drizzle(cachedPool, { schema })
    
    // Warm up with a simple query
    await cachedDb.execute('SELECT 1' as any)
    
    console.log('Database connection warmed up successfully')
    return cachedDb
  } catch (error) {
    console.error('Failed to warm up database connection:', error)
    // Reset on error
    cachedDb = null
    cachedPool = null
    throw error
  } finally {
    isWarmingUp = false
  }
}

export function getDb() {
  if (cachedDb) {
    return cachedDb
  }

  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set')
  }

  // Synchronously create if not exists, but this should be avoided
  cachedPool = new Pool(POOL_CONFIG)
  cachedDb = drizzle(cachedPool, { schema })
  
  return cachedDb
}

// Async version for better performance
export async function getDbAsync() {
  if (cachedDb) {
    return cachedDb
  }
  
  return await warmUpConnection()
}

// Export the database instance using singleton pattern
export const db = getDb()

// Warm up connection immediately in serverless environments
if (typeof window === 'undefined') {
  warmUpConnection().catch(console.error)
}

// Export pool for potential cleanup operations
export { cachedPool as pool } 