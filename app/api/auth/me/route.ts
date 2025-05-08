import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { ObjectId } from "mongodb"
import clientPromise from "@/lib/mongodb"
import type { User } from "@/lib/models"

export async function GET() {
  try {
    // Get session cookie
    const sessionId = await(await cookies()).get("session")?.value

    if (!sessionId) {
      console.log("No session cookie found")
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    console.log("Connecting to MongoDB to verify session:", sessionId)
    const client = await clientPromise
    console.log("MongoDB connection successful")
    const db = client.db("resify")
    const usersCollection = db.collection<User>("users")

    // Find user by session ID (which is the ObjectId as string)
    console.log("Finding user by session ID:", sessionId)
    let user

    try {
      user = await usersCollection.findOne({ _id: new ObjectId(sessionId) })
    } catch (error) {
      console.error("Error finding user by ID:", error)
      return NextResponse.json({ message: "Invalid session" }, { status: 401 })
    }

    if (!user) {
      console.log("No user found with session ID:", sessionId)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    console.log("User found:", user.username)

    // Return user data (excluding password)
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json(userWithoutPassword)
  } catch (error) {
    console.error("Auth check error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
