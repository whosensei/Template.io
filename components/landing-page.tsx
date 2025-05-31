"use client"

import { Button } from '@/components/ui/button'
import { ArrowRight, Mail, Sparkles } from 'lucide-react'
import Link from 'next/link'

export function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center space-y-8 mt-5">
        {/* Hero Section */}
        <div className="space-y-6">
          <div className="inline-flex items-center space-x-2 bg-gray-100 rounded-full px-4 py-2 text-sm text-gray-600 mb-6">
            <Sparkles className="h-4 w-4" />
            <span>Professional Email Templates</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 leading-tight tracking-tight">
            Craft Perfect
            <br />
            <span className="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Email Templates
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-light">
            Create, manage, and customize professional email templates for job applications, 
            business correspondence, and more. Streamline your communication with ease.
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-12 max-w-3xl mx-auto">
          <div className="text-center space-y-3">
            <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mx-auto">
              <Mail className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900">Template Library</h3>
            <p className="text-gray-600 text-sm">Build and organize your email templates</p>
          </div>
          
          <div className="text-center space-y-3">
            <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mx-auto">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900">Smart Variables</h3>
            <p className="text-gray-600 text-sm">Dynamic placeholders for personalization</p>
          </div>
          
          <div className="text-center space-y-3">
            <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mx-auto">
              <ArrowRight className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900">Quick Export</h3>
            <p className="text-gray-600 text-sm">Copy and use templates anywhere</p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="space-y-6 pt-8">
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/sign-up">
              <Button size="lg" className="bg-black hover:bg-gray-800 text-white px-8 py-4 text-lg font-medium rounded-full group">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/sign-in">
              <Button 
                variant="outline" 
                size="lg" 
                className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-700 bg-white px-8 py-4 text-lg font-medium rounded-full"
              >
                Sign In
              </Button>
            </Link>
          </div>
          
          <p className="text-sm text-gray-500">
            No credit card required • Start creating templates in minutes
          </p>
        </div>

        {/* Footer */}
        <div className="pt-16 pb-8">
          <p className="text-gray-400 text-sm">
            Built with ❤️ for professionals who value great communication
          </p>
        </div>
      </div>
    </div>
  )
} 