import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { readFileFromDisk } from "@/lib/file-utils"

export async function GET(request: Request) {
  try {
    // Get session cookie
    const sessionId = cookies().get("session")?.value

    if (!sessionId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Get file IDs from query parameters
    const url = new URL(request.url)
    const pdfFileId = url.searchParams.get("pdfFileId")
    const zipFileId = url.searchParams.get("zipFileId")

    if (!pdfFileId) {
      return NextResponse.json({ message: "PDF file ID is required" }, { status: 400 })
    }

    // Read the PDF file
    let pdfBuffer
    let pdfFile = null
    let pdfFileName = null

    try {
      pdfBuffer = await readFileFromDisk(`${pdfFileId}.pdf`)
      // Create a File object from the buffer
      pdfFile = new File([pdfBuffer], `${pdfFileId}.pdf`, { type: "application/pdf" })

      // Get the original filename from query params or use default
      pdfFileName = `document-${pdfFileId.substring(0, 8)}.pdf`
    } catch (error) {
      console.error("Error reading PDF file:", error)
      return NextResponse.json({ message: "PDF file not found or could not be read" }, { status: 404 })
    }

    // Read the ZIP file if provided
    let zipFile = null
    let zipFileName = null
    if (zipFileId) {
      try {
        const zipBuffer = await readFileFromDisk(`${zipFileId}.zip`)
        zipFile = new File([zipBuffer], `${zipFileId}.zip`, { type: "application/zip" })
        zipFileName = `resources-${zipFileId.substring(0, 8)}.zip`
      } catch (error) {
        console.error("Error reading ZIP file:", error)
        // Continue without the ZIP file
      }
    }

    return NextResponse.json({
      pdfFile,
      zipFile,
      pdfFileName,
      zipFileName,
    })
  } catch (error) {
    console.error("File retrieval error:", error)
    return NextResponse.json({ message: "Failed to retrieve files" }, { status: 500 })
  }
}
