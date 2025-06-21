import { google } from 'googleapis'
import { db } from '@/lib/db'
import { gmailTokens } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export interface GmailUser {
  id: string
  email: string
  name?: string
}

export class NextAuthGmailService {
  private oauth2Client: any

  constructor() {
    this.oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      `${process.env.NEXTAUTH_URL}/api/gmail/callback`
    )
  }

  // Generate OAuth URL for Gmail authorization
  getAuthUrl(userId: string, scopes: string[] = [
    'https://www.googleapis.com/auth/gmail.send',
    'https://www.googleapis.com/auth/gmail.modify',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile'
  ]): string {
    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      state: userId, // Pass userId in state to link back to user
      prompt: 'consent', // Force consent screen to get refresh token
    })
  }

  // Exchange authorization code for tokens and store in database
  async exchangeCodeForTokens(code: string, userId: string): Promise<GmailUser> {
    try {
      const { tokens } = await this.oauth2Client.getAccessToken(code)
      
      if (!tokens.access_token || !tokens.refresh_token) {
        throw new Error('Failed to retrieve tokens')
      }

      // Set tokens to get user info
      this.oauth2Client.setCredentials(tokens)
      
      // Get user email from Google
      const oauth2 = google.oauth2({ version: 'v2', auth: this.oauth2Client })
      const userInfo = await oauth2.userinfo.get()
      
      if (!userInfo.data.email) {
        throw new Error('Failed to get user email from Google')
      }

      // Store tokens in database
      const expiresAt = new Date(Date.now() + (tokens.expires_in || 3600) * 1000)
      
      await db.insert(gmailTokens).values({
        userId,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        email: userInfo.data.email,
        expiresAt,
      }).onConflictDoUpdate({
        target: gmailTokens.userId,
        set: {
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token,
          email: userInfo.data.email,
          expiresAt,
          updatedAt: new Date(),
        },
      })

      return {
        id: userId,
        email: userInfo.data.email,
        name: userInfo.data.name || undefined,
      }
    } catch (error) {
      console.error('Error exchanging code for tokens:', error)
      throw new Error('Failed to authenticate with Gmail')
    }
  }

  // Get user's Gmail tokens from database
  async getUserTokens(userId: string) {
    const [tokenRecord] = await db
      .select()
      .from(gmailTokens)
      .where(eq(gmailTokens.userId, userId))
      .limit(1)

    return tokenRecord || null
  }

  // Refresh access token if needed
  async refreshTokenIfNeeded(userId: string): Promise<boolean> {
    const tokenRecord = await this.getUserTokens(userId)
    
    if (!tokenRecord) {
      throw new Error('No Gmail tokens found for user')
    }

    // Check if token is expired (with 5 minute buffer)
    const isExpired = new Date() > new Date(tokenRecord.expiresAt.getTime() - 5 * 60 * 1000)
    
    if (!isExpired) {
      return false // Token is still valid
    }

    try {
      this.oauth2Client.setCredentials({
        refresh_token: tokenRecord.refreshToken,
      })

      const { credentials } = await this.oauth2Client.refreshAccessToken()
      
      if (!credentials.access_token) {
        throw new Error('Failed to refresh access token')
      }

      // Update tokens in database
      const expiresAt = new Date(Date.now() + (credentials.expires_in || 3600) * 1000)
      
      await db
        .update(gmailTokens)
        .set({
          accessToken: credentials.access_token,
          expiresAt,
          updatedAt: new Date(),
        })
        .where(eq(gmailTokens.userId, userId))

      return true // Token was refreshed
    } catch (error) {
      console.error('Error refreshing access token:', error)
      throw new Error('Failed to refresh Gmail access token')
    }
  }

  // Send email for a specific user
  async sendEmail(userId: string, to: string, subject: string, htmlContent: string, textContent?: string): Promise<any> {
    const tokenRecord = await this.getUserTokens(userId)
    
    if (!tokenRecord) {
      throw new Error('User has not connected Gmail. Please connect Gmail first.')
    }

    // Refresh token if needed
    await this.refreshTokenIfNeeded(userId)
    
    // Get updated tokens
    const updatedTokens = await this.getUserTokens(userId)
    if (!updatedTokens) {
      throw new Error('Failed to get updated tokens')
    }

    // Set credentials
    this.oauth2Client.setCredentials({
      access_token: updatedTokens.accessToken,
      refresh_token: updatedTokens.refreshToken,
    })

    const gmail = google.gmail({ version: 'v1', auth: this.oauth2Client })

    // Create the email message
    const message = [
      `From: ${updatedTokens.email}`,
      `To: ${to}`,
      `Subject: ${subject}`,
      'MIME-Version: 1.0',
      'Content-Type: multipart/alternative; boundary="boundary123"',
      '',
      '--boundary123',
      'Content-Type: text/plain; charset=utf-8',
      '',
      textContent || htmlContent.replace(/<[^>]*>/g, ''), // Strip HTML for plain text
      '',
      '--boundary123',
      'Content-Type: text/html; charset=utf-8',
      '',
      htmlContent,
      '',
      '--boundary123--'
    ].join('\n')

    const encodedMessage = Buffer.from(message).toString('base64url')

    try {
      const result = await gmail.users.messages.send({
        userId: 'me',
        requestBody: {
          raw: encodedMessage,
          labelIds: ['SENT'], // Save to Sent folder
        },
      })

      console.log(`Email sent successfully from ${updatedTokens.email} to ${to}`)
      return result.data
    } catch (error) {
      console.error('Error sending email:', error)
      throw new Error('Failed to send email via Gmail')
    }
  }

  // Check Gmail connection status for user
  async getConnectionStatus(userId: string): Promise<{
    connected: boolean
    email?: string
    expiresAt?: Date
  }> {
    const tokenRecord = await this.getUserTokens(userId)
    
    if (!tokenRecord) {
      return { connected: false }
    }

    return {
      connected: true,
      email: tokenRecord.email,
      expiresAt: tokenRecord.expiresAt,
    }
  }

  // Disconnect Gmail for user
  async disconnectGmail(userId: string): Promise<void> {
    try {
      // Revoke tokens with Google
      const tokenRecord = await this.getUserTokens(userId)
      if (tokenRecord) {
        this.oauth2Client.setCredentials({
          access_token: tokenRecord.accessToken,
        })
        await this.oauth2Client.revokeCredentials()
      }
    } catch (error) {
      console.error('Error revoking tokens:', error)
      // Continue with database cleanup even if revocation fails
    }

    // Remove tokens from database
    await db.delete(gmailTokens).where(eq(gmailTokens.userId, userId))
  }
}

// Export singleton instance
export const gmailService = new NextAuthGmailService() 