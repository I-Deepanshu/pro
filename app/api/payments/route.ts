import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { ObjectId } from "mongodb"
import clientPromise from "@/lib/mongodb"
import type { Payment } from "@/lib/models"

export async function POST(request: Request) {
  try {
    // Get session cookie
    const sessionId = await(await cookies()).get("session")?.value

    if (!sessionId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { amount, status, description } = await request.json()

    // Validate input
    if (!amount || !status || !description) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("resify")

    // Create new payment record
    const paymentId = new ObjectId()
    const payment: Payment = {
      _id: paymentId,
      id: paymentId.toString(),
      userId: sessionId,
      amount,
      status,
      description,
      createdAt: new Date(),
    }

    // Save payment to database
    await db.collection<Payment>("payments").insertOne(payment)

    return NextResponse.json(payment, { status: 201 })
  } catch (error) {
    console.error("Payment save error:", error)
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

    // Get all payments for the user
    const payments = await db
      .collection<Payment>("payments")
      .find({ userId: sessionId })
      .sort({ createdAt: -1 })
      .toArray()

    return NextResponse.json(payments)
  } catch (error) {
    console.error("Payments fetch error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
