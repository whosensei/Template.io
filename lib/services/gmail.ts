import { google } from 'googleapis'
import { createEmailHTML, stripHTMLTags } from '@/lib/utils/email-formatter'

export interface EmailData {
  to: string[]
  cc?: string[]
  bcc?: string[]
  subject: string
  body: string
  isHtml?: boolean
}

export interface GmailAuthResult {
  isAuthenticated: boolean
  authUrl?: string
  error?: string
}

export interface TokenRefreshResult {
  success: boolean
  accessToken?: string
  error?: string
}

// Create OAuth2 client
function createOAuth2Client() {
  const clientId = process.env.NEXT_PUBLIC_GMAIL_CLIENT_ID
  const clientSecret = process.env.GMAIL_CLIENT_SECRET
  const redirectUri = process.env.NEXT_PUBLIC_GMAIL_REDIRECT_URI

  if (!clientId || !clientSecret || !redirectUri) {
    throw new Error('Missing Gmail OAuth2 credentials in environment variables')
  }

  return new google.auth.OAuth2(clientId, clientSecret, redirectUri)
}

// Create Gmail service instance
export async function createGmailService(accessToken: string) {
  const oauth2Client = createOAuth2Client()
  oauth2Client.setCredentials({
    access_token: accessToken
  })

  return google.gmail({ version: 'v1', auth: oauth2Client })
}

// Refresh access token using refresh token
export async function refreshAccessToken(refreshToken: string): Promise<TokenRefreshResult> {
  try {
    const oauth2Client = createOAuth2Client()
    oauth2Client.setCredentials({
      refresh_token: refreshToken
    })

    const { credentials } = await oauth2Client.refreshAccessToken()
    
    if (!credentials.access_token) {
      return {
        success: false,
        error: 'No access token received from refresh'
      }
    }

    return {
      success: true,
      accessToken: credentials.access_token
    }
  } catch (error: any) {
    console.error('Token refresh failed:', error)
    return {
      success: false,
      error: error.message || 'Failed to refresh access token'
    }
  }
}

// Get authorization URL for Gmail
export function getGmailAuthUrl(): string {
  const oauth2Client = createOAuth2Client()

  const scopes = [
    'https://www.googleapis.com/auth/gmail.send',
    'https://www.googleapis.com/auth/gmail.compose',
    'https://www.googleapis.com/auth/gmail.modify' // Added for saving to Sent folder
  ]

  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    prompt: 'consent'
  })
}

// Exchange authorization code for tokens
export async function exchangeCodeForTokens(code: string) {
  const oauth2Client = createOAuth2Client()

  try {
    const { tokens } = await oauth2Client.getToken(code)
    return tokens
  } catch (error) {
    throw new Error(`Failed to exchange code for tokens: ${error}`)
  }
}

