"use client"

import { signIn, getSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail } from "lucide-react"

export default function SignUpPage() {
  const [isLoading, setIsLoading] = useState({
    google: false,
    github: false,
    credentials: false
  })
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/'

  useEffect(() => {
    // Check if user is already signed in
    getSession().then((session) => {
      if (session) {
        router.push(callbackUrl)
      }
    })
  }, [router, callbackUrl])

  const handleOAuthSignUp = async (provider: 'google' | 'github') => {
    setIsLoading(prev => ({ ...prev, [provider]: true }))
    try {
      await signIn(provider, { callbackUrl })
    } catch (error) {
      console.error('Sign-up error:', error)
      setError('Failed to sign up. Please try again.')
    } finally {
      setIsLoading(prev => ({ ...prev, [provider]: false }))
    }
  }

  const handleCredentialsSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.email || !formData.password) return
    
    setError('')
    setIsLoading(prev => ({ ...prev, credentials: true }))
    
    try {
      // Register user first
      const registerResponse = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      const registerData = await registerResponse.json()
      
      if (!registerResponse.ok) {
        setError(registerData.error || 'Failed to create account')
        return
      }
      
      // Auto sign in after successful registration
      const result = await signIn('credentials', { 
        email: formData.email, 
        password: formData.password,
        callbackUrl,
        redirect: false
      })
      
      if (result?.error) {
        setError('Account created but failed to sign in. Please try signing in manually.')
      } else if (result?.ok) {
        setSuccess(true)
        setTimeout(() => router.push(callbackUrl), 1500)
      }
    } catch (error) {
      console.error('Sign-up error:', error)
      setError('Failed to create account. Please try again.')
    } finally {
      setIsLoading(prev => ({ ...prev, credentials: false }))
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Background Image */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/Cloud Photo Sunset.jpg')"
          }}
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 flex flex-col justify-end p-12 text-white">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold">Join Template.io today</h1>
            <p className="text-xl opacity-90">
              Start creating stunning email templates in minutes, not hours.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Sign Up Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white lg:w-1/2">
        <div className="w-full max-w-md mx-auto">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 bg-black rounded-2xl shadow-sm flex items-center justify-center border border-gray-100">
              <img 
                src="/Email Template App Logo Jun 24 2025 (2).png" 
                alt="Template.io" 
                className="w-12 h-12 object-contain"
              />
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">Create your account</h1>
            <p className="text-gray-500">Get started with your free account today</p>
          </div>

          {/* Success State */}
          {success ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
                <Mail className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Account created!</h3>
              <p className="text-gray-500">
                Redirecting you to your dashboard...
              </p>
            </div>
          ) : (
            <>
              {/* Error Message */}
              {error && (
                <div className="mb-6 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl">
                  {error}
                </div>
              )}

              {/* Sign Up Form */}
              <form onSubmit={handleCredentialsSignUp} className="space-y-6 mb-8">
                {/* Email Input */}
                <div>
                  <Label htmlFor="email" className="sr-only">
                    Email address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    required
                    className="h-14 text-base bg-white border-gray-200 rounded-xl px-4 placeholder:text-gray-400 focus:border-gray-800 focus:ring-gray-800"
                  />
                </div>

                {/* Password Input */}
                <div>
                  <Label htmlFor="password" className="sr-only">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create a password (min. 6 characters)"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    required
                    minLength={6}
                    className="h-14 text-base bg-white border-gray-200 rounded-xl px-4 placeholder:text-gray-400 focus:border-gray-800 focus:ring-gray-800"
                  />
                </div>

                {/* Create Account Button */}
                <Button
                  type="submit"
                  loading={isLoading.credentials}
                  loadingText="Creating account..."
                  disabled={!formData.email || !formData.password}
                  className="w-full h-14 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-base font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Mail className="w-5 h-5 mr-2" />
                  Sign up with email
                </Button>
              </form>

              {/* Divider */}
              <div className="relative mb-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white px-4 text-gray-500 text-sm font-medium">OR</span>
                </div>
              </div>

              {/* Social Login Buttons */}
              <div className="space-y-4 mb-8">
                <button
                  type="button"
                  onClick={() => handleOAuthSignUp('google')}
                  disabled={isLoading.google}
                  className="group relative w-full h-14 bg-white border border-gray-200 hover:border-gray-300 text-gray-700 rounded-xl text-base font-medium transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:shadow-md overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-offset-2"
                >
                  {/* Background gradient on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-red-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>

                  {/* Button content */}
                  <div className="relative flex items-center justify-center">
                    {isLoading.google ? (
                      <div className="w-5 h-5 mr-3 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin"></div>
                    ) : (
                      <div className="mr-3 p-1 bg-white rounded-full shadow-sm group-hover:shadow-md transition-shadow duration-300">
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                          <path
                            fill="#4285F4"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          />
                          <path
                            fill="#34A853"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          />
                          <path
                            fill="#EA4335"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          />
                        </svg>
                      </div>
                    )}
                    <span className="group-hover:text-gray-800 transition-colors duration-300">
                      {isLoading.google ? "Signing up..." : "Sign up with Google"}
                    </span>
                  </div>

                  {/* Bottom shadow/depth effect */}
                  <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-blue-200 via-green-200 to-red-200 opacity-0 group-hover:opacity-60 transition-opacity duration-300 rounded-b-xl"></div>
                </button>

                <button
                  type="button"
                  onClick={() => handleOAuthSignUp('github')}
                  disabled={isLoading.github}
                  className="group relative w-full h-14 bg-white border border-gray-200 hover:border-gray-800 text-gray-700 rounded-xl text-base font-medium transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:shadow-md overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-offset-2"
                >
                  {/* Background gradient on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-50 to-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>

                  {/* Button content */}
                  <div className="relative flex items-center justify-center">
                    {isLoading.github ? (
                      <div className="w-5 h-5 mr-3 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin"></div>
                    ) : (
                      <div className="mr-3 p-1 bg-white rounded-full shadow-sm group-hover:shadow-md group-hover:bg-gray-900 transition-all duration-300">
                        <svg
                          className="w-5 h-5 group-hover:text-white transition-colors duration-300"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                        </svg>
                      </div>
                    )}
                    <span className="group-hover:text-gray-800 transition-colors duration-300">
                      {isLoading.github ? "Signing up..." : "Sign up with GitHub"}
                    </span>
                  </div>

                  {/* Bottom shadow/depth effect */}
                  <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-gray-300 to-gray-500 opacity-0 group-hover:opacity-60 transition-opacity duration-300 rounded-b-xl"></div>
                </button>
              </div>

              {/* Footer */}
              <div className="text-center">
                <p className="text-sm text-gray-500 leading-relaxed mb-4">
                  By signing up, you acknowledge that you have both read and agree to Template.io's{" "}
                  <Link href="/terms" className="text-gray-900 font-medium hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy-policy" className="text-gray-900 font-medium hover:underline">
                    Privacy Policy
                  </Link>
                  .
                </p>
                <p className="text-sm text-gray-500">
                  Already have an account?{" "}
                  <Link href="/sign-in" className="text-gray-900 font-medium hover:underline">
                    Sign in
                  </Link>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}