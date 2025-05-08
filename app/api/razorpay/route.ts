import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createOrder } from "@/lib/razorpay"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import type { Payment } from "@/lib/models"

export async function POST(request: Request) {
  try {
    // Get session cookie
    const sessionId = await(await cookies()).get("session")?.value

    if (!sessionId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { amount, description } = await request.json()

    // Validate input
    if (!amount) {
      return NextResponse.json({ message: "Amount is required" }, { status: 400 })
    }

    // Create a receipt ID
    const receiptId = `receipt_${Date.now()}`

    // Create Razorpay order
    const order = await createOrder({
      amount: amount * 100, // Convert to paise
      receipt: receiptId,
      notes: {
        description: description || "Document Analysis Service",
        userId: sessionId,
      },
    })

    // Save pending payment to database
    const client = await clientPromise
    const db = client.db("resify")

    const paymentId = new ObjectId()
    const payment: Payment = {
      _id: paymentId,
      id: paymentId.toString(),
      userId: sessionId,
      amount,
      status: "pending",
      description: description || "Document Analysis Subscription",
      createdAt: new Date(),
      orderId: order.id, // Store the Razorpay order ID
      subscriptionType: "monthly",
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    }

    await db.collection<Payment>("payments").insertOne(payment)

    // Return the Razorpay key ID from server environment
    // This prevents exposing it in client code
    return NextResponse.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      paymentId: payment.id,
      keyId: process.env.RAZORPAY_KEY_ID || "rzp_test_key", // Send key from server
    })
  } catch (error) {
    console.error("Razorpay order creation error:", error)
    return NextResponse.json({ message: "Failed to create payment order" }, { status: 500 })
  }
}
