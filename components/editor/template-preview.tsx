"use client";

import React, { useState, useRef, useEffect } from "react";
import { replaceVariables } from "@/lib/utils/template";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, Check, Edit, Save, X, Send, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";

interface TemplatePreviewProps {
  template: string;
  variables: Record<string, string>;
  subject?: string;
  className?: string;
  onTemplateChange?: (newTemplate: string) => void;
  onSubjectChange?: (newSubject: string) => void;
  onSend?: () => void;
  isSaving?: boolean;
  isCopying?: boolean;
  isSending?: boolean;
  highlightColor?: string;
  canSend?: boolean;
}

export function TemplatePreview({
  template,
  variables,
  subject = "",
  className,
  onTemplateChange,
  onSubjectChange,
  onSend,
  isSaving = false,
  isCopying = false,
  isSending = false,
  highlightColor = "blue",
  canSend = true,
}: TemplatePreviewProps) {
  const [copied, setCopied] = useState(false);
  const [isEditingTemplate, setIsEditingTemplate] = useState(false);
  const [isEditingSubject, setIsEditingSubject] = useState(false);
  const [editedTemplate, setEditedTemplate] = useState("");
  const [editedSubject, setEditedSubject] = useState("");
  const templateTextareaRef = useRef<HTMLTextAreaElement>(null);
  const subjectTextareaRef = useRef<HTMLTextAreaElement>(null);

  const renderedTemplate = replaceVariables(template, variables);
  const renderedSubject = replaceVariables(subject, variables);

  useEffect(() => {
    if (isEditingTemplate) {
      setEditedTemplate(renderedTemplate);
    }
  }, [isEditingTemplate, renderedTemplate]);

  useEffect(() => {
    if (isEditingSubject) {
      setEditedSubject(renderedSubject);
    }
  }, [isEditingSubject, renderedSubject]);

  const handleCopy = async () => {
    const contentToCopy = isEditingTemplate ? editedTemplate : renderedTemplate;
    const subjectToCopy = isEditingSubject ? editedSubject : renderedSubject;
    const fullEmail = subject
      ? `Subject: ${subjectToCopy}\n\n${contentToCopy}`
      : contentToCopy;
    await navigator.clipboard.writeText(fullEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEditTemplate = () => {
    setIsEditingTemplate(true);
    setEditedTemplate(renderedTemplate);
    setTimeout(() => {
      templateTextareaRef.current?.focus();
    }, 0);
  };

  const handleSaveTemplate = () => {
    if (onTemplateChange && editedTemplate !== renderedTemplate) {
      // Try to reverse the variable replacement to get back the template with variables
      let newTemplate = editedTemplate;
      Object.entries(variables).forEach(([key, value]) => {
        if (value) {
          const regex = new RegExp(
            value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
            "g"
          );
          newTemplate = newTemplate.replace(regex, `{{${key}}}`);
        }
      });
      onTemplateChange(newTemplate);
    }
    setIsEditingTemplate(false);
  };

  const handleCancelTemplateEdit = () => {
    setIsEditingTemplate(false);
    setEditedTemplate(renderedTemplate);
  };

  const handleEditSubject = () => {
    setIsEditingSubject(true);
    setEditedSubject(renderedSubject);
    setTimeout(() => {
      subjectTextareaRef.current?.focus();
    }, 0);
  };

  const handleSaveSubject = () => {
    if (onSubjectChange && editedSubject !== renderedSubject) {
      // Try to reverse the variable replacement to get back the subject with variables
      let newSubject = editedSubject;
      Object.entries(variables).forEach(([key, value]) => {
        if (value) {
          const regex = new RegExp(
            value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
            "g"
          );
          newSubject = newSubject.replace(regex, `{{${key}}}`);
        }
      });
      onSubjectChange(newSubject);
    }
    setIsEditingSubject(false);
  };

  const handleCancelSubjectEdit = () => {
    setIsEditingSubject(false);
    setEditedSubject(renderedSubject);
  };

  // Function to convert markdown-like syntax to HTML
  const formatText = (text: string) => {
    if (!text) return ""
    
    let formatted = text
      // Replace bold with styled spans
      .replace(/\*\*(.*?)\*\*/g, "<strong style='font-weight: bold;'>$1</strong>")
      // Replace italic with styled spans
      .replace(/\*(.*?)\*/g, "<em style='font-style: italic;'>$1</em>")
      // Replace underline
      .replace(/<u>(.*?)<\/u>/g, "<span style='text-decoration: underline;'>$1</span>")
      // Replace hyperlinks [text](url)
      .replace(
        /\[([^\]]*)\]\(([^)]*)\)/g,
        '<a href="$2" class="text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-300" target="_blank" rel="noopener noreferrer">$1</a>'
      )
      // Replace h1
      .replace(
        /^# (.*?)$/gm,
        '<h1 class="text-xl font-semibold mt-4 mb-2 text-gray-900 dark:text-white">$1</h1>'
      )
      // Replace h2
      .replace(
        /^## (.*?)$/gm,
        '<h2 class="text-lg font-medium mt-3 mb-2 text-gray-900 dark:text-white">$1</h2>'
      )
      // Replace list items
      .replace(
        /^- (.*?)$/gm,
        '<li class="ml-4 text-gray-900 dark:text-white">$1</li>'
      )

    // Convert line breaks to proper paragraphs
    const lines = formatted.split('\n')
    const processedLines: string[] = []
    let inList = false

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()
      
      if (line.includes('<li')) {
        if (!inList) {
          processedLines.push('<ul class="list-disc ml-4 mb-4">')
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
        } else if (line.length > 0) {
          // Regular text - wrap in paragraph
          processedLines.push(`<p class="mb-3 text-gray-900 dark:text-white leading-relaxed">${line}</p>`)
        }
      }
    }
    
    // Close any open list
    if (inList) {
      processedLines.push('</ul>')
    }

    let result = processedLines.join('\n')

    // Get color classes based on highlightColor prop
    const getHighlightClasses = () => {
      switch (highlightColor) {
        case 'purple':
          return 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300'
        case 'pink':
          return 'bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-300'
        case 'green':
          return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
        case 'orange':
          return 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300'
        case 'red':
          return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
        default: // blue
          return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
      }
    }

    // Highlight variables that haven't been replaced
    result = result.replace(
      /{{(.*?)}}/g,
      `<span class="${getHighlightClasses()} px-2 py-1 rounded font-medium">{{$1}}</span>`
    );

    return result;
  };

  const canEdit = !!(onTemplateChange || onSubjectChange);

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="pb-3 sm:pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-2">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
            Preview
          </CardTitle>
          <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
            {canEdit && (
              <Button
                onClick={
                  isEditingTemplate ? handleSaveTemplate : handleEditTemplate
                }
                variant="outline"
                size="sm"
                disabled={isSaving}
                className="text-xs sm:text-sm"
              >
                {isEditingTemplate ? (
                  <>
                    <Save className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
                    <span className="hidden sm:inline">{isSaving ? "Saving..." : "Save"}</span>
                  </>
                ) : (
                  <>
                    <Edit className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
                    <span className="hidden sm:inline">Edit</span>
                  </>
                )}
              </Button>
            )}
            {isEditingTemplate && (
              <Button
                onClick={handleCancelTemplateEdit}
                variant="outline"
                size="sm"
                disabled={isSaving}
                className="text-xs sm:text-sm"
              >
                <X className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
                <span className="hidden sm:inline">Cancel</span>
              </Button>
            )}

            <Button
              onClick={handleCopy}
              loading={isCopying}
              loadingText="Copying..."
              size="sm"
              variant="outline"
              className="text-xs sm:text-sm"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Copy</span>
                </>
              )}
            </Button>
            {onSend && (
              <Button
                onClick={onSend}
                loading={isSending}
                disabled={!canSend}
                size="sm"
                variant="default"
                className="text-xs sm:text-sm font-medium"
                title={!canSend ? "Add recipients and connect Gmail to send" : ""}
              >
                {isSending ? (
                  <>
                    <Send className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2 animate-spin" />
                    <span className="hidden sm:inline">Sending...</span>
                    <span className="sm:hidden">...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
                    <span className="hidden sm:inline">Send</span>
                    <span className="sm:hidden">Send</span>
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-3 sm:p-6 flex-1 flex flex-col">
        {/* Preview Content */}
        <div className="border border-gray-200 dark:border-[hsl(215_20%_14%)] rounded-lg bg-gray-50 dark:bg-[#1F1F1F] flex-1 flex flex-col">
        {subject && (
          <div className="border-b border-gray-200 dark:border-[hsl(215_20%_18%)] p-3 sm:p-4 flex-shrink-0">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-zinc-300">
                Subject
              </span>
              {canEdit && onSubjectChange && (
                <div className="flex items-center gap-1">
                  <Button
                    onClick={
                      isEditingSubject ? handleSaveSubject : handleEditSubject
                    }
                    variant="ghost"
                    size="sm"
                    disabled={isSaving}
                    className="h-6 w-6 p-0"
                  >
                    {isEditingSubject ? (
                      <Save className="w-3 h-3" />
                    ) : (
                      <Edit className="w-3 h-3" />
                    )}
                  </Button>
                  {isEditingSubject && (
                    <Button
                      onClick={handleCancelSubjectEdit}
                      variant="ghost"
                      size="sm"
                      disabled={isSaving}
                      className="h-6 w-6 p-0"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              )}
            </div>
            {isEditingSubject ? (
              <Textarea
                ref={subjectTextareaRef}
                value={editedSubject}
                onChange={(e) => setEditedSubject(e.target.value)}
                className="font-medium text-gray-900 dark:text-white min-h-[40px] resize-none border border-white dark:border-zinc-900 focus-visible:ring-0 focus:ring-0 focus:border-white dark:focus:border-zinc-900 focus:outline-none shadow-none bg-transparent"
                disabled={isSaving}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.ctrlKey) {
                    handleSaveSubject();
                  } else if (e.key === "Escape") {
                    handleCancelSubjectEdit();
                  }
                }}
              />
            ) : (
              <div
                className="font-medium text-gray-900 dark:text-white break-words"
                dangerouslySetInnerHTML={{
                  __html: formatText(renderedSubject),
                }}
              />
            )}
          </div>
        )}

        <div className="p-3 sm:p-6 flex-1 flex flex-col">
          {isEditingTemplate ? (
            <Textarea
              ref={templateTextareaRef}
              value={editedTemplate}
              onChange={(e) => setEditedTemplate(e.target.value)}
              className="w-full flex-1 min-h-[150px] sm:min-h-[200px] border border-white dark:border-zinc-900 p-0 resize-none bg-transparent focus-visible:ring-0 focus:ring-0 focus:border-white dark:focus:border-zinc-900 focus:outline-none shadow-none text-gray-900 dark:text-white text-sm sm:text-base custom-scrollbar"
              disabled={isSaving}
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.ctrlKey) {
                  handleSaveTemplate();
                } else if (e.key === "Escape") {
                  handleCancelTemplateEdit();
                }
              }}
            />
          ) : (
            <div
              className="prose prose-sm sm:prose-base max-w-none break-words text-gray-900 dark:text-white dark:prose-invert flex-1 overflow-y-auto custom-scrollbar"
              dangerouslySetInnerHTML={{ __html: formatText(renderedTemplate) }}
            />
          )}
        </div>
        </div>

        {(isEditingTemplate || isEditingSubject) && (
          <div className="text-center p-4">
            <p className="text-sm text-gray-600 dark:text-zinc-400">
              Press{" "}
              <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-zinc-700 border border-gray-300 dark:border-zinc-600 rounded text-xs font-mono">
                Ctrl+Enter
              </kbd>{" "}
              to save,{" "}
              <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-zinc-700 border border-gray-300 dark:border-zinc-600 rounded text-xs font-mono">
                Escape
              </kbd>{" "}
              to cancel
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
