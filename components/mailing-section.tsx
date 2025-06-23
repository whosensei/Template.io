"use client"

import * as React from "react"
import { useState, useCallback } from "react"
import { Mail, Plus, X, Settings, AlertTriangle, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

interface EmailRecipient {
  email: string
  name?: string
}

interface GmailConnection {
  id: string
  email: string
  isActive: boolean
}

interface MailingSectionProps {
  onSend: (emailData: {
    to: EmailRecipient[]
    cc: EmailRecipient[]
    bcc: EmailRecipient[]
    from: string
  }) => Promise<void>
  gmailConnections: GmailConnection[]
  onConnectGmail: () => void
  isLoading?: boolean
  isSending?: boolean
  onEmailDataChange?: (emailData: {
    to: EmailRecipient[]
    cc: EmailRecipient[]
    bcc: EmailRecipient[]
    from: string
    canSend: boolean
  }) => void
  className?: string
}

interface EmailInputFieldProps {
  label: string
  emails: EmailRecipient[]
  input: string
  setInput: (value: string) => void
  setEmails: React.Dispatch<React.SetStateAction<EmailRecipient[]>>
  placeholder: string
  onToggle?: () => void
  showField?: boolean
  canCollapse?: boolean
}

// Move EmailInputField component outside to prevent recreating on each render
const EmailInputField = React.memo(({
  label,
  emails,
  input,
  setInput,
  setEmails,
  placeholder,
  onToggle,
  showField = true,
  canCollapse = false
}: EmailInputFieldProps) => {
  const isValidEmail = useCallback((email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }, [])

  const parseEmailInput = useCallback((input: string): EmailRecipient[] => {
    return input
      .split(/[,;\s]+/)
      .map(email => email.trim())
      .filter(email => email && isValidEmail(email))
      .map(email => ({ email }))
  }, [isValidEmail])

  const addEmails = useCallback((input: string) => {
    const newEmails = parseEmailInput(input)
    if (newEmails.length > 0) {
      setEmails(prev => {
        const existingEmails = prev.map(e => e.email)
        const uniqueEmails = newEmails.filter(e => !existingEmails.includes(e.email))
        return [...prev, ...uniqueEmails]
      })
    }
  }, [parseEmailInput, setEmails])

  const removeEmail = useCallback((email: string) => {
    setEmails(prev => prev.filter(e => e.email !== email))
  }, [setEmails])

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      const trimmedInput = input.trim()
      if (trimmedInput && isValidEmail(trimmedInput)) {
        addEmails(trimmedInput)
        setInput("")
      }
    } else if (e.key === ',' || e.key === ';' || e.key === ' ') {
      e.preventDefault()
      const trimmedInput = input.trim()
      if (trimmedInput && isValidEmail(trimmedInput)) {
        addEmails(trimmedInput)
        setInput("")
      }
    }
  }, [input, isValidEmail, addEmails, setInput])

  const handleAddClick = useCallback(() => {
    const trimmedInput = input.trim()
    if (trimmedInput && isValidEmail(trimmedInput)) {
      addEmails(trimmedInput)
      setInput("")
    }
  }, [input, isValidEmail, addEmails, setInput])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }, [setInput])

  return (
    <div className="space-y-2">
      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
        <Label htmlFor={`${label.toLowerCase()}-input`} className="text-xs sm:text-sm font-medium min-w-fit">
          {label}:
        </Label>
        {onToggle && !showField && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="h-6 px-2 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 self-start sm:self-center"
          >
            <Plus className="w-3 h-3 mr-1" />
            Add {label}
          </Button>
        )}
        {onToggle && showField && canCollapse && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="h-6 px-2 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 self-start sm:self-center"
          >
            <X className="w-3 h-3 mr-1" />
            Remove {label}
          </Button>
        )}
      </div>
      
      {showField && (
        <>
          <div className="flex flex-wrap gap-1 mb-2">
            {emails.map((recipient, index) => (
              <Badge key={`${recipient.email}-${index}`} variant="secondary" className="flex items-center gap-1 text-xs max-w-full">
                <span className="truncate max-w-[150px] sm:max-w-[200px]">{recipient.email}</span>
                <X
                  className="w-3 h-3 cursor-pointer hover:text-destructive flex-shrink-0"
                  onClick={() => removeEmail(recipient.email)}
                />
              </Badge>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              id={`${label.toLowerCase()}-input`}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className="flex-1 text-sm"
              autoComplete="email"
            />
            <Button
              type="button"
              onClick={handleAddClick}
              disabled={!input.trim() || !isValidEmail(input.trim())}
              className="text-xs sm:text-sm w-full sm:w-auto h-10"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add
            </Button>
          </div>
        </>
      )}
    </div>
  )
})

EmailInputField.displayName = "EmailInputField"

