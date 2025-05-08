import { writeFile, readFile, mkdir } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"

// Create a temporary directory for file uploads
export const UPLOAD_DIR = join(process.cwd(), "tmp", "uploads")

// Ensure the upload directory exists
export async function ensureUploadDir() {
  try {
    await mkdir(UPLOAD_DIR, { recursive: true })
    return true
  } catch (error) {
    console.error("Error creating upload directory:", error)
    return false
  }
}

// Save a file to the upload directory
export async function saveFile(file: File, filename: string): Promise<string> {
  try {
    await ensureUploadDir()
    const buffer = Buffer.from(await file.arrayBuffer())
    const path = join(UPLOAD_DIR, filename)
    await writeFile(path, buffer)
    return path
  } catch (error) {
    console.error("Error saving file:", error)
    throw new Error("Failed to save file")
  }
}

// Read a file from the upload directory
export async function readFileFromDisk(filename: string): Promise<Buffer> {
  try {
    const path = join(UPLOAD_DIR, filename)

    // Check if file exists
    if (!existsSync(path)) {
      throw new Error(`File not found: ${filename}`)
    }

    return await readFile(path)
  } catch (error) {
    console.error("Error reading file:", error)
    throw new Error(`Failed to read file: ${filename}`)
  }
}
