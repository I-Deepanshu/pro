import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { ObjectId } from "mongodb"
import clientPromise from "@/lib/mongodb"
import bcrypt from "bcryptjs"
import type { User } from "@/lib/models"

export async function POST(request: Request) {
  try {
    const { username, email, password } = await request.json()

    // Validate input
    if (!username || !email || !password) {
      console.error("Registration error: Missing required fields")
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    if (password.length < 6) {
      console.error("Registration error: Password too short")
      return NextResponse.json({ message: "Password must be at least 6 characters long" }, { status: 400 })
    }

    console.log("Connecting to MongoDB for user registration...")
    const client = await clientPromise
    console.log("MongoDB connection successful")

    // Create database and collections if they don't exist
    const db = client.db("resify")

    // Check if users collection exists, create it if it doesn't
    const collections = await db.listCollections({ name: "users" }).toArray()
    if (collections.length === 0) {
      console.log("Creating users collection...")
      await db.createCollection("users")
      console.log("Users collection created successfully")
    }

    const usersCollection = db.collection<User>("users")

    // Check if user already exists
    console.log("Checking if user already exists...")
    const existingUser = await usersCollection.findOne({
      $or: [{ email }, { username }],
    })

    if (existingUser) {
      console.log("User already exists:", existingUser.email)
      if (existingUser.email === email) {
        return NextResponse.json({ message: "Email already in use" }, { status: 409 })
      } else {
        return NextResponse.json({ message: "Username already taken" }, { status: 409 })
      }
    }

    // Hash the password
    console.log("Hashing password...")
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create new user
    const userId = new ObjectId()
    const userIdString = userId.toString()

    const newUser: User = {
      _id: userId,
      id: userIdString,
      username,
      email,
      password: hashedPassword,
      createdAt: new Date(),
    }

    // Save user to database
    console.log("Saving user to MongoDB...")
    try {
      const result = await usersCollection.insertOne(newUser)
      console.log("User saved successfully with ID:", userIdString, "Result:", result)
    } catch (dbError) {
      console.error("Error saving user to database:", dbError)
      return NextResponse.json({ message: "Failed to create user in database" }, { status: 500 })
    }

    // Set session cookie
    console.log("Setting session cookie...")
    await(await cookies()).set("session", userIdString, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    })

    // Return user data (excluding password)
    const { password: _, ...userWithoutPassword } = newUser

    console.log("Registration complete for user:", username)
    return NextResponse.json(userWithoutPassword, { status: 201 })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
