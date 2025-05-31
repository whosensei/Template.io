import { SignUp } from '@clerk/nextjs'
import { Mail } from 'lucide-react'
import Link from 'next/link'

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto">
        {/* Logo/Brand */}
        <div className="text-center mb-8 pr-14">
          <Link href="/" className="inline-flex items-center space-x-2 text-black hover:opacity-80 transition-opacity">
            <Mail className="h-8 w-8" />
            <span className="text-2xl font-bold">Template</span>
          </Link>
        </div>
        
        <div className="text-center mb-8 pr-14">
          <h2 className="text-3xl font-bold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Start creating professional email templates
          </p>
        </div>
        
        <div className="flex justify-center">
          <SignUp 
            appearance={{
              elements: {
                formButtonPrimary: 'bg-black hover:bg-gray-800 text-white rounded-lg',
                card: 'shadow-lg border border-gray-200 rounded-xl w-full',
                headerTitle: 'hidden',
                headerSubtitle: 'hidden',
                socialButtonsIconButton: 'border-gray-300 hover:bg-gray-50',
                dividerLine: 'bg-gray-200',
                dividerText: 'text-gray-500',
                formFieldInput: 'border-gray-300 focus:border-black focus:ring-1 focus:ring-black',
                footerActionLink: 'text-black hover:text-gray-700',
                rootBox: 'w-full',
              },
              variables: {
                borderRadius: '12px',
              }
            }}
          />
        </div>
        
        <div className="text-center mt-6 pr-14">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/sign-in" className="font-medium text-black hover:text-gray-700">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
} 