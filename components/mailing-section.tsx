"use client"

import * as React from "react"
import { useState, useCallback } from "react"
import { Mail, Plus, X, Settings, AlertTriangle, Info, Unplug, Trash2, MoreVertical } from "lucide-react"
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { cn } from "@/lib/utils"

interface EmailRecipient {
  email: string
  name?: string
}

interface GmailConnection {
  id: string
  email: string
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
  onDisconnectGmail?: (email: string) => Promise<void>

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
      {/* Toggle buttons for CC/BCC */}
      {onToggle && !showField && (
        <div className="flex justify-start">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="h-6 px-2 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <Plus className="w-3 h-3 mr-1" />
            Add {label}
          </Button>
        </div>
      )}
      {onToggle && showField && canCollapse && (
        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="h-6 px-2 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="w-3 h-3 mr-1" />
            Remove {label}
          </Button>
        </div>
      )}
      
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
              variant="default"
              size="sm"
              className="w-full sm:w-auto"
            >
              <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
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
  onDisconnectGmail,

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

  // Filter active connections for the From field
  const activeConnections = gmailConnections

  // Set default from email when active connections are available
  React.useEffect(() => {
    if (activeConnections.length > 0 && (!selectedFrom || !activeConnections.find(conn => conn.email === selectedFrom))) {
      const defaultConnection = activeConnections[0]
      setSelectedFrom(defaultConnection.email)
    } else if (activeConnections.length === 0 && selectedFrom) {
      // Clear selected email if no active connections
      setSelectedFrom("")
    }
  }, [activeConnections, selectedFrom])

  // Notify parent component of email data changes
  React.useEffect(() => {
    if (onEmailDataChange) {
      const canSend = toEmails.length > 0 && selectedFrom && activeConnections.length > 0
      onEmailDataChange({
        to: toEmails,
        cc: ccEmails,
        bcc: bccEmails,
        from: selectedFrom,
        canSend: canSend as boolean
      })
    }
  }, [toEmails, ccEmails, bccEmails, selectedFrom, activeConnections.length, onEmailDataChange])

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
    <div className={cn("w-full space-y-4", className)}>
      {/* Email Composition Heading */}
      <div className="text-sm font-medium text-muted-foreground">
        Email Composition
      </div>

