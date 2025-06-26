"use client"

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <Link href="/">
            <Button variant="ghost" size="sm" className="mb-8 -ml-3">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          
          <h1 className="text-4xl font-bold text-black mb-4">Privacy Policy</h1>
          <p className="text-gray-600 text-lg leading-relaxed">
            How we collect, use, and protect your information when you use Template.
          </p>
          <p className="text-sm text-gray-500 mt-4">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          
          <h2 className="text-2xl font-semibold text-black mt-12 mb-6">Introduction</h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            Template ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our email template management service.
          </p>
          <p className="text-gray-700 leading-relaxed mb-8">
            By using Template, you agree to the collection and use of information in accordance with this policy.
          </p>

          <h2 className="text-2xl font-semibold text-black mt-12 mb-6">Information We Collect</h2>
          
          <h3 className="text-xl font-semibold text-black mt-8 mb-4">Personal Information</h3>
          <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2 mb-6">
            <li>Email address (for account creation and authentication)</li>
            <li>Name (if provided during registration)</li>
            <li>Profile information you choose to add</li>
          </ul>
          
          <h3 className="text-xl font-semibold text-black mt-8 mb-4">Template Data</h3>
          <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2 mb-6">
            <li>Email templates you create and store</li>
            <li>Template content, including text and formatting</li>
            <li>Template variables and personalization data</li>
            <li>Template usage statistics</li>
          </ul>

          <h3 className="text-xl font-semibold text-black mt-8 mb-4">Gmail Integration Data</h3>
          <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2 mb-6">
            <li>Gmail account email addresses you connect</li>
            <li>OAuth tokens for Gmail access (securely encrypted)</li>
            <li>Email sending history through our service</li>
            <li>Connection status and preferences</li>
          </ul>

          <h3 className="text-xl font-semibold text-black mt-8 mb-4">Technical Information</h3>
          <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2 mb-8">
            <li>IP address and device information</li>
            <li>Browser type and version</li>
            <li>Usage patterns and feature interactions</li>
            <li>Error logs and performance data</li>
          </ul>

          <h2 className="text-2xl font-semibold text-black mt-12 mb-6">How We Use Your Information</h2>
          <p className="text-gray-700 leading-relaxed mb-4">We use the information we collect for the following purposes:</p>
          <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2 mb-8">
            <li>Provide and maintain the Template service</li>
            <li>Process and authenticate your account</li>
            <li>Store and manage your email templates</li>
            <li>Enable Gmail integration and email sending functionality</li>
            <li>Improve our service and develop new features</li>
            <li>Communicate with you about your account and updates</li>
            <li>Ensure security and prevent fraud</li>
            <li>Comply with legal obligations</li>
          </ul>

          <h2 className="text-2xl font-semibold text-black mt-12 mb-6">Gmail Integration</h2>
          <p className="text-gray-700 leading-relaxed mb-4">When you connect your Gmail account to Template:</p>
          <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2 mb-6">
            <li>We use Gmail's OAuth 2.0 for secure authentication</li>
            <li>We only request the minimum permissions needed (send email on your behalf)</li>
            <li>We do not read, store, or access your existing Gmail messages</li>
            <li>OAuth tokens are encrypted and stored securely in our database</li>
            <li>You can disconnect your Gmail account at any time</li>
            <li>When disconnected, we securely delete your OAuth tokens</li>
          </ul>
          <p className="text-gray-700 leading-relaxed mb-8">
            <strong>Important:</strong> Template only sends emails through Gmail when you explicitly initiate the action. We never access your Gmail inbox or send emails without your direct instruction.
          </p>

          <h2 className="text-2xl font-semibold text-black mt-12 mb-6">Information Sharing</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            We do not sell, trade, or otherwise transfer your personal information to third parties, except in the following circumstances:
          </p>
          <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2 mb-8">
            <li><strong>Service Providers:</strong> We may share data with trusted third-party service providers who assist us in operating our service</li>
            <li><strong>Legal Requirements:</strong> We may disclose information if required by law or to protect our rights and safety</li>
            <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale, user information may be transferred as part of the transaction</li>
            <li><strong>Consent:</strong> We may share information with your explicit consent</li>
          </ul>

          <h2 className="text-2xl font-semibold text-black mt-12 mb-6">Data Security</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            We implement appropriate technical and organizational security measures to protect your information:
          </p>
          <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2 mb-6">
            <li>Data encryption in transit and at rest</li>
            <li>Secure authentication and access controls</li>
            <li>Regular security audits and updates</li>
            <li>OAuth tokens are encrypted using industry-standard methods</li>
            <li>Limited access to personal data on a need-to-know basis</li>
          </ul>
          <p className="text-gray-700 leading-relaxed mb-8">
            While we implement strong security measures, no method of transmission over the internet is 100% secure. We cannot guarantee absolute security of your information.
          </p>

          <h2 className="text-2xl font-semibold text-black mt-12 mb-6">Your Rights and Choices</h2>
          <p className="text-gray-700 leading-relaxed mb-4">You have the following rights regarding your personal information:</p>
          <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2 mb-6">
            <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
            <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
            <li><strong>Deletion:</strong> Request deletion of your personal information (subject to legal requirements)</li>
            <li><strong>Portability:</strong> Request transfer of your data to another service</li>
            <li><strong>Withdrawal:</strong> Withdraw consent for data processing where applicable</li>
            <li><strong>Restriction:</strong> Request limitation of processing in certain circumstances</li>
          </ul>
          <p className="text-gray-700 leading-relaxed mb-8">
            To exercise these rights or for any privacy-related questions, please contact us using the information provided below.
          </p>

          <h2 className="text-2xl font-semibold text-black mt-12 mb-6">Data Retention</h2>
          <p className="text-gray-700 leading-relaxed mb-4">We retain your information for as long as necessary to provide our services and comply with legal obligations:</p>
          <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2 mb-8">
            <li><strong>Account Data:</strong> Retained while your account is active and for 30 days after deletion</li>
            <li><strong>Template Data:</strong> Retained while your account is active and for 30 days after deletion</li>
            <li><strong>Gmail Tokens:</strong> Deleted immediately when you disconnect your Gmail account</li>
            <li><strong>Usage Logs:</strong> Retained for up to 12 months for security and improvement purposes</li>
          </ul>

          <h2 className="text-2xl font-semibold text-black mt-12 mb-6">Policy Updates</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            We may update this Privacy Policy from time to time. When we do, we will:
          </p>
          <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2 mb-6">
            <li>Update the "Last updated" date at the top of this policy</li>
            <li>Notify you of significant changes via email or through our service</li>
            <li>Provide the updated policy on our website</li>
          </ul>
          <p className="text-gray-700 leading-relaxed mb-8">
            Your continued use of Template after any changes indicates your acceptance of the updated Privacy Policy.
          </p>

          <h2 className="text-2xl font-semibold text-black mt-12 mb-6">Contact Us</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            If you have any questions about this Privacy Policy or our data practices, please contact us:
          </p>
          <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2 mb-8">
            <li><strong>Email:</strong> privacy@template.io</li>
            <li><strong>Support:</strong> support@template.io</li>
          </ul>
          <p className="text-gray-700 leading-relaxed mb-12">
            We are committed to resolving any privacy concerns promptly and transparently.
          </p>

        </div>
      </div>
    </div>
  )
} 