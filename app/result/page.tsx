"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/components/ui/use-toast"
import { Download, FileText } from "lucide-react"

export default function Result() {
  const [isLoading, setIsLoading] = useState(true)
  const [analysisText, setAnalysisText] = useState<string | null>(null)
  const [reportFile, setReportFile] = useState<Blob | null>(null)
  const [error, setError] = useState<string | null>(null)
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

    const fetchResult = async () => {
      setIsLoading(true)
      setError(null)

      try {
        // Check if user has an active subscription
        const subscriptionResponse = await fetch("/api/payments/check-subscription")
        const { hasActiveSubscription } = await subscriptionResponse.json()

        if (!hasActiveSubscription) {
          toast({
            title: "Subscription required",
            description: "You need an active subscription to analyze documents",
            variant: "destructive",
          })
          router.push("/service")
          return
        }

        toast({
          title: "Analysis in progress",
          description: "Sending your document to our AI model for analysis...",
        })

        // Call our server-side API to analyze the document
        const analyzeResponse = await fetch("/api/analyze", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            pdfFileId,
            zipFileId,
            targetTier,
          }),
        })

        if (!analyzeResponse.ok) {
          const errorData = await analyzeResponse.json()
          throw new Error(errorData.message || "Failed to analyze document")
        }

        const { analysisText, reportFile } = await analyzeResponse.json()

        if (!analysisText) {
          throw new Error("No analysis results returned")
        }

        setAnalysisText(analysisText)

        // Convert the report file data to a Blob if it exists
        if (reportFile) {
          // If reportFile is already a Blob, use it directly
          // Otherwise, create a new Blob from the data
          const blob = reportFile instanceof Blob ? reportFile : new Blob([reportFile], { type: "application/pdf" })
          setReportFile(blob)
        }

        toast({
          title: "Analysis complete",
          description: "Your document has been successfully analyzed!",
        })
      } catch (error) {
        console.error("Error analyzing document:", error)
        setError(error instanceof Error ? error.message : "Failed to analyze your document. Please try again.")
        toast({
          title: "Error",
          description: "Failed to analyze your document. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchResult()
  }, [user, pdfFileId, zipFileId, targetTier, router, toast])

  const handleDownloadReport = () => {
    if (reportFile) {
      const url = URL.createObjectURL(reportFile)
      const a = document.createElement("a")
      a.href = url
      a.download = `Resify_Analysis_Report_${new Date().toISOString().split("T")[0]}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow py-12">
        <div className="container mx-auto px-4">
          <h1 className="font-cartoon text-4xl text-center mb-8">
            <span className="bg-secondary text-white px-4 py-2 rounded-lg cartoon-shadow">Analysis Results</span>
          </h1>

          <div className="max-w-3xl mx-auto">
            {isLoading ? (
              <div className="cartoon-border bg-white p-8 text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
                <h2 className="font-cartoon text-2xl mb-2">Analyzing Your Document</h2>
                <p>Our AI is working on your document. This may take a moment...</p>
              </div>
            ) : error ? (
              <div className="cartoon-border bg-white p-8 text-center">
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
                <h2 className="font-cartoon text-2xl mb-2">Analysis Failed</h2>
                <p className="mb-6">{error}</p>
                <button
                  onClick={() => router.push("/service")}
                  className="cartoon-button bg-primary text-white hover:bg-primary-hover"
                >
                  Try Again
                </button>
              </div>
            ) : (
              <>
                <div className="cartoon-border bg-white p-8 mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="font-cartoon text-2xl">Analysis Results</h2>
                    {reportFile && (
                      <button
                        onClick={handleDownloadReport}
                        className="cartoon-button bg-secondary text-white hover:bg-secondary-hover flex items-center"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download Report
                      </button>
                    )}
                  </div>

                  <div className="p-4 bg-gray-100 rounded-lg mb-4">
                    <div className="flex items-center mb-2">
                      <FileText className="mr-2 h-5 w-5 text-primary" />
                      <h3 className="font-medium">Document Details</h3>
                    </div>
                    <ul className="space-y-1 text-sm">
                      <li>
                        <strong>Target Tier:</strong> {targetTier}
                      </li>
                    </ul>
                  </div>

                  {analysisText && (
                    <div className="prose max-w-none">
                      <div className="whitespace-pre-wrap">
                        {analysisText.split("\n").map((line, index) => {
                          if (line.startsWith("# ")) {
                            return (
                              <h1 key={index} className="text-2xl font-bold mt-6 mb-4">
                                {line.substring(2)}
                              </h1>
                            )
                          } else if (line.startsWith("## ")) {
                            return (
                              <h2 key={index} className="text-xl font-bold mt-5 mb-3">
                                {line.substring(3)}
                              </h2>
                            )
                          } else if (line.startsWith("### ")) {
                            return (
                              <h3 key={index} className="text-lg font-bold mt-4 mb-2">
                                {line.substring(4)}
                              </h3>
                            )
                          } else if (line.startsWith("- ")) {
                            return (
                              <li key={index} className="ml-4">
                                {line.substring(2)}
                              </li>
                            )
                          } else if (line.startsWith("1. ") || line.startsWith("2. ") || line.startsWith("3. ")) {
                            return (
                              <li key={index} className="ml-4 list-decimal">
                                {line.substring(3)}
                              </li>
                            )
                          } else if (line === "") {
                            return <br key={index} />
                          } else {
                            return (
                              <p key={index} className="mb-2">
                                {line}
                              </p>
                            )
                          }
                        })}
                      </div>
                    </div>
                  )}
                </div>

                <div className="text-center">
                  <button
                    onClick={() => router.push("/service")}
                    className="cartoon-button bg-primary text-white hover:bg-primary-hover"
                  >
                    Analyze Another Document
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
