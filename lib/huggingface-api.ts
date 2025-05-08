// This file is no longer used directly from client components
// The functionality has been moved to app/api/analyze/route.ts
// Keeping this file for reference

import { Client as GradioClient } from "@gradio/client"

export type AnalysisResult = {
  analysisText: string
  reportFile: Blob | null
}

export async function analyzeDocument(
  pdfFile: File | null,
  zipFile: File | null,
  targetTier = "Q1",
): Promise<AnalysisResult> {
  try {
    // Validate input
    if (!pdfFile) {
      throw new Error("PDF file is required for analysis")
    }

    console.log("Connecting to Hugging Face model...")
    const client = await GradioClient.connect("I-DEEPANSHU/RAMunderdev")

    console.log("Sending files to model for analysis...")
    console.log(`PDF File: ${pdfFile.name}, Size: ${pdfFile.size} bytes`)
    console.log(`ZIP File: ${zipFile?.name || "None"}, Size: ${zipFile?.size || 0} bytes`)
    console.log(`Target Tier: ${targetTier}`)

    // Call the Hugging Face model API
    const result = await client.predict("/predict", {
      pdf_file: pdfFile,
      zip_file: zipFile || new Blob(), // Send empty blob if no zip file
      target_tier: targetTier,
    })

    console.log("Analysis completed successfully")

    // Extract results from the API response
    const [analysisText, reportFilePath] = result.data as [string, string]

    let reportFile: Blob | null = null

    if (reportFilePath) {
      try {
        console.log(`Fetching PDF report from: ${reportFilePath}`)
        const fileResponse = await fetch(reportFilePath)
        if (!fileResponse.ok) {
          throw new Error(`Failed to download PDF. Status: ${fileResponse.status}`)
        }
        reportFile = await fileResponse.blob()
      } catch (err) {
        console.error("Failed to fetch report file:", err)
        reportFile = null
      }
    }

    return {
      analysisText,
      reportFile,
    }
  } catch (error) {
    console.error("Error analyzing document with Hugging Face API:", error)
    throw new Error("Failed to analyze document. Please try again.")
  }
}
