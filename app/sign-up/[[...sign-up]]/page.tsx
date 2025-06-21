import { SignUp } from '@clerk/nextjs'
import { Mail } from 'lucide-react'
import Link from 'next/link'

export default function Page() {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <img
          alt=""
          src="/White Clouds Photo.jpg"
          className="absolute inset-0 h-full w-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <div>
            <Link href="/" className="inline-flex items-center space-x-3">
              <Mail className="h-8 w-8" />
              <span className="text-2xl font-bold">Template.io</span>
            </Link>
          </div>
          <div>
            <h1 className="text-4xl font-bold mb-4 tracking-tighter">
              Start creating amazing email templates
            </h1>
            <p className="text-xl text-white/90 tracking-tighter">
              Join thousands of users who trust Template.io for their email template needs.
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <Link href="/" className="inline-flex items-center space-x-3 text-gray-900">
              <Mail className="h-8 w-8" />
              <span className="text-2xl font-bold">Template.io</span>
            </Link>
          </div>

          <div className="text-center mb-8 pr-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Create your account
            </h2>
            <p className="text-gray-600">
              Get started with your free account today
            </p>
          </div>

          <SignUp 
            signInUrl="/sign-in"
            appearance={{
              elements: {
                formButtonPrimary: 'bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-medium py-3 transition-colors',
                card: 'shadow-none border-0 bg-transparent w-full',
                headerTitle: 'hidden',
                headerSubtitle: 'hidden',
                socialButtonsIconButton: 'border-gray-300 hover:bg-gray-50 transition-colors rounded-lg',
                dividerLine: 'bg-gray-200',
                dividerText: 'text-gray-500 text-sm',
                formFieldInput: 'border-gray-300 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 rounded-lg',
                footerActionLink: 'text-gray-900 hover:text-gray-700 font-medium',
                rootBox: 'w-full',
                formFieldLabel: 'text-gray-700 font-medium text-sm',
              },
              variables: {
                borderRadius: '8px',
                fontSize: '14px',
              }
            }}
          />
        </div>
      </div>
    </div>
  )
}