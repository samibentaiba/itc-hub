
import fs from 'fs';
import path from 'path';
import Papa, { ParseResult } from 'papaparse';

const dataDir = path.join(__dirname, '../data');

/**
 * Reads and parses a CSV file from the /data directory.
 * @param filename - The name of the CSV file or absolute path.
 * @returns A Promise resolving to an array of parsed rows.
 */
export async function readCSV<T extends Record<string, unknown>>(filename: string): Promise<T[]> {
  const filePath = path.isAbsolute(filename) ? filename : path.join(dataDir, filename);
  const fileContent = fs.readFileSync(filePath, 'utf8');

  return new Promise((resolve, reject) => {
    Papa.parse<T>(fileContent, {
      header: true,
      skipEmptyLines: true,
      complete: (results: ParseResult<T>) => resolve(results.data),
      error: reject,
    });
  });
}

/**
 * Reads and parses a JSON file from the /data directory.
 * @param filename - The name of the JSON file.
 * @returns The parsed JSON content.
 */
export function readJSON<T>(filename: string): T {
  const filePath = path.join(dataDir, filename);
  const content = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(content) as T;
}

