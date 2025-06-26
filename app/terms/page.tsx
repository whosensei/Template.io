"use client"

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function TermsOfService() {
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
          
          <h1 className="text-4xl font-bold text-black mb-4">Terms of Service</h1>
          <p className="text-gray-600 text-lg leading-relaxed">
            These terms govern your use of Template, our email template management service.
          </p>
          <p className="text-sm text-gray-500 mt-4">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          
          <h2 className="text-2xl font-semibold text-black mt-12 mb-6">Agreement to Terms</h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            By accessing or using Template ("the Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, you may not access or use the Service.
          </p>
          <p className="text-gray-700 leading-relaxed mb-8">
            These Terms constitute a legally binding agreement between you and Template ("we," "our," or "us"). Your use of the Service is also governed by our Privacy Policy, which is incorporated by reference into these Terms.
          </p>

          <h2 className="text-2xl font-semibold text-black mt-12 mb-6">Service Description</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Template is a web-based email template management service that allows users to:
          </p>
          <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2 mb-6">
            <li>Create, edit, and organize email templates</li>
            <li>Use dynamic variables for template personalization</li>
            <li>Connect Gmail accounts for sending emails</li>
            <li>Manage and store template libraries</li>
            <li>Send emails using stored templates through Gmail integration</li>
          </ul>
          <p className="text-gray-700 leading-relaxed mb-8">
            We reserve the right to modify, suspend, or discontinue any aspect of the Service at any time, with or without notice.
          </p>

          <h2 className="text-2xl font-semibold text-black mt-12 mb-6">User Accounts and Registration</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            To use Template, you must create an account. When creating an account, you agree to:
          </p>
          <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2 mb-6">
            <li>Provide accurate, current, and complete information</li>
            <li>Maintain and promptly update your account information</li>
            <li>Maintain the security and confidentiality of your account credentials</li>
            <li>Accept all responsibility for activities that occur under your account</li>
            <li>Notify us immediately of any unauthorized use of your account</li>
          </ul>
          <p className="text-gray-700 leading-relaxed mb-8">
            You must be at least 13 years old to use Template. If you are under 18, you represent that you have parental or guardian consent to use the Service.
          </p>

          <h2 className="text-2xl font-semibold text-black mt-12 mb-6">Acceptable Use Policy</h2>
          <p className="text-gray-700 leading-relaxed mb-4">You agree to use Template only for lawful purposes. You may not:</p>
          <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2 mb-6">
            <li>Send spam, unsolicited emails, or bulk communications</li>
            <li>Use the Service for fraudulent, deceptive, or misleading purposes</li>
            <li>Violate any laws, regulations, or third-party rights</li>
            <li>Transmit malicious code, viruses, or harmful content</li>
            <li>Harass, abuse, or harm others through the Service</li>
            <li>Attempt to gain unauthorized access to our systems</li>
            <li>Reverse engineer, modify, or create derivative works of the Service</li>
            <li>Use the Service to compete with Template or develop competing products</li>
          </ul>
          <p className="text-gray-700 leading-relaxed mb-8">
            <strong>Important:</strong> Violation of these terms may result in immediate suspension or termination of your account without notice.
          </p>

          <h2 className="text-2xl font-semibold text-black mt-12 mb-6">Gmail Integration Terms</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            When using Gmail integration with Template:
          </p>
          <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2 mb-6">
            <li>You grant Template permission to send emails on your behalf through your connected Gmail account</li>
            <li>You remain solely responsible for all emails sent through the Service</li>
            <li>You must comply with Gmail's Terms of Service and Google's policies</li>
            <li>You can revoke Template's access to your Gmail account at any time</li>
            <li>You acknowledge that Template does not store or access your Gmail messages</li>
            <li>You are responsible for ensuring your Gmail account remains in good standing</li>
          </ul>
          <p className="text-gray-700 leading-relaxed mb-8">
            Template is not responsible for any issues with Gmail's service or changes to Gmail's API that may affect functionality.
          </p>

          <h2 className="text-2xl font-semibold text-black mt-12 mb-6">Your Content and Data</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            You retain ownership of all content you create, upload, or store in Template, including:
          </p>
          <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2 mb-6">
            <li>Email templates and their content</li>
            <li>Template variables and personalization data</li>
            <li>Any other information you provide to the Service</li>
          </ul>
          <p className="text-gray-700 leading-relaxed mb-4">
            By using Template, you grant us a limited, non-exclusive license to:
          </p>
          <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2 mb-6">
            <li>Store and process your content to provide the Service</li>
            <li>Send emails on your behalf through Gmail integration</li>
            <li>Create backups and ensure service availability</li>
            <li>Improve the Service through anonymized usage analytics</li>
          </ul>
          <p className="text-gray-700 leading-relaxed mb-8">
            You are responsible for ensuring your content does not violate any laws or infringe on third-party rights.
          </p>

          <h2 className="text-2xl font-semibold text-black mt-12 mb-6">Service Availability and Support</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            We strive to maintain high availability of Template, but we do not guarantee:
          </p>
          <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2 mb-6">
            <li>100% uptime or uninterrupted access to the Service</li>
            <li>That the Service will be error-free or bug-free</li>
            <li>Compatibility with all devices or browsers</li>
            <li>Availability of any specific features or functionality</li>
          </ul>
          <p className="text-gray-700 leading-relaxed mb-8">
            We may perform maintenance, updates, or modifications that temporarily interrupt the Service. We will provide reasonable notice when possible, but some interruptions may occur without advance warning.
          </p>

          <h2 className="text-2xl font-semibold text-black mt-12 mb-6">Disclaimers and Limitation of Liability</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            <strong>TEMPLATE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND.</strong> We disclaim all warranties, whether express, implied, or statutory, including but not limited to:
          </p>
          <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2 mb-6">
            <li>Warranties of merchantability and fitness for a particular purpose</li>
            <li>Warranties that the Service will meet your specific requirements</li>
            <li>Warranties that data transmission will be secure or error-free</li>
            <li>Warranties regarding third-party services (including Gmail)</li>
          </ul>
          <p className="text-gray-700 leading-relaxed mb-4">
            <strong>LIMITATION OF LIABILITY:</strong> To the maximum extent permitted by law, Template shall not be liable for:
          </p>
          <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2 mb-8">
            <li>Any indirect, incidental, special, or consequential damages</li>
            <li>Loss of data, profits, or business opportunities</li>
            <li>Damages exceeding the amount paid for the Service in the past 12 months</li>
            <li>Issues arising from third-party services or integrations</li>
          </ul>

          <h2 className="text-2xl font-semibold text-black mt-12 mb-6">Account Termination</h2>
          
          <h3 className="text-xl font-semibold text-black mt-8 mb-4">By You:</h3>
          <p className="text-gray-700 leading-relaxed mb-6">
            You may terminate your account at any time by contacting us or using account deletion features in the Service. Upon termination, your data will be deleted according to our data retention policies.
          </p>
          
          <h3 className="text-xl font-semibold text-black mt-8 mb-4">By Template:</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            We may suspend or terminate your account immediately if you:
          </p>
          <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2 mb-6">
            <li>Violate these Terms or our Acceptable Use Policy</li>
            <li>Engage in fraudulent or illegal activities</li>
            <li>Fail to pay any applicable fees</li>
            <li>Create risk or legal exposure for Template</li>
          </ul>
          <p className="text-gray-700 leading-relaxed mb-8">
            Upon termination, your right to use the Service ceases immediately. We may, but are not obligated to, provide you with a copy of your data before deletion.
          </p>

          <h2 className="text-2xl font-semibold text-black mt-12 mb-6">Changes to These Terms</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            We may update these Terms from time to time to reflect changes in our service, legal requirements, or business practices. When we do:
          </p>
          <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2 mb-6">
            <li>We will update the "Last updated" date at the top of these Terms</li>
            <li>We will notify you of material changes via email or through the Service</li>
            <li>The updated Terms will be effective immediately upon posting</li>
            <li>Your continued use of the Service constitutes acceptance of the updated Terms</li>
          </ul>
          <p className="text-gray-700 leading-relaxed mb-8">
            If you do not agree to the updated Terms, you must stop using the Service and may terminate your account.
          </p>

          <h2 className="text-2xl font-semibold text-black mt-12 mb-6">Governing Law and Disputes</h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            These Terms are governed by and construed in accordance with the laws of [Your Jurisdiction], without regard to conflict of law principles.
          </p>
          <p className="text-gray-700 leading-relaxed mb-6">
            Any disputes arising from these Terms or your use of Template will be resolved through binding arbitration, except that either party may seek injunctive relief in court for violations of intellectual property rights.
          </p>
          <p className="text-gray-700 leading-relaxed mb-8">
            You agree to resolve disputes individually and waive any right to participate in class action lawsuits or class-wide arbitration.
          </p>

          <h2 className="text-2xl font-semibold text-black mt-12 mb-6">Contact Information</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            If you have questions about these Terms of Service, please contact us:
          </p>
          <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2 mb-8">
            <li><strong>Email:</strong> legal@template.io</li>
            <li><strong>Support:</strong> support@template.io</li>
          </ul>
          <p className="text-gray-700 leading-relaxed mb-12">
            We will respond to legal inquiries within 5 business days.
          </p>

        </div>
      </div>
    </div>
  )
} 