// Create email message for Gmail API with proper multipart structure
function createEmailMessage(emailData: EmailData): string {
  const { to, cc, bcc, subject, body, isHtml = false } = emailData
  
  // Sanitize subject line to prevent issues
  const sanitizedSubject = subject
    .replace(/[\r\n\t]/g, ' ')  // Remove newlines and tabs
    .replace(/\s+/g, ' ')       // Collapse multiple spaces
    .trim()
  
  if (!isHtml) {
    // Simple plain text email
    const messageLines = [
      `From: me`,  // Gmail API will automatically use authenticated user's email
      `To: ${to.join(', ')}`,
      cc && cc.length > 0 ? `Cc: ${cc.join(', ')}` : '',
      bcc && bcc.length > 0 ? `Bcc: ${bcc.join(', ')}` : '',
      `Subject: ${sanitizedSubject}`,
      `MIME-Version: 1.0`,
      `Content-Type: text/plain; charset=utf-8`,
      `Content-Transfer-Encoding: 8bit`,
      '',
      body
    ].filter(Boolean)
    
    return messageLines.join('\r\n')
  }

  // HTML email with proper RFC-compliant multipart structure
  const boundary = `boundary_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  const htmlContent = createEmailHTML(body, sanitizedSubject)
  const plainTextContent = stripHTMLTags(htmlContent)
  
  // Create proper RFC 2822 compliant email
  const messageLines = [
    `From: me`,  // Gmail API will automatically use authenticated user's email
    `To: ${to.join(', ')}`,
    cc && cc.length > 0 ? `Cc: ${cc.join(', ')}` : '',
    bcc && bcc.length > 0 ? `Bcc: ${bcc.join(', ')}` : '',
    `Subject: ${sanitizedSubject}`,
    `MIME-Version: 1.0`,
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    `Date: ${new Date().toUTCString()}`,
    `Message-ID: <${Date.now()}.${Math.random().toString(36).substr(2, 9)}@gmail.com>`,
    '',
    `This is a multi-part message in MIME format.`,
    '',
    `--${boundary}`,
    `Content-Type: text/plain; charset=utf-8`,
    `Content-Transfer-Encoding: 8bit`,
    '',
    plainTextContent,
    '',
    `--${boundary}`,
    `Content-Type: text/html; charset=utf-8`,
    `Content-Transfer-Encoding: 8bit`,
    '',
    htmlContent,
    '',
    `--${boundary}--`
  ].filter(Boolean)

  return messageLines.join('\r\n')
}

// Send email using Gmail API with automatic token refresh
export async function sendEmail(accessToken: string, emailData: EmailData, refreshToken?: string) {
  try {
    const gmail = await createGmailService(accessToken)
    
    // Get user's profile to set proper From header
    let userProfile;
    try {
      userProfile = await getGmailProfile(accessToken, refreshToken);
    } catch (profileError) {
      console.log('Could not fetch user profile, using default From header');
    }
    
    const rawMessage = createEmailMessageWithSender(emailData, userProfile?.email);
    
    // Debug logging to see the actual email content
    console.log('=== EMAIL DEBUG ===')
    console.log('Subject:', emailData.subject)
    console.log('To:', emailData.to)
    console.log('From:', userProfile?.email || 'me')
    console.log('Body length:', emailData.body?.length || 0)
    console.log('Is HTML:', emailData.isHtml)
    console.log('Raw message length:', rawMessage.length)
    console.log('Raw message preview (first 500 chars):')
    console.log(rawMessage.substring(0, 500))
    console.log('=== END EMAIL DEBUG ===')
    
    // Encode the message in base64url format
    const encodedMessage = Buffer.from(rawMessage)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '')

    // Send email and automatically save to Sent folder
    const response = await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedMessage,
        // This ensures the email appears in your Sent folder
        labelIds: ['SENT']
      }
    })

    console.log('Email sent successfully! Message ID:', response.data.id)
    console.log('Email should now appear in your Gmail Sent folder')

    // Alternative approach: If labelIds doesn't work, try explicitly inserting to Sent folder
    try {
      await gmail.users.messages.insert({
        userId: 'me',
        requestBody: {
          raw: encodedMessage,
          labelIds: ['SENT']
        }
      })
      console.log('Also explicitly saved copy to Sent folder as backup')
    } catch (insertError) {
      console.log('Note: Primary send succeeded, but explicit Sent folder save failed:', insertError.message)
    }

    return {
      success: true,
      messageId: response.data.id,
      message: 'Email sent successfully and saved to Sent folder'
    }
  } catch (error: any) {
    console.error('Gmail API Error:', error)
    
    // Enhanced error logging for debugging
    if (error.response) {
      console.error('Error response:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data
      })
    }
    
    // Handle authentication errors and attempt token refresh
    if (error.code === 401 || error.response?.status === 401) {
      if (refreshToken) {
        console.log('Attempting to refresh access token...')
        const refreshResult = await refreshAccessToken(refreshToken)
        
        if (refreshResult.success && refreshResult.accessToken) {
          return {
            success: false,
            error: 'Token expired. Please retry - your token has been refreshed.',
            requiresAuth: false,
            newAccessToken: refreshResult.accessToken
          }
        }
      }
      
      return {
        success: false,
        error: 'Authentication required. Please reconnect your Gmail account.',
        requiresAuth: true
      }
    }
    
    // Handle quota/rate limit errors
    if (error.code === 429 || error.response?.status === 429) {
      return {
        success: false,
        error: 'Gmail sending limit reached. Please try again later.'
      }
    }
    
    // Handle other specific Gmail errors
    if (error.code === 403 || error.response?.status === 403) {
      return {
        success: false,
        error: 'Insufficient permissions. Please reconnect your Gmail account.',
        requiresAuth: true
      }
    }
    
    return {
      success: false,
      error: error.message || 'Failed to send email'
    }
  }
}

// Create email message with proper sender information
function createEmailMessageWithSender(emailData: EmailData, senderEmail?: string): string {
  const { to, cc, bcc, subject, body, isHtml = false } = emailData
  
  // Sanitize subject line to prevent issues
  const sanitizedSubject = subject
    .replace(/[\r\n\t]/g, ' ')  // Remove newlines and tabs
    .replace(/\s+/g, ' ')       // Collapse multiple spaces
    .trim()
    
  // Use sender email if available, otherwise Gmail will use authenticated user's email
  const fromHeader = senderEmail ? `From: ${senderEmail}` : `From: me`
  
  if (!isHtml) {
    // Simple plain text email
    const messageLines = [
      fromHeader,
      `To: ${to.join(', ')}`,
      cc && cc.length > 0 ? `Cc: ${cc.join(', ')}` : '',
      bcc && bcc.length > 0 ? `Bcc: ${bcc.join(', ')}` : '',
      `Subject: ${sanitizedSubject}`,
      `MIME-Version: 1.0`,
      `Content-Type: text/plain; charset=utf-8`,
      `Content-Transfer-Encoding: 8bit`,
      '',
      body
    ].filter(Boolean)
    
    return messageLines.join('\r\n')
  }

  // HTML email with proper RFC-compliant multipart structure
  const boundary = `boundary_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  const htmlContent = createEmailHTML(body, sanitizedSubject)
  const plainTextContent = stripHTMLTags(htmlContent)
  
  // Create proper RFC 2822 compliant email
  const messageLines = [
    fromHeader,
    `To: ${to.join(', ')}`,
    cc && cc.length > 0 ? `Cc: ${cc.join(', ')}` : '',
    bcc && bcc.length > 0 ? `Bcc: ${bcc.join(', ')}` : '',
    `Subject: ${sanitizedSubject}`,
    `MIME-Version: 1.0`,
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    `Date: ${new Date().toUTCString()}`,
    `Message-ID: <${Date.now()}.${Math.random().toString(36).substr(2, 9)}@gmail.com>`,
    '',
    `This is a multi-part message in MIME format.`,
    '',
    `--${boundary}`,
    `Content-Type: text/plain; charset=utf-8`,
    `Content-Transfer-Encoding: 8bit`,
    '',
    plainTextContent,
    '',
    `--${boundary}`,
    `Content-Type: text/html; charset=utf-8`,
    `Content-Transfer-Encoding: 8bit`,
    '',
    htmlContent,
    '',
    `--${boundary}--`
  ].filter(Boolean)

  return messageLines.join('\r\n')
}

