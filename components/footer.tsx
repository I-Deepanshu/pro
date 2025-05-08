import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-white border-t-4 border-black py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-cartoon text-xl mb-4">Resify</h3>
            <p className="mb-4">
              AI-powered document analysis service that helps you extract valuable insights from your documents.
            </p>
          </div>

          <div>
            <h3 className="font-cartoon text-xl mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-primary transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/service" className="hover:text-primary transition-colors">
                  Service
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-primary transition-colors">
                  Login
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-cartoon text-xl mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li>Email: info@resify.com</li>
              <li>Phone: +91 1234567890</li>
              <li>Address: Tech Park, Bangalore, India</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-gray-200 text-center">
          <p>&copy; {new Date().getFullYear()} Resify. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
