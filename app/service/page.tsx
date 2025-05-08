"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/components/ui/use-toast"
import { FileUp, FileIcon } from "lucide-react"

export default function Service() {
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [zipFile, setZipFile] = useState<File | null>(null)
  const [targetTier, setTargetTier] = useState("Q1")
  const [isLoading, setIsLoading] = useState(false)
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false)
  const [checkingSubscription, setCheckingSubscription] = useState(true)
  const pdfInputRef = useRef<HTMLInputElement>(null)
  const zipInputRef = useRef<HTMLInputElement>(null)
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  // Check if user has an active subscription
  useEffect(() => {
    const checkSubscription = async () => {
      if (!user) return

      try {
        setCheckingSubscription(true)
        const response = await fetch("/api/payments/check-subscription")
        const data = await response.json()
        setHasActiveSubscription(data.hasActiveSubscription)
      } catch (error) {
        console.error("Error checking subscription:", error)
      } finally {
        setCheckingSubscription(false)
      }
    }

    checkSubscription()
  }, [user])

  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (file.type !== "application/pdf") {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF file",
          variant: "destructive",
        })
        return
      }
      setPdfFile(file)
    }
  }

  const handleZipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (file.type !== "application/zip" && file.type !== "application/x-zip-compressed") {
        toast({
          title: "Invalid file type",
          description: "Please upload a ZIP file",
          variant: "destructive",
        })
        return
      }
      setZipFile(file)
    }
  }

  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please login to use this service",
        variant: "destructive",
      })
      router.push("/login")
      return
    }

    if (!pdfFile) {
      toast({
        title: "PDF file required",
        description: "Please upload a PDF file to analyze",
        variant: "destructive",
      })
      return
    }

    // Validate PDF file size (max 10MB)
    if (pdfFile.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "PDF file must be less than 10MB",
        variant: "destructive",
      })
      return
    }

    // Validate ZIP file size if provided (max 20MB)
    if (zipFile && zipFile.size > 20 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "ZIP file must be less than 20MB",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      if (hasActiveSubscription) {
        // If user has active subscription, proceed directly to analysis
        // Upload files to server
        const formData = new FormData()
        formData.append("pdfFile", pdfFile)
        if (zipFile) {
          formData.append("zipFile", zipFile)
        }
        formData.append("targetTier", targetTier)

        toast({
          title: "Uploading files",
          description: "Please wait while we upload your files...",
        })

        // Store file info in session storage for the result page
        sessionStorage.setItem("pdfFileName", pdfFile.name)
        if (zipFile) {
          sessionStorage.setItem("zipFileName", zipFile.name)
        }
        sessionStorage.setItem("targetTier", targetTier)

        // Upload files to server
        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json()
          throw new Error(errorData.message || "Failed to upload files")
        }

        const { fileIds } = await uploadResponse.json()

        // Redirect to result page with file IDs
        router.push(
          `/result?pdfFileId=${fileIds.pdfFileId}&targetTier=${encodeURIComponent(targetTier)}${
            fileIds.zipFileId ? `&zipFileId=${fileIds.zipFileId}` : ""
          }`,
        )
      } else {
        // If no active subscription, redirect to payment page
        // Store file info in session storage for after payment
        sessionStorage.setItem("pdfFileName", pdfFile.name)
        if (zipFile) {
          sessionStorage.setItem("zipFileName", zipFile.name)
        }
        sessionStorage.setItem("targetTier", targetTier)

        toast({
          title: "Uploading files",
          description: "Please wait while we upload your files...",
        })

        // Upload files to server
        const formData = new FormData()
        formData.append("pdfFile", pdfFile)
        if (zipFile) {
          formData.append("zipFile", zipFile)
        }
        formData.append("targetTier", targetTier)

        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json()
          throw new Error(errorData.message || "Failed to upload files")
        }

        const { fileIds } = await uploadResponse.json()

        // Redirect to payment page with file IDs
        router.push(
          `/payment?pdfFileId=${fileIds.pdfFileId}&targetTier=${encodeURIComponent(targetTier)}${
            fileIds.zipFileId ? `&zipFileId=${fileIds.zipFileId}` : ""
          }`,
        )
      }
    } catch (error) {
      console.error("Error processing request:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to process your request. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow py-12">
        <div className="container mx-auto px-4">
          <h1 className="font-cartoon text-4xl text-center mb-8">
            <span className="bg-secondary text-white px-4 py-2 rounded-lg cartoon-shadow">
              Document Analysis Service
            </span>
          </h1>

          <div className="max-w-3xl mx-auto">
            <div className="cartoon-border bg-white p-8 mb-8">
              <h2 className="font-cartoon text-2xl mb-4">How It Works</h2>
              <ol className="list-decimal pl-5 space-y-2">
                <li>Upload your PDF document for analysis.</li>
                <li>Optionally, upload a ZIP file with additional resources.</li>
                <li>Select your target tier (Q1 is the default).</li>
                <li>Click the "Analyze Now" button to proceed.</li>
                <li>
                  {hasActiveSubscription
                    ? "Since you have an active subscription, your document will be analyzed immediately."
                    : "Pay ₹1 for a monthly subscription using our secure payment gateway."}
                </li>
                <li>Our AI will analyze your document and provide insights.</li>
              </ol>
            </div>

            {hasActiveSubscription && (
              <div className="cartoon-border bg-green-50 p-4 mb-8">
                <div className="flex items-center">
                  <div className="bg-green-100 p-2 rounded-full mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-green-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-cartoon text-lg text-green-800">Active Subscription</h3>
                    <p className="text-green-700">
                      You have an active subscription. You can analyze documents without additional payment.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="cartoon-border bg-white p-8">
              <h2 className="font-cartoon text-2xl mb-6">Upload Your Document</h2>

              {/* PDF File Upload */}
              <div className="mb-6">
                <label className="block font-medium mb-2">
                  Upload PDF File <span className="text-red-500">*</span>
                </label>
                <div
                  className={`border-2 border-dashed border-black rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 transition-colors ${
                    pdfFile ? "bg-green-50" : ""
                  }`}
                  onClick={() => pdfInputRef.current?.click()}
                >
                  <input type="file" ref={pdfInputRef} onChange={handlePdfChange} accept=".pdf" className="hidden" />

                  {pdfFile ? (
                    <div className="flex flex-col items-center">
                      <div className="bg-green-100 p-3 rounded-full mb-2">
                        <FileIcon className="h-6 w-6 text-green-600" />
                      </div>
                      <p className="font-medium mb-1">{pdfFile.name}</p>
                      <p className="text-sm text-gray-500 mb-2">{(pdfFile.size / 1024 / 1024).toFixed(2)} MB</p>
                      <button
                        type="button"
                        className="text-primary hover:underline text-sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          setPdfFile(null)
                          if (pdfInputRef.current) {
                            pdfInputRef.current.value = ""
                          }
                        }}
                      >
                        Remove file
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <div className="bg-gray-100 p-3 rounded-full mb-2">
                        <FileUp className="h-6 w-6 text-gray-600" />
                      </div>
                      <p className="font-medium mb-1">Click to upload PDF file</p>
                      <p className="text-sm text-gray-500">or drag and drop</p>
                    </div>
                  )}
                </div>
              </div>

              {/* ZIP File Upload (Optional) */}
              <div className="mb-6">
                <label className="block font-medium mb-2">Upload ZIP File (optional)</label>
                <div
                  className={`border-2 border-dashed border-black rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 transition-colors ${
                    zipFile ? "bg-green-50" : ""
                  }`}
                  onClick={() => zipInputRef.current?.click()}
                >
                  <input type="file" ref={zipInputRef} onChange={handleZipChange} accept=".zip" className="hidden" />

                  {zipFile ? (
                    <div className="flex flex-col items-center">
                      <div className="bg-green-100 p-3 rounded-full mb-2">
                        <FileIcon className="h-6 w-6 text-green-600" />
                      </div>
                      <p className="font-medium mb-1">{zipFile.name}</p>
                      <p className="text-sm text-gray-500 mb-2">{(zipFile.size / 1024 / 1024).toFixed(2)} MB</p>
                      <button
                        type="button"
                        className="text-primary hover:underline text-sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          setZipFile(null)
                          if (zipInputRef.current) {
                            zipInputRef.current.value = ""
                          }
                        }}
                      >
                        Remove file
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <div className="bg-gray-100 p-3 rounded-full mb-2">
                        <FileUp className="h-6 w-6 text-gray-600" />
                      </div>
                      <p className="font-medium mb-1">Click to upload ZIP file (optional)</p>
                      <p className="text-sm text-gray-500">or drag and drop</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Target Tier Selection */}
              <div className="mb-8">
                <label htmlFor="targetTier" className="block font-medium mb-2">
                  Select Target Tier <span className="text-red-500">*</span>
                </label>
                <select
                  id="targetTier"
                  value={targetTier}
                  onChange={(e) => setTargetTier(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="Q1">Q1</option>
                  <option value="Q2">Q2</option>
                  <option value="Q3">Q3</option>
                  <option value="Q4">Q4</option>
                </select>
              </div>

              <div className="text-center">
                <button
                  onClick={handleSubmit}
                  disabled={isLoading || !pdfFile || checkingSubscription}
                  className={`cartoon-button bg-primary text-white hover:bg-primary-hover ${
                    !pdfFile || checkingSubscription ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isLoading
                    ? "Processing..."
                    : checkingSubscription
                      ? "Checking subscription..."
                      : hasActiveSubscription
                        ? "Analyze Now"
                        : "Subscribe Now - ₹1/month"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
