"use client"

import * as React from "react"
import { Mail, Trash2, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
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

interface GmailConnection {
  id: string
  email: string
  isActive: boolean
  createdAt: string
}

interface GmailConnectionsSettingsProps {
  connections: GmailConnection[]
  onConnectionUpdate: () => void
}

export function GmailConnectionsSettings({ 
  connections, 
  onConnectionUpdate 
}: GmailConnectionsSettingsProps) {
  const [isDisconnecting, setIsDisconnecting] = React.useState<string | null>(null)

  const handleDisconnect = async (email: string) => {
    setIsDisconnecting(email)
    try {
      const response = await fetch('/api/gmail/connections', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        toast.success(`Disconnected ${email}`)
        onConnectionUpdate()
      } else {
        toast.error('Failed to disconnect Gmail account')
      }
    } catch (error) {
      console.error('Error disconnecting Gmail:', error)
      toast.error('Failed to disconnect Gmail account')
    } finally {
      setIsDisconnecting(null)
    }
  }

  return (
    <div className="space-y-4">
      {connections.length === 0 ? (
        <div className="text-center py-8">
          <Mail className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-sm text-muted-foreground mb-4">
            No Gmail accounts connected
          </p>
          <Button 
            onClick={async () => {
              try {
                const response = await fetch('/api/gmail/connect', { method: 'POST' })
                const data = await response.json()
                if (data.authUrl) {
                  window.location.href = data.authUrl
                } else {
                  throw new Error('No auth URL received')
                }
              } catch (error) {
                console.error('Error connecting Gmail:', error)
                toast.error('Failed to connect Gmail account')
              }
            }}
            size="sm"
          >
            <Mail className="w-4 h-4 mr-2" />
            Connect Gmail
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {connections.map((connection) => (
            <div
              key={connection.id}
              className="flex items-center justify-between p-3 border rounded-lg bg-muted/20"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <Mail className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">{connection.email}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge 
                      variant={connection.isActive ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {connection.isActive ? "Connected" : "Disconnected"}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      Since {new Date(connection.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              
              {connection.isActive && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={isDisconnecting === connection.email}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      {isDisconnecting === connection.email ? "Disconnecting..." : "Disconnect"}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle className="flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-amber-500" />
                        Disconnect Gmail Account
                      </AlertDialogTitle>
                      <AlertDialogDescription className="space-y-2">
                        <p>
                          Are you sure you want to disconnect <strong>{connection.email}</strong>?
                        </p>
                        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-md p-3">
                          <div className="flex items-start gap-2">
                            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5" />
                            <div className="text-sm text-amber-800 dark:text-amber-200">
                              <p className="font-medium mb-1">Important Note:</p>
                              <p>You will need to reconnect this Gmail account to send emails.</p>
                            </div>
                          </div>
                        </div>
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDisconnect(connection.email)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Disconnect
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          ))}
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={async () => {
              try {
                const response = await fetch('/api/gmail/connect', { method: 'POST' })
                const data = await response.json()
                if (data.authUrl) {
                  window.location.href = data.authUrl
                } else {
                  throw new Error('No auth URL received')
                }
              } catch (error) {
                console.error('Error connecting Gmail:', error)
                toast.error('Failed to connect Gmail account')
              }
            }}
            className="w-full"
          >
            <Mail className="w-4 h-4 mr-2" />
            Connect Another Account
          </Button>
        </div>
      )}
    </div>
  )
} 