export function MailingSection({
  onSend,
  gmailConnections,
  onConnectGmail,
  isLoading = false,
  isSending = false,
  onEmailDataChange,
  className
}: MailingSectionProps) {
  const [toEmails, setToEmails] = useState<EmailRecipient[]>([])
  const [ccEmails, setCcEmails] = useState<EmailRecipient[]>([])
  const [bccEmails, setBccEmails] = useState<EmailRecipient[]>([])
  const [selectedFrom, setSelectedFrom] = useState<string>("")
  const [showCc, setShowCc] = useState(false)
  const [showBcc, setShowBcc] = useState(false)
  
  // Input states
  const [toInput, setToInput] = useState("")
  const [ccInput, setCcInput] = useState("")
  const [bccInput, setBccInput] = useState("")

  // Set default from email when connections are available
  React.useEffect(() => {
    if (gmailConnections.length > 0 && !selectedFrom) {
      const defaultConnection = gmailConnections.find(conn => conn.isActive) || gmailConnections[0]
      setSelectedFrom(defaultConnection.email)
    }
  }, [gmailConnections, selectedFrom])

  // Notify parent component of email data changes
  React.useEffect(() => {
    if (onEmailDataChange) {
      const canSend = toEmails.length > 0 && selectedFrom && gmailConnections.length > 0
      onEmailDataChange({
        to: toEmails,
        cc: ccEmails,
        bcc: bccEmails,
        from: selectedFrom,
        canSend: canSend as boolean
      })
    }
  }, [toEmails, ccEmails, bccEmails, selectedFrom, gmailConnections.length, onEmailDataChange])

  const handleSend = useCallback(async () => {
    if (toEmails.length === 0) {
      alert("Please add at least one recipient")
      return
    }
    
    if (!selectedFrom) {
      alert("Please select a sender email")
      return
    }

    await onSend({
      to: toEmails,
      cc: ccEmails,
      bcc: bccEmails,
      from: selectedFrom
    })
  }, [toEmails, ccEmails, bccEmails, selectedFrom, onSend])

  const handleToggleCc = useCallback(() => {
    setShowCc(prev => !prev)
    // Clear CC emails when collapsing
    if (showCc) {
      setCcEmails([])
      setCcInput("")
    }
  }, [showCc])

  const handleToggleBcc = useCallback(() => {
    setShowBcc(prev => !prev)
    // Clear BCC emails when collapsing
    if (showBcc) {
      setBccEmails([])
      setBccInput("")
    }
  }, [showBcc])

  const handleFromChange = useCallback((value: string) => {
    setSelectedFrom(value)
  }, [])

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="pb-3 sm:pb-4 px-0">
        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
          <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
          Email Composition
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4 p-0">
        {/* From Section */}
        <div className="space-y-2">
          <Label className="text-xs sm:text-sm font-medium">From:</Label>
          {gmailConnections.length > 0 ? (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <Select value={selectedFrom} onValueChange={handleFromChange}>
                <SelectTrigger className="flex-1 text-xs sm:text-sm min-h-[36px]">
                  <SelectValue placeholder="Select sender email" />
                </SelectTrigger>
                <SelectContent>
                  {gmailConnections.map((connection) => (
                    <SelectItem key={connection.id} value={connection.email}>
                      <div className="flex items-center justify-between w-full">
                        <span className="truncate">{connection.email}</span>
                        <span className="ml-2 text-xs text-muted-foreground">
                          {connection.isActive ? "(Active)" : "(Inactive)"}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="w-full sm:w-auto">
                    <Settings className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-0" />
                    <span className="sm:hidden ml-2">Settings</span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Gmail Connections</DialogTitle>
                    <DialogDescription>
                      Manage your connected Gmail accounts
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-3">
                    {gmailConnections.map((connection) => (
                      <div key={connection.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">{connection.email}</div>
                          <div className="text-sm text-gray-500">
                            {connection.isActive ? "Active" : "Inactive"}
                          </div>
                        </div>
                        <Badge variant={connection.isActive ? "default" : "secondary"}>
                          {connection.isActive ? "Connected" : "Disconnected"}
                        </Badge>
                      </div>
                    ))}
                    <Button onClick={onConnectGmail} className="w-full">
                      <Plus className="w-4 h-4 mr-2" />
                      Connect New Gmail Account
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="flex-1 px-3 py-2 border border-input rounded-md bg-muted text-xs sm:text-sm text-muted-foreground min-h-[36px] flex items-center">
                No Gmail account connected
              </div>
              <Button onClick={onConnectGmail} variant="outline" size="sm" className="w-full sm:w-auto">
                <Plus className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
                <span className="sm:hidden ml-2">Connect Gmail</span>
                <span className="hidden sm:inline">Connect Gmail</span>
              </Button>
            </div>
          )}
        </div>

        <Separator />

        {/* Recipients Section */}
        <div className="space-y-3 sm:space-y-4">
          <EmailInputField
            label="To"
            emails={toEmails}
            input={toInput}
            setInput={setToInput}
            setEmails={setToEmails}
            placeholder="Enter email address (e.g., user@example.com)"
          />

          <EmailInputField
            label="CC"
            emails={ccEmails}
            input={ccInput}
            setInput={setCcInput}
            setEmails={setCcEmails}
            placeholder="Enter email address (e.g., user@example.com)"
            onToggle={handleToggleCc}
            showField={showCc}
            canCollapse={true}
          />

          <EmailInputField
            label="BCC"
            emails={bccEmails}
            input={bccInput}
            setInput={setBccInput}
            setEmails={setBccEmails}
            placeholder="Enter email address (e.g., user@example.com)"
            onToggle={handleToggleBcc}
            showField={showBcc}
            canCollapse={true}
          />
        </div>
      </CardContent>

      {/* Warning/Info Messages at Bottom */}
      {gmailConnections.length === 0 && (
        <div className="p-4 pt-10">
          <div className="p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg">
            <div className="flex items-center justify-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
              <p className="text-sm text-amber-700 dark:text-amber-300 text-center">
                Connect a Gmail account to enable sending
              </p>
            </div>
          </div>
        </div>
      )}
      
      {gmailConnections.length > 0 && toEmails.length === 0 && (
        <div className="p-4 pt-10">
          <div className="p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-center justify-center gap-2">
              <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
              <p className="text-sm text-blue-700 dark:text-blue-300 text-center">
                Add recipients to enable sending
              </p>
            </div>
          </div>
        </div>
      )}
    </Card>
  )
} 