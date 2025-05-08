import type { ObjectId } from "mongodb"

export interface User {
  _id?: ObjectId
  id?: string
  username: string
  email: string
  password: string
  createdAt: Date
  updatedAt?: Date
}

export interface Payment {
  _id?: ObjectId
  id?: string
  userId: string
  amount: number
  status: "pending" | "successful" | "failed"
  description: string
  createdAt: Date
  updatedAt?: Date
  orderId?: string
  razorpayPaymentId?: string
  subscriptionType?: "monthly" | "yearly"
  validUntil?: Date
}

export interface Analysis {
  _id?: ObjectId
  id?: string
  userId: string
  pdfFileName: string
  zipFileName?: string
  targetTier: string
  analysisText: string
  reportUrl?: string
  createdAt: Date
  updatedAt?: Date
  paymentId?: string
}
