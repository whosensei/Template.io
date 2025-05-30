"use client"

import { Mail } from "lucide-react"

export function TemplateManagerHeader() {
  return (
    <div className="flex justify-between items-center mb-8">
      <div className="flex items-center gap-2">
        <Mail className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Email Template Manager</h1>
      </div>
    </div>
  )
} 