// /home/sami/Documents/GitHub/ecommerce/prisma/utils/handler.ts

import fs from 'fs'
import path from 'path'
import { readCSV } from './reader'

/**
 * Loads and validates a CSV file.
 */
export async function loadCSV<T extends Record<string, unknown>>(
  fileName: string,
  basePath = 'prisma/data'
): Promise<T[]> {
  const filePath = path.join(process.cwd(), basePath, fileName)

  if (!fs.existsSync(filePath)) {
    throw new Error(`❌ CSV file not found: ${filePath}`)
  }

  const rows = await readCSV<T>(filePath)

  if (!rows.length) {
    throw new Error(`❌ CSV file is empty: ${filePath}`)
  }

  return rows
}

/**
 * Wraps DB creation logic with error handling.
 */
export async function safeCreate<T>(
  label: string,
  fn: () => Promise<T>,
  context: Record<string, unknown> = {}
): Promise<T | null> {
  try {
    return await fn()
  } catch (error: unknown) {
    const err = error instanceof Error ? error.message : String(error)
    console.error(`❌ Failed to create ${label}:`, {
      error: err,
      context,
    })
    return null
  }
}

