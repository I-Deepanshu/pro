"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useAuth } from "./auth-provider"
import { Menu, X } from "lucide-react"

export function Header() {
  const { user, logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="bg-white border-b-4 border-black sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-wbjUQTJJSqhVinv7dKi172mshRPrUZ.png"
            alt="Resify Logo"
            width={120}
            height={60}
            className="cartoon-shadow"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/" className="font-cartoon text-lg hover:text-primary transition-colors">
            Home
          </Link>
          <Link href="/about" className="font-cartoon text-lg hover:text-primary transition-colors">
            About
          </Link>
          <Link href="/service" className="font-cartoon text-lg hover:text-primary transition-colors">
            Service
          </Link>
          {user ? (
            <>
              <Link href="/dashboard" className="font-cartoon text-lg hover:text-primary transition-colors">
                Dashboard
              </Link>
              <button onClick={logout} className="cartoon-button bg-primary text-white hover:bg-primary-hover">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="font-cartoon text-lg hover:text-primary transition-colors">
                Login
              </Link>
              <Link href="/register" className="cartoon-button bg-primary text-white hover:bg-primary-hover">
                Register
              </Link>
            </>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <nav className="md:hidden bg-white border-t-2 border-black">
          <div className="container mx-auto px-4 py-3 flex flex-col space-y-4">
            <Link
              href="/"
              className="font-cartoon text-lg py-2 hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/about"
              className="font-cartoon text-lg py-2 hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/service"
              className="font-cartoon text-lg py-2 hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Service
            </Link>
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="font-cartoon text-lg py-2 hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    logout()
                    setMobileMenuOpen(false)
                  }}
                  className="cartoon-button bg-primary text-white hover:bg-primary-hover w-full"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="font-cartoon text-lg py-2 hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="cartoon-button bg-primary text-white hover:bg-primary-hover block text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </nav>
      )}
    </header>
  )
}
