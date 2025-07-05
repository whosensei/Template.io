"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Mail, Users, Settings, Send, FileText, Globe, ArrowRight, Check } from "lucide-react"

interface WelcomeDialogProps {
  isOpen: boolean
  onClose: () => void
  onComplete: () => void
}

export function WelcomeDialog({ isOpen, onClose, onComplete }: WelcomeDialogProps) {
  const [currentStep, setCurrentStep] = useState(0)

  const steps = [
    {
      title: "Welcome to Template",
      subtitle: "Your professional email template manager",
      content: (
        <div className="text-center space-y-6">
          <div className="w-20 h-20 bg-card rounded-2xl shadow-lg mx-auto flex items-center justify-center">
            <img 
              src="/Email Template App Logo Jun 24 2025 (2).png" 
              alt="Template" 
              className="w-12 h-12 object-contain"
            />
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-card-foreground">
              Create stunning email templates in minutes
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Whether you're applying for jobs, reaching out to clients, or managing business communications, 
              Template makes it easy to create professional emails with dynamic variables.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Key Features",
      subtitle: "Everything you need for professional email templates",
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
                    <FileText className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-card-foreground">Template Editor</h4>
                    <p className="text-sm text-muted-foreground">Create and customize email templates</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
                    <Users className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-card-foreground">Dynamic Variables</h4>
                    <p className="text-sm text-muted-foreground">Personalize emails with custom variables</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
                    <Mail className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-card-foreground">Gmail Integration</h4>
                    <p className="text-sm text-muted-foreground">Send emails directly through Gmail</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
                    <Send className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-card-foreground">Live Preview</h4>
                    <p className="text-sm text-muted-foreground">See how your emails look before sending</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    },
    {
      title: "How It Works",
      subtitle: "Get started in just a few simple steps",
      content: (
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full aspect-square flex items-center justify-center text-sm font-medium">
                1
              </div>
              <div>
                <h4 className="font-medium text-card-foreground">Create Your Templates</h4>
                <p className="text-sm text-muted-foreground">
                  Use our editor to create professional email templates with dynamic variables like {'{{companyName}}'} and {'{{jobRole}}'}.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full aspect-square flex items-center justify-center text-sm font-medium">
                2
              </div>
              <div>
                <h4 className="font-medium text-card-foreground">Fill in Variables</h4>
                <p className="text-sm text-muted-foreground">
                  Enter specific values for each variable to personalize your emails for different recipients.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full aspect-square flex items-center justify-center text-sm font-medium">
                3
              </div>
              <div>
                <h4 className="font-medium text-card-foreground">Connect Gmail & Send</h4>
                <p className="text-sm text-muted-foreground">
                  Connect your Gmail account and send professional emails directly from Template.
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-muted p-4 rounded-xl">
            <div className="flex items-center space-x-2">
              <Check className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-card-foreground">Pro Tip:</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Add double curly braces around any word to turn it into a dynamic variable.
            </p>
          </div>
        </div>
      )
    }
  ]

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onComplete()
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSkip = () => {
    onComplete()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-foreground">
            {steps[currentStep].title}
          </DialogTitle>
          <p className="text-muted-foreground">
            {steps[currentStep].subtitle}
          </p>
        </DialogHeader>
        
        <div className="mt-6 mb-8 overflow-y-auto">
          {steps[currentStep].content}
        </div>
        
        {/* Progress indicators */}
        <div className="flex justify-center mb-6">
          <div className="flex space-x-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentStep ? 'bg-primary' : 'bg-muted-foreground'
                }`}
              />
            ))}
          </div>
        </div>
        
        {/* Navigation buttons */}
        <div className="flex justify-between items-center">
          <Button
            variant="ghost"
            onClick={handleSkip}
            className="text-muted-foreground hover:text-foreground"
          >
            Skip tour
          </Button>
          
          <div className="flex space-x-3">
            {currentStep > 0 && (
              <Button
                variant="outline"
                onClick={handlePrev}
                className="px-4 py-2"
              >
                Previous
              </Button>
            )}
            
            <Button
              onClick={handleNext}
              className="px-6 py-2"
            >
              {currentStep === steps.length - 1 ? (
                <>
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 