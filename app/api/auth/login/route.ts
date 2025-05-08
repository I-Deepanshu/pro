import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import clientPromise from "@/lib/mongodb"
import bcrypt from "bcryptjs"
import type { User } from "@/lib/models"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    // Validate input
    if (!email || !password) {
      console.error("Login error: Missing email or password")
      return NextResponse.json({ message: "Missing email or password" }, { status: 400 })
    }

    console.log("Connecting to MongoDB for user login...")
    const client = await clientPromise
    console.log("MongoDB connection successful")
    const db = client.db("resify")
    const usersCollection = db.collection<User>("users")

    // Find user
    console.log("Finding user by email:", email)
    const user = await usersCollection.findOne({ email })

    if (!user) {
      console.log("User not found with email:", email)
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 })
    }

    // Verify the password
    console.log("Verifying password for user:", user.username)
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      console.log("Invalid password for user:", user.username)
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 })
    }

    console.log("User authenticated successfully:", user.username)

    // Set session cookie
    cookies().set("session", user._id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    })

    // Return user data (excluding password)
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json(userWithoutPassword)
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
