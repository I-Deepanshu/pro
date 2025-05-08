import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { ObjectId } from "mongodb"
import clientPromise from "@/lib/mongodb"
import type { Analysis } from "@/lib/models"

export async function POST(request: Request) {
  try {
    // Get session cookie
    const sessionId = await(await cookies()).get("session")?.value

    if (!sessionId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { pdfFileName, zipFileName, targetTier, analysisText, reportUrl } = await request.json()

    // Validate input
    if (!pdfFileName || !targetTier || !analysisText) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("resify")

    // Create new analysis record
    const analysisId = new ObjectId()
    const analysis: Analysis = {
      _id: analysisId,
      id: analysisId.toString(),
      userId: sessionId,
      pdfFileName,
      zipFileName,
      targetTier,
      analysisText,
      reportUrl,
      createdAt: new Date(),
    }

    // Save analysis to database
    await db.collection<Analysis>("analyses").insertOne(analysis)

    return NextResponse.json(analysis, { status: 201 })
  } catch (error) {
    console.error("Analysis save error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    // Get session cookie
    const sessionId = await(await cookies()).get("session")?.value

    if (!sessionId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const client = await clientPromise
    const db = client.db("resify")

    // Get all analyses for the user
    const analyses = await db
      .collection<Analysis>("analyses")
      .find({ userId: sessionId })
      .sort({ createdAt: -1 })
      .toArray()

    return NextResponse.json(analyses)
  } catch (error) {
    console.error("Analysis fetch error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