      {/* Email Composition Content in Dotted Container */}
      <div className="min-h-[120px] p-4 border-2 border-dashed border-muted rounded-lg space-y-3">
        {/* From Section Card */}
        <div className="p-3 bg-muted/30 rounded-lg border">
          <Label className="text-sm font-medium mb-2 block">From:</Label>
          {activeConnections.length > 0 ? (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 min-w-0">
              <Select value={selectedFrom} onValueChange={handleFromChange}>
                <SelectTrigger className="flex-1 text-xs sm:text-sm min-h-[36px] min-w-0">
                  <SelectValue placeholder="Select sender email" />
                </SelectTrigger>
                <SelectContent>
                  {activeConnections.map((connection) => (
                    <SelectItem key={connection.id} value={connection.email}>
                      <span className="truncate">{connection.email}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="w-full sm:w-auto sm:flex-shrink-0">
                    <Settings className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="sm:hidden ml-2">Settings</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg">
                  <DialogHeader className="space-y-3">
                    <DialogTitle className="flex items-center gap-2">
                      <Mail className="w-5 h-5" />
                      Gmail Connections
                    </DialogTitle>
                    <DialogDescription>
                      Manage your connected Gmail accounts for sending emails
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-6 pt-2">
                    {gmailConnections.length === 0 ? (
                      <div className="text-center py-6">
                        <Mail className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                        <p className="text-sm text-muted-foreground mb-4">
                          No Gmail accounts connected
                        </p>
                        <Button onClick={onConnectGmail} size="sm">
                          <Plus className="w-4 h-4 mr-2" />
                          Connect Gmail
                        </Button>
                      </div>
                    ) : (
                      <>
                        <div className="space-y-4">
                          {gmailConnections.map((connection) => (
                            <div key={connection.id} className="flex items-center gap-4 p-4 border rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                                <Mail className="w-5 h-5 text-primary" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-medium truncate">{connection.email}</div>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge 
                                    variant="default"
                                    className="text-xs bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400"
                                  >
                                    Connected
                                  </Badge>
                                </div>
                              </div>
                                                            
                              <div className="flex-shrink-0">
                                {onDisconnectGmail && (
                                <AlertDialog>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                                      >
                                        <MoreVertical className="w-4 h-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <AlertDialogTrigger asChild>
                                        <DropdownMenuItem className="text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400 focus:bg-red-50 dark:focus:bg-red-950/20 cursor-pointer">
                                          <Unplug className="w-4 h-4 mr-2" />
                                          Disconnect
                                        </DropdownMenuItem>
                                      </AlertDialogTrigger>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle className="flex items-center gap-2">
                                        <AlertTriangle className="w-5 h-5 text-amber-500" />
                                        Disconnect Gmail Account
                                      </AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to disconnect <strong>{connection.email}</strong>? 
                                        This will permanently delete all tokens and connection data from our database.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => onDisconnectGmail(connection.email)}
                                        className="bg-red-600 text-white hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-500 dark:text-white"
                                      >
                                        <Unplug className="w-4 h-4 mr-2" />
                                        Disconnect
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              )}
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        <Separator />
                        
                        <Button 
                          onClick={onConnectGmail} 
                          variant="default" 
                          className="w-full mt-2"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Connect Another Account
                        </Button>
                      </>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 min-w-0">
              <div className="flex-1 px-3 py-2 border border-input rounded-md bg-muted text-xs sm:text-sm text-muted-foreground min-h-[36px] flex items-center min-w-0">
                <span className="truncate">No Gmail account connected</span>
              </div>
              <Button onClick={onConnectGmail} variant="outline" size="sm" className="w-full sm:w-auto sm:flex-shrink-0">
                <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="sm:hidden ml-2">Connect Gmail</span>
                <span className="hidden sm:inline">Connect</span>
              </Button>
            </div>
          )}
        </div>

        {/* To Section Card */}
        <div className="p-3 bg-muted/30 rounded-lg border">
          <Label className="text-sm font-medium mb-2 block">To:</Label>
          <EmailInputField
            label="To"
            emails={toEmails}
            input={toInput}
            setInput={setToInput}
            setEmails={setToEmails}
            placeholder="Enter email address"
          />
        </div>

        {/* CC Section Card */}
        <div className="p-3 bg-muted/30 rounded-lg border">
          <div className="flex items-center justify-between mb-2">
            <Label className="text-sm font-medium">CC:</Label>
            {!showCc && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleToggleCc}
                className="h-6 px-2 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <Plus className="w-3 h-3 mr-1" />
                Add CC
              </Button>
            )}
            {showCc && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleToggleCc}
                className="h-6 px-2 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="w-3 h-3 mr-1" />
                Remove CC
              </Button>
            )}
          </div>
          <EmailInputField
            label="CC"
            emails={ccEmails}
            input={ccInput}
            setInput={setCcInput}
            setEmails={setCcEmails}
            placeholder="Enter email address"
            showField={showCc}
            canCollapse={false}
          />
        </div>

        {/* BCC Section Card */}
        <div className="p-3 bg-muted/30 rounded-lg border">
          <div className="flex items-center justify-between mb-2">
            <Label className="text-sm font-medium">BCC:</Label>
            {!showBcc && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleToggleBcc}
                className="h-6 px-2 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <Plus className="w-3 h-3 mr-1" />
                Add BCC
              </Button>
            )}
            {showBcc && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleToggleBcc}
                className="h-6 px-2 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="w-3 h-3 mr-1" />
                Remove BCC
              </Button>
            )}
          </div>
          <EmailInputField
            label="BCC"
            emails={bccEmails}
            input={bccInput}
            setInput={setBccInput}
            setEmails={setBccEmails}
            placeholder="Enter email address"
            showField={showBcc}
            canCollapse={false}
          />
        </div>
      </div>

      {/* Warning/Info Messages at Bottom */}
      {activeConnections.length === 0 && (
        <div className="p-4 pt-2">
          <div className="p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg">
            <div className="flex items-center justify-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
              <p className="text-sm text-amber-700 dark:text-amber-300 text-center">
                {gmailConnections.length > 0 
                  ? "No active Gmail connections. Connect an account to enable sending" 
                  : "Connect a Gmail account to enable sending"}
              </p>
            </div>
          </div>
        </div>
      )}
      
      {activeConnections.length > 0 && toEmails.length === 0 && (
        <div className="p-4 pt-2">
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
    </div>
  )
} 