import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Image from "next/image"
import Link from "next/link"

export default function About() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow py-12">
        <div className="container mx-auto px-4">
          <h1 className="font-cartoon text-4xl text-center mb-8">
            <span className="bg-secondary text-white px-4 py-2 rounded-lg cartoon-shadow">About Resify</span>
          </h1>

          <div className="max-w-4xl mx-auto">
            <div className="cartoon-border bg-white p-8 mb-8">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="md:w-1/3 flex justify-center">
                  <div className="relative">
                    <div className="cartoon-border bg-white p-4 rotate-3 transform transition-transform hover:rotate-0">
                      <Image
                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-wbjUQTJJSqhVinv7dKi172mshRPrUZ.png"
                        alt="Resify Logo"
                        width={200}
                        height={200}
                        className="w-full h-auto"
                      />
                    </div>
                  </div>
                </div>
                <div className="md:w-2/3">
                  <h2 className="font-cartoon text-2xl mb-4">Our Story</h2>
                  <p className="mb-4">
                    Resify was founded in 2023 with a simple mission: to make advanced document analysis accessible to
                    everyone. We believe that the power of AI should be available to all, not just large corporations
                    with extensive resources.
                  </p>
                  <p>
                    Our team of AI experts and developers has created a platform that leverages cutting-edge machine
                    learning models to provide valuable insights from any text document, helping users make better
                    decisions and save time.
                  </p>
                </div>
              </div>
            </div>

            <div className="cartoon-border bg-white p-8 mb-8">
              <h2 className="font-cartoon text-2xl mb-6 text-center">What Makes Us Special</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 border-2 border-black rounded-lg bg-gray-50">
                  <div className="bg-primary w-12 h-12 rounded-full flex items-center justify-center mb-4 cartoon-shadow">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <h3 className="font-cartoon text-xl mb-2">Advanced AI Technology</h3>
                  <p>
                    We use state-of-the-art machine learning models deployed on Hugging Face to analyze documents with
                    high accuracy and speed.
                  </p>
                </div>

                <div className="p-4 border-2 border-black rounded-lg bg-gray-50">
                  <div className="bg-secondary w-12 h-12 rounded-full flex items-center justify-center mb-4 cartoon-shadow">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-white"
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
                  <p>
                    Your documents are processed with the highest security standards, ensuring your sensitive
                    information remains protected.
                  </p>
                </div>

                <div className="p-4 border-2 border-black rounded-lg bg-gray-50">
                  <div className="bg-primary w-12 h-12 rounded-full flex items-center justify-center mb-4 cartoon-shadow">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="font-cartoon text-xl mb-2">Affordable Pricing</h3>
                  <p>
                    At just ₹500 per use, our service is accessible to individuals and businesses of all sizes, with no
                    hidden fees or subscriptions.
                  </p>
                </div>

                <div className="p-4 border-2 border-black rounded-lg bg-gray-50">
                  <div className="bg-secondary w-12 h-12 rounded-full flex items-center justify-center mb-4 cartoon-shadow">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                  </div>
                  <h3 className="font-cartoon text-xl mb-2">User-Friendly Interface</h3>
                  <p>
                    Our cartoonish design makes the platform fun and easy to use, while still delivering
                    professional-grade results.
                  </p>
                </div>
              </div>
            </div>

            <div className="cartoon-border bg-white p-8">
              <h2 className="font-cartoon text-2xl mb-6 text-center">Our Team</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="cartoon-border bg-gray-100 p-4 mb-4 mx-auto w-32 h-32 rounded-full overflow-hidden">
                    <Image
                      src="https://placehold.co/128x128" // Replace with your image URL for Sanjana Murgod
                      alt="Sanjana Murgod"
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-cartoon text-xl mb-1">SANJANA MURGOD</h3>
                  <p className="text-gray-600 mb-2">CEO</p>
                  <p className="text-sm">
                    AI enthusiast with expertise in machine learning and natural language processing.
                  </p>
                  </div>

                <div className="text-center">
                  <div className="cartoon-border bg-gray-100 p-4 mb-4 mx-auto w-32 h-32 rounded-full overflow-hidden">
                    <Image
                      src="/images/kartik.jpg" // Replace with your image URL for Kartik Garg
                      alt="Kartik Garg"
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-cartoon text-xl mb-1">KARTIK GARG</h3>
                  <p className="text-gray-600 mb-2">CMO</p>
                  <p className="text-sm">
                    Marketing expert with a passion for bringing innovative AI solutions to market.
                  </p>
                </div>
              </div>

              <div className="mt-12 text-center">
                <Link
                  href="/service"
                  className="cartoon-button bg-primary text-white hover:bg-primary-hover inline-block"
                >
                  Try Our Service
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
