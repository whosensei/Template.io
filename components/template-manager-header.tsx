"use client"

import { Mail } from "lucide-react"

export function TemplateManagerHeader() {
  return (
    <div className="border-b border-gray-200 pb-6 mb-8">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <Mail className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-medium text-gray-900">Email Templates</h1>
          <p className="text-gray-600 mt-1">Create and manage professional email templates</p>
        </div>
      </div>
    </div>
  )
} 