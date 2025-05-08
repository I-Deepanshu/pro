import clientPromise from "./mongodb"

export async function initializeDatabase() {
  try {
    // Skip initialization if MongoDB URI is not available
    if (!process.env.MONGODB_URI) {
      console.warn("MongoDB URI not found. Skipping database initialization.")
      return false
    }

    console.log("Initializing database...")
    const client = await clientPromise
    const db = client.db("resify")

    // Check and create collections if they don't exist
    const collections = await db.listCollections().toArray()
    const collectionNames = collections.map((c) => c.name)

    // Create users collection if it doesn't exist
    if (!collectionNames.includes("users")) {
      console.log("Creating users collection...")
      await db.createCollection("users")
      console.log("Users collection created")
    }

    // Create payments collection if it doesn't exist
    if (!collectionNames.includes("payments")) {
      console.log("Creating payments collection...")
      await db.createCollection("payments")
      console.log("Payments collection created")
    }

    // Create analyses collection if it doesn't exist
    if (!collectionNames.includes("analyses")) {
      console.log("Creating analyses collection...")
      await db.createCollection("analyses")
      console.log("Analyses collection created")
    }

    console.log("Database initialization complete")
    return true
  } catch (error) {
    console.error("Database initialization failed:", error)
    return false
  }
}
