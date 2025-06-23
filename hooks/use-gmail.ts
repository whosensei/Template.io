import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'

interface GmailConnection {
  id: string
  email: string
  isActive: boolean
}

interface EmailRecipient {
  email: string
  name?: string
}

interface SendEmailData {
  to: EmailRecipient[]
  cc: EmailRecipient[]
  bcc: EmailRecipient[]
  from: string
}

export function useGmailConnections() {
  const [connections, setConnections] = useState<GmailConnection[]>([])
  const [loading, setLoading] = useState(true)
  const [connecting, setConnecting] = useState(false)

  const fetchConnections = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/gmail/connections')
      
      if (!response.ok) {
        throw new Error('Failed to fetch Gmail connections')
      }

      const data = await response.json()
      setConnections(data.connections || [])
    } catch (error) {
      console.error('Error fetching Gmail connections:', error)
      toast.error('Failed to load Gmail connections')
      setConnections([]) // Reset connections on error
    } finally {
      setLoading(false)
    }
  }, [])

  const connectGmail = useCallback(async () => {
    try {
      setConnecting(true)
      const response = await fetch('/api/gmail/connect', {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Failed to initiate Gmail connection')
      }

      const data = await response.json()
      
      if (data.authUrl) {
        // Redirect to Google OAuth
        window.location.href = data.authUrl
      } else {
        throw new Error('No auth URL received')
      }
    } catch (error) {
      console.error('Error connecting Gmail:', error)
      toast.error('Failed to connect Gmail account')
      setConnecting(false)
    }
  }, [])

  useEffect(() => {
    fetchConnections()
  }, [fetchConnections])

  // Handle OAuth callback success/error from URL params
  useEffect(() => {
    const url = new URL(window.location.href)
    const gmailConnected = url.searchParams.get('gmail_connected')
    const error = url.searchParams.get('error')
    const errorMessage = url.searchParams.get('message')

    if (gmailConnected) {
      toast.success(`Gmail account ${gmailConnected} connected successfully!`)
      fetchConnections()
      // Clean up URL
      url.searchParams.delete('gmail_connected')
      window.history.replaceState({}, '', url.toString())
    } else if (error) {
      let message = 'Failed to connect Gmail account'
      switch (error) {
        case 'gmail_auth_denied':
          message = 'Gmail authentication was denied'
          break
        case 'gmail_auth_missing_params':
          message = 'Missing authentication parameters'
          break
        case 'gmail_auth_failed':
          message = errorMessage ? decodeURIComponent(errorMessage) : 'Gmail authentication failed'
          break
        case 'gmail_auth_error':
          message = 'An error occurred during Gmail authentication'
          break
      }
      toast.error(message)
      // Clean up URL
      url.searchParams.delete('error')
      url.searchParams.delete('message')
      window.history.replaceState({}, '', url.toString())
    }

    setConnecting(false)
  }, [])

  return {
    connections,
    loading,
    connecting,
    connectGmail,
    refetchConnections: fetchConnections,
  }
}

export function useEmailSending() {
  const [sending, setSending] = useState(false)

  const sendEmail = useCallback(async (
    emailData: SendEmailData,
    subject: string,
    template: string,
    variables: Record<string, string> = {},
    templateId?: string
  ) => {
    try {
      setSending(true)

      const response = await fetch('/api/gmail/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: emailData.to.map(r => r.email),
          cc: emailData.cc.map(r => r.email),
          bcc: emailData.bcc.map(r => r.email),
          from: emailData.from,
          subject,
          template,
          variables,
          templateId,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to send email')
      }

      const result = await response.json()
      
      toast.success('Email sent successfully!')
      return { success: true, messageId: result.messageId }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to send email'
      toast.error(message)
      return { success: false, error: message }
    } finally {
      setSending(false)
    }
  }, [])

  return {
    sending,
    sendEmail,
  }
} 