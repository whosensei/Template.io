import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Sanitize HTML content to prevent XSS attacks
 * This is a simple sanitizer that only allows safe HTML tags and attributes
 */
export function sanitizeHtml(html: string): string {
  if (!html) return '';
  // Remove script tags and their content
  html = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  // Remove on* event handlers
  html = html.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '');
  html = html.replace(/\s*on\w+\s*=\s*[^>\s]+/gi, '');
  // Remove javascript: protocol
  html = html.replace(/javascript:/gi, '');
  // Remove data: protocol (can be used for XSS)
  html = html.replace(/data:/gi, '');
  // Remove vbscript: protocol
  html = html.replace(/vbscript:/gi, '');
  // Remove style attributes that could contain malicious CSS
  html = html.replace(/\s*style\s*=\s*["'][^"']*["']/gi, '');
  // Only allow specific safe tags and attributes
  const allowedTags = [
    'p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'ul', 'ol', 'li', 'a', 'span', 'div'
  ];
  const allowedAttributes = ['href', 'class', 'target', 'rel'];
  // Remove any tags not in the allowed list
  html = html.replace(/<\/?([a-zA-Z][a-zA-Z0-9]*)\b[^>]*>/gi, (match, tagName) => {
    if (allowedTags.includes(tagName.toLowerCase())) {
      // For allowed tags, clean up attributes
      if (tagName.toLowerCase() === 'a') {
        // Special handling for anchor tags
        return match.replace(/\s+(href|class|target|rel)\s*=\s*["']([^"']*)["']/gi, (attrMatch, attrName, attrValue) => {
          if (allowedAttributes.includes(attrName.toLowerCase())) {
            // Ensure href is safe
            if (attrName.toLowerCase() === 'href') {
              if (attrValue.startsWith('http://') || attrValue.startsWith('https://') || attrValue.startsWith('mailto:')) {
                return ` ${attrName}="${attrValue}"`;
              }
              return '';
            }
            return ` ${attrName}="${attrValue}"`;
          }
          return '';
        });
      }
      return match.replace(/\s+\w+\s*=\s*["'][^"']*["']/gi, (attrMatch) => {
        const attrName = attrMatch.split('=')[0].trim();
        if (allowedAttributes.includes(attrName.toLowerCase())) {
          return attrMatch;
        }
        return '';
      });
    }
    return '';
  });
  return html;
}

/**
 * Escape HTML entities to prevent XSS (for server-side use)
 */
export function escapeHtml(text: string): string {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