// Get user profile information with token refresh support
export async function getGmailProfile(accessToken: string, refreshToken?: string) {
  try {
    const gmail = await createGmailService(accessToken)
    const profile = await gmail.users.getProfile({ userId: 'me' })
    return {
      email: profile.data.emailAddress,
      messagesTotal: profile.data.messagesTotal,
      threadsTotal: profile.data.threadsTotal
    }
  } catch (error: any) {
    // Attempt token refresh on auth error
    if ((error.code === 401 || error.response?.status === 401) && refreshToken) {
      const refreshResult = await refreshAccessToken(refreshToken)
      if (refreshResult.success && refreshResult.accessToken) {
        // Retry with new token
        const gmail = await createGmailService(refreshResult.accessToken)
        const profile = await gmail.users.getProfile({ userId: 'me' })
        return {
          email: profile.data.emailAddress,
          messagesTotal: profile.data.messagesTotal,
          threadsTotal: profile.data.threadsTotal,
          newAccessToken: refreshResult.accessToken
        }
      }
    }
    
    throw new Error(`Failed to get Gmail profile: ${error}`)
  }
}

// Validate access token with refresh support
export async function validateGmailToken(accessToken: string, refreshToken?: string): Promise<{ isValid: boolean; newAccessToken?: string }> {
  try {
    const gmail = await createGmailService(accessToken)
    await gmail.users.getProfile({ userId: 'me' })
    return { isValid: true }
  } catch (error: any) {
    // Attempt token refresh on auth error
    if ((error.code === 401 || error.response?.status === 401) && refreshToken) {
      const refreshResult = await refreshAccessToken(refreshToken)
      if (refreshResult.success && refreshResult.accessToken) {
        return { 
          isValid: true, 
          newAccessToken: refreshResult.accessToken 
        }
      }
    }
    
    return { isValid: false }
  }
} 