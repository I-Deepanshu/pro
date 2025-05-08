import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { readFileFromDisk } from "@/lib/file-utils"

// Import the Gradio client correctly
import { Client as GradioClient } from "@gradio/client"

export async function POST(request: Request) {
  try {
    // Get session cookie
    const sessionId = await (await cookies()).get("session")?.value

    if (!sessionId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Parse the request body
    const { pdfFileId, zipFileId, targetTier } = await request.json()

    if (!pdfFileId) {
      return NextResponse.json({ message: "PDF file ID is required" }, { status: 400 })
    }

    // Read the PDF file
    let pdfBuffer
    let pdfFile
    let pdfFileName

    try {
      pdfBuffer = await readFileFromDisk(`${pdfFileId}.pdf`)
      pdfFile = new File([pdfBuffer], `${pdfFileId}.pdf`, { type: "application/pdf" })
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

    // Connect to Hugging Face model
    console.log("Connecting to Hugging Face model...")

    // Create a new Gradio client instance
    const client = await GradioClient.connect("I-DEEPANSHU/RAMunderdev")

    console.log("Sending files to model for analysis...")
    console.log(`PDF File: ${pdfFile.name}, Size: ${pdfFile.size} bytes`)
    console.log(`ZIP File: ${zipFile?.name || "None"}, Size: ${zipFile?.size || 0} bytes`)
    console.log(`Target Tier: ${targetTier}`)

    // Call the Hugging Face model API
    const result = await client.predict("/predict", {
      file_input: pdfFile,
      zip_file: zipFile || new Blob(), // Send empty blob if no zip file
      target_tier: targetTier,
    })

    console.log("Analysis completed successfully")

    // Extract results from the API response
    const [analysisText, reportFileBlob] = result.data as [string, Blob];

    // Save the analysis to the database
    try {
      await fetch(`${process.env.NEXT_PUBLIC_APP_URL || "https://pro-roan-delta.vercel.app/"}/api/analysis`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: `session=${sessionId}`,
        },
        body: JSON.stringify({
          pdfFileName,
          zipFileName,
          targetTier,
          analysisText,
          reportUrl: "analysis-report.pdf", // In a real app, this would be a URL to the stored report
        }),
      })
    } catch (saveError) {
      console.error("Error saving analysis:", saveError)
      // Continue even if saving fails
    }

    // Return the analysis results
    return NextResponse.json({
      analysisText,
      reportFile: reportFileBlob,
    })
  } catch (error) {
    console.error("Error analyzing document:", error)
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Failed to analyze document" },
      { status: 500 },
    )
  }
}
