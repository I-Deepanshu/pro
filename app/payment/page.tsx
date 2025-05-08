"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/components/ui/use-toast"
import Script from "next/script"

declare global {
  interface Window {
    Razorpay: any
  }
}

export default function Payment() {
  const [isLoading, setIsLoading] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<"pending" | "processing" | "success" | "failed">("pending")
  const { user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  const pdfFileId = searchParams.get("pdfFileId") || ""
  const zipFileId = searchParams.get("zipFileId") || ""
  const targetTier = searchParams.get("targetTier") || "Q1"

  useEffect(() => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please login to use this service",
        variant: "destructive",
      })
      router.push("/login")
      return
    }

    if (!pdfFileId) {
      toast({
        title: "Invalid request",
        description: "No PDF file provided for analysis",
        variant: "destructive",
      })
      router.push("/service")
      return
    }

    // Check if user already has an active subscription
    const checkSubscription = async () => {
      try {
        const response = await fetch("/api/payments/check-subscription")
        const data = await response.json()

        if (data.hasActiveSubscription) {
          // If user has active subscription, redirect to result page
          toast({
            title: "Active subscription found",
            description: "You already have an active subscription. Redirecting to analysis...",
          })

          // Redirect to result page with file IDs
          router.push(
            `/result?pdfFileId=${pdfFileId}&targetTier=${encodeURIComponent(targetTier)}${
              zipFileId ? `&zipFileId=${zipFileId}` : ""
            }`,
          )
        }
      } catch (error) {
        console.error("Error checking subscription:", error)
      }
    }

    checkSubscription()
  }, [user, pdfFileId, zipFileId, targetTier, router, toast])

  const handlePayment = async () => {
    if (!user || !pdfFileId) return

    setIsLoading(true)
    setPaymentStatus("processing")

    try {
      // Create Razorpay order
      const response = await fetch("/api/razorpay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: 1, // ₹1 for monthly subscription
          description: `Document Analysis Monthly Subscription`,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create payment order")
      }

      const orderData = await response.json()

      // Initialize Razorpay payment
      const options = {
        key: orderData.keyId, // Get key from server response instead of env variable
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Resify",
        description: `Document Analysis Service`,
        order_id: orderData.id,
        handler: async (response) => {
          try {
            // Verify payment
            const verifyResponse = await fetch("/api/razorpay/verify", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                paymentId: orderData.paymentId,
              }),
            })

            if (!verifyResponse.ok) {
              throw new Error("Payment verification failed")
            }

            setPaymentStatus("success")

            // Redirect to results page after successful payment
            setTimeout(() => {
              // Redirect to result page with file IDs
              router.push(
                `/result?pdfFileId=${pdfFileId}&targetTier=${encodeURIComponent(targetTier)}${
                  zipFileId ? `&zipFileId=${zipFileId}` : ""
                }`,
              )
            }, 2000)
          } catch (error) {
            console.error("Payment verification error:", error)
            setPaymentStatus("failed")
            toast({
              title: "Payment failed",
              description: "There was an error verifying your payment. Please try again.",
              variant: "destructive",
            })
          } finally {
            setIsLoading(false)
          }
        },
        prefill: {
          name: user.username,
          email: user.email,
        },
        theme: {
          color: "#E02E5A",
        },
      }

      const razorpay = new window.Razorpay(options)
      razorpay.open()
    } catch (error) {
      console.error("Payment error:", error)
      setPaymentStatus("failed")
      toast({
        title: "Payment failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      {/* Load Razorpay script */}
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      <main className="flex-grow py-12">
        <div className="container mx-auto px-4">
          <h1 className="font-cartoon text-4xl text-center mb-8">
            <span className="bg-primary text-white px-4 py-2 rounded-lg cartoon-shadow">Payment</span>
          </h1>

          <div className="max-w-md mx-auto">
            <div className="cartoon-border bg-white p-8">
              {paymentStatus === "pending" && (
                <>
                  <h2 className="font-cartoon text-2xl mb-6 text-center">Complete Your Payment</h2>

                  <div className="mb-6 p-4 bg-gray-100 rounded-lg">
                    <h3 className="font-medium mb-2">Order Summary</h3>
                    <div className="flex justify-between mb-2">
                      <span>Document Analysis Subscription</span>
                      <span>₹1.00/month</span>
                    </div>
                    <div className="border-t border-gray-300 my-2"></div>
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span>₹1.00/month</span>
                    </div>
                  </div>

                  <div className="mb-6 p-4 bg-gray-100 rounded-lg">
                    <h3 className="font-medium mb-2">Subscription Benefits</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Unlimited document analysis for one month</li>
                      <li>Access to all target tiers (Q1-Q4)</li>
                      <li>Download detailed PDF reports</li>
                      <li>Access to analysis history</li>
                    </ul>
                  </div>

                  <button
                    onClick={handlePayment}
                    disabled={isLoading}
                    className="cartoon-button bg-primary text-white hover:bg-primary-hover w-full"
                  >
                    {isLoading ? "Processing..." : "Pay ₹1 for Monthly Subscription"}
                  </button>

                  <div className="mt-4 text-center text-sm text-gray-600">
                    <p>Secure payment powered by Razorpay</p>
                  </div>
                </>
              )}

              {paymentStatus === "processing" && (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
                  <h2 className="font-cartoon text-2xl mb-2">Processing Payment</h2>
                  <p>Please wait while we process your payment...</p>
                </div>
              )}

              {paymentStatus === "success" && (
                <div className="text-center py-8">
                  <div className="bg-green-100 text-green-700 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h2 className="font-cartoon text-2xl mb-2">Payment Successful!</h2>
                  <p className="mb-4">Thank you for your payment. Redirecting to results...</p>
                  <div className="animate-pulse">
                    <div className="h-2 bg-primary rounded w-24 mx-auto"></div>
                  </div>
                </div>
              )}

              {paymentStatus === "failed" && (
                <div className="text-center py-8">
                  <div className="bg-red-100 text-red-700 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <h2 className="font-cartoon text-2xl mb-2">Payment Failed</h2>
                  <p className="mb-4">There was an error processing your payment.</p>
                  <button
                    onClick={handlePayment}
                    className="cartoon-button bg-primary text-white hover:bg-primary-hover"
                  >
                    Try Again
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
