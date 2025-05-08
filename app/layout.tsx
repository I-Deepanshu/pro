import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/components/auth-provider"
import { initializeDatabase } from "@/lib/db-init"

// Initialize database in the server component, but don't block rendering if it fails
if (process.env.MONGODB_URI) {
  initializeDatabase().catch(console.error)
} else {
  console.warn("MongoDB URI not found. Database initialization skipped.")
}

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

export const metadata: Metadata = {
  title: "Resify - AI-Powered Document Analysis",
  description: "Analyze your documents with our advanced AI model",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Fredoka+One&display=swap" rel="stylesheet" />
      </head>
      <body className={`${inter.variable} font-sans bg-background min-h-screen`}>
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="light">
            {children}
            <Toaster />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
