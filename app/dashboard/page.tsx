"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/components/ui/use-toast"
import { FileText, Download } from "lucide-react"
import { PaymentReceipt } from "@/components/payment-receipt"
import type { Analysis, Payment } from "@/lib/models"

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<"history" | "payments">("history")
  const [isLoading, setIsLoading] = useState(true)
  const [analyses, setAnalyses] = useState<Analysis[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please login to view your dashboard",
        variant: "destructive",
      })
      router.push("/login")
      return
    }

    const fetchData = async () => {
      setIsLoading(true)
      try {
        // Fetch analyses
        const analysesResponse = await fetch("/api/analysis")
        if (analysesResponse.ok) {
          const analysesData = await analysesResponse.json()
          setAnalyses(analysesData)
        }

        // Fetch payments
        const paymentsResponse = await fetch("/api/payments")
        if (paymentsResponse.ok) {
          const paymentsData = await paymentsResponse.json()
          setPayments(paymentsData)
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
        toast({
          title: "Error",
          description: "Failed to load dashboard data",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [user, router, toast])

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow py-12">
        <div className="container mx-auto px-4">
          <h1 className="font-cartoon text-4xl text-center mb-8">
            <span className="bg-primary text-white px-4 py-2 rounded-lg cartoon-shadow">Your Dashboard</span>
          </h1>

          {isLoading ? (
            <div className="max-w-4xl mx-auto cartoon-border bg-white p-8 text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
              <h2 className="font-cartoon text-2xl mb-2">Loading Your Dashboard</h2>
              <p>Please wait while we fetch your data...</p>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto">
              <div className="cartoon-border bg-white p-8 mb-8">
                <h2 className="font-cartoon text-2xl mb-4">Welcome, {user?.username}!</h2>
                {/* Subscription Status */}
                <div className="mb-4 p-4 bg-gray-100 rounded-lg">
                  <h3 className="font-medium mb-2">Subscription Status</h3>
                  {payments.some(
                    (payment) =>
                      payment.status === "successful" &&
                      payment.subscriptionType === "monthly" &&
                      payment.validUntil &&
                      new Date(payment.validUntil) > new Date(),
                  ) ? (
                    <div className="flex items-center">
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm mr-2">Active</span>
                      <span>
                        Your monthly subscription is active until{" "}
                        {new Date(
                          payments.find(
                            (p) =>
                              p.status === "successful" &&
                              p.subscriptionType === "monthly" &&
                              p.validUntil &&
                              new Date(p.validUntil) > new Date(),
                          )?.validUntil || "",
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm mr-2">Inactive</span>
                      <span>
                        You don't have an active subscription.{" "}
                        <a href="/service" className="text-primary hover:underline">
                          Subscribe now
                        </a>{" "}
                        for just ₹1/month!
                      </span>
                    </div>
                  )}
                </div>
                <p className="mb-4">
                  This is your personal dashboard where you can view your document analysis history and payment records.
                </p>
                <div className="flex justify-center">
                  <button
                    onClick={() => router.push("/service")}
                    className="cartoon-button bg-secondary text-white hover:bg-secondary-hover"
                  >
                    Analyze a New Document
                  </button>
                </div>
              </div>

              <div className="cartoon-border bg-white">
                <div className="flex border-b-4 border-black">
                  <button
                    className={`flex-1 py-4 font-cartoon text-lg ${
                      activeTab === "history" ? "bg-secondary text-white" : "bg-white text-black hover:bg-gray-100"
                    }`}
                    onClick={() => setActiveTab("history")}
                  >
                    Analysis History
                  </button>
                  <button
                    className={`flex-1 py-4 font-cartoon text-lg ${
                      activeTab === "payments" ? "bg-primary text-white" : "bg-white text-black hover:bg-gray-100"
                    }`}
                    onClick={() => setActiveTab("payments")}
                  >
                    Payment History
                  </button>
                </div>

                <div className="p-6">
                  {activeTab === "history" ? (
                    <div>
                      <h3 className="font-cartoon text-xl mb-4">Your Recent Analyses</h3>

                      {analyses.length === 0 ? (
                        <p className="text-center py-8 text-gray-500">You haven&apos;t analyzed any documents yet.</p>
                      ) : (
                        <div className="space-y-6">
                          {analyses.map((item) => (
                            <div key={item.id} className="border-2 border-black rounded-lg p-4 hover:bg-gray-50">
                              <div className="flex justify-between items-start mb-2">
                                <span className="font-medium">{formatDate(item.createdAt.toString())}</span>
                                <span className="bg-secondary text-white px-2 py-1 rounded text-sm">
                                  Tier: {item.targetTier}
                                </span>
                              </div>
                              <div className="flex items-center mb-2">
                                <FileText className="h-5 w-5 mr-2 text-primary" />
                                <span className="font-medium">{item.pdfFileName}</span>
                                {item.zipFileName && (
                                  <span className="ml-4 text-sm text-gray-500">+ {item.zipFileName}</span>
                                )}
                              </div>
                              <p className="mb-3 text-gray-700">{item.analysisText.substring(0, 150)}...</p>
                              <div className="flex justify-end">
                                {item.reportUrl && (
                                  <button className="flex items-center text-secondary hover:underline text-sm font-medium">
                                    <Download className="h-4 w-4 mr-1" />
                                    Download Report
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                      <h3 className="font-cartoon text-xl mb-4">Your Payment History</h3>

                      {payments.length === 0 ? (
                        <p className="text-center py-8 text-gray-500">You haven&apos;t made any payments yet.</p>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse">
                            <thead>
                              <tr className="bg-gray-100">
                                <th className="border-2 border-black p-2 text-left">Transaction ID</th>
                                <th className="border-2 border-black p-2 text-left">Date</th>
                                <th className="border-2 border-black p-2 text-left">Description</th>
                                <th className="border-2 border-black p-2 text-left">Amount</th>
                                <th className="border-2 border-black p-2 text-left">Status</th>
                                <th className="border-2 border-black p-2 text-left">Subscription</th>
                                <th className="border-2 border-black p-2 text-left">Receipt</th>
                              </tr>
                            </thead>
                            <tbody>
                              {payments.map((payment) => (
                                <tr key={payment.id} className="hover:bg-gray-50">
                                  <td className="border-2 border-black p-2">
                                    {payment.razorpayPaymentId || payment.id.substring(0, 8)}
                                  </td>
                                  <td className="border-2 border-black p-2">
                                    {formatDate(payment.createdAt.toString())}
                                  </td>
                                  <td className="border-2 border-black p-2">{payment.description}</td>
                                  <td className="border-2 border-black p-2">₹{payment.amount.toFixed(2)}</td>
                                  <td className="border-2 border-black p-2">
                                    <span
                                      className={`${
                                        payment.status === "successful"
                                          ? "bg-green-100 text-green-800"
                                          : payment.status === "failed"
                                            ? "bg-red-100 text-red-800"
                                            : "bg-yellow-100 text-yellow-800"
                                      } px-2 py-1 rounded text-sm`}
                                    >
                                      {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                                    </span>
                                  </td>
                                  <td className="border-2 border-black p-2">
                                    {payment.subscriptionType && payment.validUntil ? (
                                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                                        Valid until {formatDate(payment.validUntil.toString())}
                                      </span>
                                    ) : (
                                      "One-time"
                                    )}
                                  </td>
                                  <td className="border-2 border-black p-2 text-center">
                                    {payment.status === "successful" && (
                                      <PaymentReceipt
                                        paymentId={payment.id}
                                        orderId={payment.orderId || "N/A"}
                                        amount={payment.amount}
                                        date={new Date(payment.createdAt)}
                                        description={payment.description}
                                        username={user?.username || ""}
                                        email={user?.email || ""}
                                        subscriptionType={payment.subscriptionType}
                                      />
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
