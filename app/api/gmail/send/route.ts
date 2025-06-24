import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { gmailService } from '@/lib/gmail'
import { replaceVariables, convertToEmailHTML, convertToPlainText } from '@/lib/utils/template'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const userId = session.user.id

    const body = await request.json()
    const { 
      to, 
      cc = [], 
      bcc = [], 
      from, 
      subject, 
      template, 
      variables = {},
      templateId 
    } = body

    // Validate required fields
    if (!to || !Array.isArray(to) || to.length === 0) {
      return NextResponse.json({ error: 'Recipients (to) are required' }, { status: 400 })
    }

    if (!from) {
      return NextResponse.json({ error: 'Sender email (from) is required' }, { status: 400 })
    }

    if (!subject || !template) {
      return NextResponse.json({ error: 'Subject and template are required' }, { status: 400 })
    }

    // Replace variables in subject and template
    const processedSubject = replaceVariables(subject, variables)
    const processedTemplate = replaceVariables(template, variables)

    // Generate HTML version that matches the preview
    const htmlContent = convertToEmailHTML(processedTemplate)
    
    // Generate clean plain text version as fallback
    const plainTextContent = convertToPlainText(processedTemplate)

    // Create email data with both HTML and plain text versions
    const emailData = {
      to: to.map((email: string) => ({ email })),
      cc: cc.map((email: string) => ({ email })),
      bcc: bcc.map((email: string) => ({ email })),
      subject: processedSubject,
      textContent: plainTextContent,
      htmlContent: htmlContent
    }

    // Send email
    const result = await gmailService.sendEmail(
      userId,
      from,
      emailData,
      templateId
    )

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to send email' },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      messageId: result.messageId 
    })
  } catch (error) {
    console.error('Send email error:', error)
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    )
  }
} 