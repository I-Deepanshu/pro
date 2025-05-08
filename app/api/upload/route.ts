import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { v4 as uuidv4 } from "uuid"
import { ensureUploadDir, saveFile } from "@/lib/file-utils"

export async function POST(request: Request) {
  try {
    // Get session cookie
    const sessionId = await(await cookies()).get("session")?.value

    if (!sessionId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Ensure upload directory exists
    await ensureUploadDir()

    // Parse the form data
    const formData = await request.formData()

    // Get the PDF file
    const pdfFile = formData.get("pdfFile") as File
    if (!pdfFile) {
      return NextResponse.json({ message: "PDF file is required" }, { status: 400 })
    }

    // Get the ZIP file (optional)
    const zipFile = formData.get("zipFile") as File | null

    // Get the target tier
    const targetTier = formData.get("targetTier") as string
    if (!targetTier) {
      return NextResponse.json({ message: "Target tier is required" }, { status: 400 })
    }

    // Generate unique IDs for the files
    const pdfFileId = uuidv4()
    const zipFileId = zipFile ? uuidv4() : null

    // Save the PDF file
    await saveFile(pdfFile, `${pdfFileId}.pdf`)

    // Save the ZIP file if provided
    if (zipFile) {
      await saveFile(zipFile, `${zipFileId}.zip`)
    }

    // Return the file IDs
    return NextResponse.json({
      message: "Files uploaded successfully",
      fileIds: {
        pdfFileId,
        zipFileId,
        targetTier,
      },
    })
  } catch (error) {
    console.error("File upload error:", error)
    return NextResponse.json({ message: "File upload failed" }, { status: 500 })
  }
}
