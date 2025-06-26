"use client"

import { Button } from '@/components/ui/button'
import { ArrowRight, Mail, Sparkles, Clock, Globe, Award, MousePointer } from 'lucide-react'
import Link from 'next/link'

export function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 font-sans">
      <div className="px-4">
        <div className="flex items-center justify-center min-h-screen">
          <div className="max-w-4xl mx-auto text-center space-y-8 py-4">
            {/* Hero Section */}
            <div className="space-y-6 font-['Inter',sans-serif]">
              <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full px-5 py-2.5 text-sm text-gray-700 mb-6 shadow-sm hover:shadow-md transition-all duration-300">
                <Sparkles className="h-4 w-4 text-black" />
                <span className="font-medium">Professional Email Templates</span>
              </div>

              <h1 className="text-4xl md:text-6xl xl:text-7xl font-semibold text-gray-900 leading-[0.9] tracking-tight">
                Craft Perfect
                <br />
                <span className="bg-gradient-to-r from-gray-900 via-gray-700 to-gray-600 bg-clip-text text-transparent">
                  Email Templates
                </span>
              </h1>

              <p className="text-lg md:text-xl xl:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-light">
                Create, manage, and customize professional email templates for job applications, 
                business correspondence, and more. Streamline your communication with ease.
              </p>
            </div>

            {/* CTA Section */}
            <div className="space-y-6 pt-2">
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/sign-up">
                  <Button size="lg" className="bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white px-10 py-4 text-lg font-semibold rounded-2xl group shadow-xl hover:shadow-2xl transition-all duration-300">
                    Get Started Free
                    <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                  </Button>
                </Link>
                <Link href="/sign-in">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="border-2 border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900 hover:border-gray-400 bg-white/80 backdrop-blur-sm px-10 py-4 text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Sign In
                  </Button>
                </Link>
              </div>
              
              <p className="text-sm text-gray-500 font-medium">
                No credit card required • Start creating templates in minutes
              </p>
            </div>

            {/* Features - Compact */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 pt-8 max-w-4xl mx-auto font-['Inter',sans-serif]">
              <div className="group text-center space-y-3 p-4 rounded-2xl hover:bg-white/50 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-gray-900 to-gray-700 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                  <img 
                    src="/Email Template App Logo Jun 24 2025 (1).png" 
                    alt="Template.io" 
                    className="w-7 h-7 object-contain"
                  />
                </div>
                <h3 className="font-semibold text-gray-900">Template Library</h3>
                <p className="text-gray-600 text-sm leading-relaxed">Build and organize your email templates</p>
              </div>
              
              <div className="group text-center space-y-3 p-4 rounded-2xl hover:bg-white/50 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-gray-900 to-gray-700 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900">Smart Variables</h3>
                <p className="text-gray-600 text-sm leading-relaxed">Dynamic placeholders for personalization</p>
              </div>
              
              <div className="group text-center space-y-3 p-4 rounded-2xl hover:bg-white/50 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-gray-900 to-gray-700 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                  <ArrowRight className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900">Quick Export</h3>
                <p className="text-gray-600 text-sm leading-relaxed">Copy and use templates anywhere</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* App Details Section */}
      <section className="bg-gradient-to-b from-white to-gray-50 py-20 px-10 font-['Inter',sans-serif]">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-20">
            <div className="inline-flex items-center space-x-2 bg-gray-100 rounded-full px-4 py-2 text-sm text-gray-600 mb-6">
              <Award className="h-4 w-4" />
              <span className="font-medium">Why Choose Template</span>
            </div>
            <h2 className="text-3xl md:text-4xl xl:text-5xl font-semibold text-black mb-6 leading-tight">
              Built for professionals who
              <br />
              <span className="text-gray-600">value great communication</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-light">
              Every feature is designed to help you create better emails faster
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {/* Feature 1 */}
            <div className="group bg-white rounded-3xl p-8 border border-gray-100 hover:border-gray-200 hover:shadow-xl transition-all duration-300">
              <div className="flex items-start space-x-5">
                <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-gray-900 to-gray-700 rounded-2xl flex items-center justify-center group-hover:scale-105 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                  <Clock className="h-7 w-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-black mb-3">Simple & Fast</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Create professional email templates in minutes, not hours. Our intuitive interface makes template creation effortless and enjoyable.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group bg-white rounded-3xl p-8 border border-gray-100 hover:border-gray-200 hover:shadow-xl transition-all duration-300">
              <div className="flex items-start space-x-5">
                <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-gray-900 to-gray-700 rounded-2xl flex items-center justify-center group-hover:scale-105 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                  <Globe className="h-7 w-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-black mb-3">Always Available</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Access your templates from anywhere with an internet connection. Your work is saved automatically and always available when you need it.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group bg-white rounded-3xl p-8 border border-gray-100 hover:border-gray-200 hover:shadow-xl transition-all duration-300">
              <div className="flex items-start space-x-5">
                <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-gray-900 to-gray-700 rounded-2xl flex items-center justify-center group-hover:scale-105 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                  <Award className="h-7 w-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-black mb-3">Professional Quality</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Create templates that look polished and professional. Perfect for job applications, business outreach, and client communication.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="group bg-white rounded-3xl p-8 border border-gray-100 hover:border-gray-200 hover:shadow-xl transition-all duration-300">
              <div className="flex items-start space-x-5">
                <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-gray-900 to-gray-700 rounded-2xl flex items-center justify-center group-hover:scale-105 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                  <MousePointer className="h-7 w-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-black mb-3">Easy to Use</h3>
                  <p className="text-gray-600 leading-relaxed">
                    No complex features or confusing interfaces. Just simple, intuitive tools that help you create great email templates quickly.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <div className="px-4 pb-10">
        <footer className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl max-w-4xl mx-auto shadow-2xl">
          <div className="px-8 py-10">
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-6 sm:space-y-0">
              {/* Brand */}
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <img 
                    src="/Email Template App Logo Jun 24 2025 (1).png" 
                    alt="Template.io" 
                    className="w-5 h-5 object-contain"
                  />
                </div>
                <span className="font-bold text-white text-lg">Template</span>
              </div>

              {/* Links */}
              <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-8 text-sm">
                <div className="flex items-center space-x-6">
                  <Link href="/sign-up" className="text-gray-300 hover:text-white font-medium transition-colors duration-200">
                    Get Started
                  </Link>
                  <Link href="/sign-in" className="text-gray-300 hover:text-white font-medium transition-colors duration-200">
                    Sign In
                  </Link>
                </div>
                <div className="flex items-center space-x-6 text-xs">
                  <Link href="/privacy" className="text-gray-400 hover:text-gray-200 transition-colors duration-200">
                    Privacy Policy
                  </Link>
                  <Link href="/terms" className="text-gray-400 hover:text-gray-200 transition-colors duration-200">
                    Terms of Service
                  </Link>
                </div>
              </div>

              {/* Copyright */}
              <div className="text-sm text-gray-400 font-medium">
                © 2025 Template
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
} 