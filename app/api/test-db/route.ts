import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { initializeDatabase } from "@/lib/db-init"

export async function GET() {
  try {
    console.log("Testing MongoDB connection...")
    const client = await clientPromise
    console.log("MongoDB connection successful")

    // Initialize database
    await initializeDatabase()

    // Get database stats
    const db = client.db("resify")
    const stats = await db.stats()

    // Get collection names
    const collections = await db.listCollections().toArray()
    const collectionNames = collections.map((c) => c.name)

    return NextResponse.json({
      status: "connected",
      database: "resify",
      collections: collectionNames,
      stats: {
        collections: stats.collections,
        views: stats.views,
        objects: stats.objects,
        avgObjSize: stats.avgObjSize,
        dataSize: stats.dataSize,
        storageSize: stats.storageSize,
        indexes: stats.indexes,
        indexSize: stats.indexSize,
      },
    })
  } catch (error) {
    console.error("MongoDB connection test failed:", error)
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to connect to MongoDB",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
