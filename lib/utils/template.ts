// Function to extract variables from a template string
export function extractVariables(template: string): string[] {
  const regex = /{{([^{}]+)}}/g;
  const matches = template.match(regex);
  
  if (!matches) return [];
  
  return matches
    .map(match => match.slice(2, -2).trim())
    .filter((value, index, self) => self.indexOf(value) === index);
}

// Function to replace variables in a template
export function replaceVariables(template: string, variables: Record<string, string>): string {
  if (!template) return ""
  
  let result = template
  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(`{{${key}}}`, 'g')
    result = result.replace(regex, value || `{{${key}}}`)
  })
  
  return result
}

// Function to highlight unused variables
export function highlightUnusedVariables(template: string, variables: Record<string, string>): string[] {
  const templateVars = extractVariables(template);
  const unusedVars: string[] = [];
  
  Object.keys(variables).forEach(key => {
    if (!templateVars.includes(key)) {
      unusedVars.push(key);
    }
  });
  
  return unusedVars;
}

// Function to insert a variable at cursor position
export function insertVariableAtCursor(
  template: string, 
  variable: string, 
  cursorPosition: number
): { newTemplate: string; newCursorPosition: number } {
  const variableText = `{{${variable}}}`;
  const newTemplate = 
    template.substring(0, cursorPosition) + 
    variableText + 
    template.substring(cursorPosition);
  
  const newCursorPosition = cursorPosition + variableText.length;
  
  return { newTemplate, newCursorPosition };
}

// Export template as JSON
export function exportTemplateAsJson(
  templateName: string, 
  templateContent: string, 
  variables: Record<string, string>
): string {
  const templateData = {
    name: templateName,
    content: templateContent,
    variables
  };
  
  return JSON.stringify(templateData, null, 2);
}

// Import template from JSON
export function importTemplateFromJson(jsonString: string): {
  name: string;
  content: string;
  variables: Record<string, string>;
} | null {
  try {
    const parsed = JSON.parse(jsonString);
    
    if (
      typeof parsed === 'object' &&
      parsed !== null &&
      typeof parsed.name === 'string' &&
      typeof parsed.content === 'string' &&
      typeof parsed.variables === 'object'
    ) {
      return {
        name: parsed.name,
        content: parsed.content,
        variables: parsed.variables
      };
    }
    
    return null;
  } catch (e) {
    return null;
  }
}

export const generateUniqueId = (): string => {
  return crypto.randomUUID()
}

/**
 * Convert template content to HTML format suitable for email
 * Following email HTML best practices with inline CSS
 */
export const convertToEmailHTML = (text: string): string => {
  if (!text) return ""
  
  let formatted = text
    // Replace bold with inline styles
    .replace(/\*\*(.*?)\*\*/g, '<strong style="font-weight: bold;">$1</strong>')
    // Replace italic with inline styles
    .replace(/\*(.*?)\*/g, '<em style="font-style: italic;">$1</em>')
    // Replace underline with inline styles
    .replace(/<u>(.*?)<\/u>/g, '<span style="text-decoration: underline;">$1</span>')
    // Replace hyperlinks [text](url) with email-safe styling
    .replace(
      /\[([^\]]*)\]\(([^)]*)\)/g,
      '<a href="$2" style="color: #0066cc; text-decoration: underline;" target="_blank" rel="noopener noreferrer">$1</a>'
    )
    // Replace h1 with inline styles
    .replace(
      /^# (.*?)$/gm,
      '<h1 style="font-size: 20px; font-weight: bold; margin: 16px 0 8px 0; color: #333333; line-height: 1.2;">$1</h1>'
    )
    // Replace h2 with inline styles
    .replace(
      /^## (.*?)$/gm,
      '<h2 style="font-size: 18px; font-weight: bold; margin: 12px 0 6px 0; color: #333333; line-height: 1.2;">$1</h2>'
    )
    // Replace list items
    .replace(
      /^- (.*?)$/gm,
      '<li style="margin: 4px 0; color: #333333; line-height: 1.5;">$1</li>'
    )

  // Convert line breaks to proper paragraphs
  const lines = formatted.split('\n')
  const processedLines: string[] = []
  let inList = false

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    
    if (line.includes('<li')) {
      if (!inList) {
        processedLines.push('<ul style="margin: 8px 0; padding-left: 20px; list-style-type: disc;">')
        inList = true
      }
      processedLines.push(line)
    } else {
      if (inList) {
        processedLines.push('</ul>')
        inList = false
      }
      
      if (line === '') {
        // Empty line - don't add paragraph
        continue
      } else if (line.startsWith('<h1') || line.startsWith('<h2')) {
        // Headers - add as is
        processedLines.push(line)
      } else {
        // Regular text - wrap in paragraph
        processedLines.push(`<p style="margin: 12px 0; color: #333333; line-height: 1.6; font-size: 14px;">${line}</p>`)
      }
    }
  }
  
  // Close any open list
  if (inList) {
    processedLines.push('</ul>')
  }

  // Create complete HTML email structure following best practices
  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, sans-serif;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 0; padding: 0;">
    <tr>
      <td style="padding: 20px 10px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <tr>
            <td style="padding: 30px 40px;">
              ${processedLines.join('\n              ')}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`.trim()

  return htmlContent
}

/**
 * Convert HTML content back to plain text for email fallback
 */
export const convertToPlainText = (text: string): string => {
  if (!text) return ""
  
  let plainText = text
    // Convert markdown-style formatting to plain text equivalents
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold formatting
    .replace(/\*(.*?)\*/g, '$1') // Remove italic formatting
    .replace(/<u>(.*?)<\/u>/g, '$1') // Remove underline formatting
    .replace(/\[([^\]]*)\]\(([^)]*)\)/g, '$1 ($2)') // Convert links to "text (url)" format
    .replace(/^# (.*?)$/gm, '$1\n' + '='.repeat(20)) // Convert h1 to text with underline
    .replace(/^## (.*?)$/gm, '$1\n' + '-'.repeat(15)) // Convert h2 to text with underline
    .replace(/^- (.*?)$/gm, '• $1') // Convert list items to bullet points
    
  // Clean up extra whitespace and line breaks
  plainText = plainText
    .replace(/\n\s*\n\s*\n/g, '\n\n') // Remove excessive line breaks
    .replace(/^\s+|\s+$/g, '') // Trim whitespace
    .replace(/[ \t]+/g, ' ') // Replace multiple spaces/tabs with single space
    
  return plainText
}