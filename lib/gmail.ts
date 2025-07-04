import { google } from 'googleapis'
import { db } from '@/lib/db'
import { gmailConnections, emailHistory } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || `${process.env.NEXT_PUBLIC_APP_URL}/api/gmail/callback`

export interface EmailRecipient {
  email: string
  name?: string
}

export interface EmailData {
  to: EmailRecipient[]
  cc?: EmailRecipient[]
  bcc?: EmailRecipient[]
  subject: string
  textContent: string
  htmlContent?: string
}

export class GmailService {
  private oauth2Client: any

  constructor() {
    this.oauth2Client = new google.auth.OAuth2(
      CLIENT_ID,
      CLIENT_SECRET,
      REDIRECT_URI
    )
  }

  /**
   * Generate Gmail OAuth URL for user authentication
   */
  getAuthUrl(userId: string): string {
    if (!CLIENT_ID || !CLIENT_SECRET || !REDIRECT_URI) {
      throw new Error('Gmail OAuth environment variables are not properly configured')
    }
    // No more logging of OAuth config or URLs
    const scopes = [
      'https://www.googleapis.com/auth/gmail.send',
      'https://www.googleapis.com/auth/userinfo.email',
    ]
    const authUrl = this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      state: userId, // Pass userId in state to identify user after callback
      prompt: 'consent' // Force consent to get refresh token
    })
    return authUrl
  }

  /**
   * Exchange authorization code for tokens and save connection
   */
  async handleCallback(code: string, userId: string): Promise<{ success: boolean; email?: string; error?: string }> {
    try {
      const { tokens } = await this.oauth2Client.getToken(code)
      
      if (!tokens.refresh_token) {
        return { success: false, error: 'No refresh token received. Please try again.' }
      }

      this.oauth2Client.setCredentials(tokens)

      // Get user email
      const oauth2 = google.oauth2({ version: 'v2', auth: this.oauth2Client })
      const { data } = await oauth2.userinfo.get()
      
      if (!data.email) {
        return { success: false, error: 'Could not retrieve email address.' }
      }

      // Check if connection already exists
      const existingConnection = await db
        .select()
        .from(gmailConnections)
        .where(and(
          eq(gmailConnections.userId, userId),
          eq(gmailConnections.email, data.email)
        ))
        .limit(1)

      if (existingConnection.length > 0) {
        // Update existing connection
        await db
          .update(gmailConnections)
          .set({
            refreshToken: tokens.refresh_token,
            accessToken: tokens.access_token || null,
            expiresAt: tokens.expiry_date ? new Date(tokens.expiry_date) : null,
            updatedAt: new Date(),
          })
          .where(eq(gmailConnections.id, existingConnection[0].id))
      } else {
        // Create new connection
        await db.insert(gmailConnections).values({
          userId,
          email: data.email,
          refreshToken: tokens.refresh_token,
          accessToken: tokens.access_token || null,
          expiresAt: tokens.expiry_date ? new Date(tokens.expiry_date) : null,
        })
      }

      return { success: true, email: data.email }
    } catch (error) {
      console.error('Gmail callback error:', error)
      return { success: false, error: 'Failed to connect Gmail account.' }
    }
  }

  /**
   * Get Gmail connections for a user
   */
  async getConnections(userId: string) {
    return await db
      .select()
      .from(gmailConnections)
      .where(eq(gmailConnections.userId, userId))
  }

  /**
   * Send email using Gmail API
   */
  async sendEmail(
    userId: string,
    fromEmail: string,
    emailData: EmailData,
    templateId?: string
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      // Get connection for the from email
      const connection = await db
        .select()
        .from(gmailConnections)
        .where(and(
          eq(gmailConnections.userId, userId),
          eq(gmailConnections.email, fromEmail)
        ))
        .limit(1)

      if (connection.length === 0) {
        return { success: false, error: 'Gmail connection not found.' }
      }

      const conn = connection[0]

      // Set up OAuth client with stored tokens
      this.oauth2Client.setCredentials({
        refresh_token: conn.refreshToken,
        access_token: conn.accessToken,
      })

      // Refresh token if needed
      if (conn.expiresAt && new Date() >= conn.expiresAt) {
        const { credentials } = await this.oauth2Client.refreshAccessToken()
        this.oauth2Client.setCredentials(credentials)

        // Update stored tokens
        await db
          .update(gmailConnections)
          .set({
            accessToken: credentials.access_token || null,
            expiresAt: credentials.expiry_date ? new Date(credentials.expiry_date) : null,
            updatedAt: new Date(),
          })
          .where(eq(gmailConnections.id, conn.id))
      }

      const gmail = google.gmail({ version: 'v1', auth: this.oauth2Client })

      // Create email message
      const message = this.createEmailMessage(fromEmail, emailData)
      
      // Send email
      const result = await gmail.users.messages.send({
        userId: 'me',
        requestBody: {
          raw: message,
        },
      })

      const messageId = result.data.id

      // Save to email history
      await db.insert(emailHistory).values({
        userId,
        templateId: templateId || null,
        gmailConnectionId: conn.id,
        to: emailData.to.map(r => r.email),
        cc: emailData.cc?.map(r => r.email) || [],
        bcc: emailData.bcc?.map(r => r.email) || [],
        subject: emailData.subject,
        content: emailData.textContent,
        status: 'sent',
        messageId,
      })

      return { success: true, messageId: messageId || undefined }
    } catch (error) {
      console.error('Send email error:', error)
      
      // Save failed attempt to history
      try {
        const conn = await db
          .select()
          .from(gmailConnections)
          .where(and(
            eq(gmailConnections.userId, userId),
            eq(gmailConnections.email, fromEmail)
          ))
          .limit(1)

        if (conn.length > 0) {
          await db.insert(emailHistory).values({
            userId,
            templateId: templateId || null,
            gmailConnectionId: conn[0].id,
            to: emailData.to.map(r => r.email),
            cc: emailData.cc?.map(r => r.email) || [],
            bcc: emailData.bcc?.map(r => r.email) || [],
            subject: emailData.subject,
            content: emailData.textContent,
            status: 'failed',
            errorMessage: error instanceof Error ? error.message : 'Unknown error',
          })
        }
      } catch (historyError) {
        console.error('Failed to save error to history:', historyError)
      }

      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to send email.' 
      }
    }
  }

  /**
   * Create RFC 2822 formatted email message
   */
  private createEmailMessage(from: string, emailData: EmailData): string {
    const { to, cc, bcc, subject, textContent, htmlContent } = emailData

    const formatRecipients = (recipients: EmailRecipient[]): string => {
      return recipients.map(r => r.name ? `${r.name} <${r.email}>` : r.email).join(', ')
    }

    let headers = [
      `From: ${from}`,
      `To: ${formatRecipients(to)}`,
      `Subject: ${subject}`,
    ]

    if (cc && cc.length > 0) {
      headers.push(`Cc: ${formatRecipients(cc)}`)
    }

    if (bcc && bcc.length > 0) {
      headers.push(`Bcc: ${formatRecipients(bcc)}`)
    }

    headers.push('MIME-Version: 1.0')

    let body: string
    if (htmlContent) {
      // Generate unique boundary for multipart email
      const boundary = `----=_Part_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      headers.push(`Content-Type: multipart/alternative; boundary="${boundary}"`)
      
      body = [
        '',
        `--${boundary}`,
        'Content-Type: text/plain; charset=UTF-8',
        'Content-Transfer-Encoding: 7bit',
        '',
        textContent,
        '',
        `--${boundary}`,
        'Content-Type: text/html; charset=UTF-8',
        'Content-Transfer-Encoding: 7bit',
        '',
        htmlContent,
        '',
        `--${boundary}--`
      ].join('\n')
    } else {
      headers.push('Content-Type: text/plain; charset=UTF-8')
      headers.push('Content-Transfer-Encoding: 7bit')
      body = '\n' + textContent
    }

    const email = headers.join('\n') + body

    // Encode in base64url format
    return Buffer.from(email)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '')
  }

  /**
   * Disconnect Gmail account and delete tokens
   */
  async disconnectAccount(userId: string, email: string): Promise<boolean> {
    try {
      // First, get the connection ID we're about to delete
      const connection = await db
        .select({ id: gmailConnections.id })
        .from(gmailConnections)
        .where(and(
          eq(gmailConnections.userId, userId),
          eq(gmailConnections.email, email)
        ))
        .limit(1)

      if (connection.length === 0) {
        return false // Connection not found
      }

      const connectionId = connection[0].id

      // Update email history records to set gmailConnectionId to NULL
      // This preserves the email history but removes the reference to the deleted connection
      await db
        .update(emailHistory)
        .set({ gmailConnectionId: null })
        .where(eq(emailHistory.gmailConnectionId, connectionId))

      // Now we can safely delete the Gmail connection record
      await db
        .delete(gmailConnections)
        .where(and(
          eq(gmailConnections.userId, userId),
          eq(gmailConnections.email, email)
        ))

      return true
    } catch (error) {
      console.error('Disconnect account error:', error)
      return false
    }
  }
}

// Singleton instance
export const gmailService = new GmailService() 