import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { verifyPayment } from "@/lib/razorpay"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import type { Payment } from "@/lib/models"

export async function POST(request: Request) {
  try {
    // Get session cookie
    const sessionId = cookies().get("session")?.value

    if (!sessionId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, paymentId } = await request.json()

    // Validate input
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !paymentId) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    // Verify payment signature
    const isValid = await verifyPayment(razorpay_order_id, razorpay_payment_id, razorpay_signature)

    if (!isValid) {
      return NextResponse.json({ message: "Invalid payment signature" }, { status: 400 })
    }

    // Update payment status in database
    const client = await clientPromise
    const db = client.db("resify")

    const result = await db.collection<Payment>("payments").updateOne(
      { _id: new ObjectId(paymentId), userId: sessionId },
      {
        $set: {
          status: "successful",
          razorpayPaymentId: razorpay_payment_id,
          updatedAt: new Date(),
        },
      },
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: "Payment not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Razorpay verification error:", error)
    return NextResponse.json({ message: "Payment verification failed" }, { status: 500 })
  }
}
