import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-secondary py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-8 md:mb-0">
                <h1 className="font-cartoon text-4xl md:text-5xl lg:text-6xl text-white cartoon-shadow mb-6">
                  Unlock the Power of Your Documents
                </h1>
                <p className="text-white text-lg mb-8 max-w-lg">
                  Resify uses advanced AI to analyze your documents and extract valuable insights. Try our service
                  today!
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/service"
                    className="cartoon-button bg-primary text-white hover:bg-primary-hover inline-block text-center"
                  >
                    Try Now
                  </Link>
                  <Link
                    href="/about"
                    className="cartoon-button bg-white text-primary hover:bg-gray-100 inline-block text-center"
                  >
                    Learn More
                  </Link>
                </div>
              </div>
              <div className="md:w-1/2 flex justify-center">
                <div className="relative w-full max-w-md">
                  <div className="cartoon-border bg-white p-6 rounded-xl rotate-3 transform transition-transform hover:rotate-0">
                    <Image
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-wbjUQTJJSqhVinv7dKi172mshRPrUZ.png"
                      alt="Resify Logo"
                      width={300}
                      height={300}
                      className="w-full h-auto animate-bounce-slow"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="font-cartoon text-3xl md:text-4xl text-center mb-12">
              <span className="bg-primary text-white px-4 py-2 rounded-lg cartoon-shadow">Our Amazing Features</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="cartoon-border bg-white p-6 hover:bg-gray-50 transition-colors">
                <div className="bg-secondary w-16 h-16 rounded-full flex items-center justify-center mb-4 cartoon-shadow">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h3 className="font-cartoon text-xl mb-2">Advanced Document Analysis</h3>
                <p>Our AI model can analyze various document types and extract meaningful insights.</p>
              </div>

              {/* Feature 2 */}
              <div className="cartoon-border bg-white p-6 hover:bg-gray-50 transition-colors">
                <div className="bg-primary w-16 h-16 rounded-full flex items-center justify-center mb-4 cartoon-shadow">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <h3 className="font-cartoon text-xl mb-2">Secure Processing</h3>
                <p>Your documents are processed securely with state-of-the-art encryption and privacy measures.</p>
              </div>

              {/* Feature 3 */}
              <div className="cartoon-border bg-white p-6 hover:bg-gray-50 transition-colors">
                <div className="bg-secondary w-16 h-16 rounded-full flex items-center justify-center mb-4 cartoon-shadow">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="font-cartoon text-xl mb-2">Fast Results</h3>
                <p>Get analysis results in seconds, allowing you to make quick decisions based on your documents.</p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 bg-gray-100">
          <div className="container mx-auto px-4">
            <h2 className="font-cartoon text-3xl md:text-4xl text-center mb-12">
              <span className="bg-secondary text-white px-4 py-2 rounded-lg cartoon-shadow">How It Works</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* Step 1 */}
              <div className="text-center">
                <div className="bg-primary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 cartoon-shadow">
                  <span className="font-cartoon text-white text-2xl">1</span>
                </div>
                <h3 className="font-cartoon text-xl mb-2">Register</h3>
                <p>Create an account to get started with Resify.</p>
              </div>

              {/* Step 2 */}
              <div className="text-center">
                <div className="bg-primary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 cartoon-shadow">
                  <span className="font-cartoon text-white text-2xl">2</span>
                </div>
                <h3 className="font-cartoon text-xl mb-2">Subscribe</h3>
                <p>Pay ₹10 per month to access our AI service.</p>
              </div>

              {/* Step 3 */}
              <div className="text-center">
                <div className="bg-primary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 cartoon-shadow">
                  <span className="font-cartoon text-white text-2xl">3</span>
                </div>
                <h3 className="font-cartoon text-xl mb-2">Upload Document</h3>
                <p>Upload the document you want to analyze.</p>
              </div>

              {/* Step 4 */}
              <div className="text-center">
                <div className="bg-primary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 cartoon-shadow">
                  <span className="font-cartoon text-white text-2xl">4</span>
                </div>
                <h3 className="font-cartoon text-xl mb-2">Get Results</h3>
                <p>Receive detailed analysis and insights from your document.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-primary">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-cartoon text-3xl md:text-4xl text-white mb-6 cartoon-shadow">Ready to Try Resify?</h2>
            <p className="text-white text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of users who are already benefiting from our advanced document analysis service.
            </p>
            <Link href="/register" className="cartoon-button bg-white text-primary hover:bg-gray-100 inline-block">
              Get Started Now
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
