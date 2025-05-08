import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import clientPromise from "@/lib/mongodb"
import type { Payment } from "@/lib/models"

export async function GET() {
  try {
    // Get session cookie
    const sessionId = await(await cookies()).get("session")?.value

    if (!sessionId) {
      return NextResponse.json({ hasActiveSubscription: false }, { status: 401 })
    }

    const client = await clientPromise
    const db = client.db("resify")

    // Check if user has an active subscription
    const now = new Date()
    const activeSubscription = await db.collection<Payment>("payments").findOne({
      userId: sessionId,
      status: "successful",
      subscriptionType: "monthly",
      validUntil: { $gt: now }, // Check if subscription is still valid
    })

    return NextResponse.json({
      hasActiveSubscription: !!activeSubscription,
      subscription: activeSubscription || null,
    })
  } catch (error) {
    console.error("Subscription check error:", error)
    return NextResponse.json({ hasActiveSubscription: false, error: "Failed to check subscription" }, { status: 500 })
  }
}
