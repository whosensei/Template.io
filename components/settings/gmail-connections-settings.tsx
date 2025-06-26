"use client"

import * as React from "react"
import { Mail, AlertTriangle } from "lucide-react"
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
                      variant="default"
                      className="text-xs bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/20"
                    >
                      Connected
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      Since {new Date(connection.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={isDisconnecting === connection.email}
                    className="text-muted-foreground hover:text-foreground hover:bg-muted"
                  >
                    {isDisconnecting === connection.email ? "Disconnecting..." : "Disconnect"}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Disconnect Gmail Account</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to disconnect <strong>{connection.email}</strong>? 
                      This will permanently delete all tokens and connection data from our database.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDisconnect(connection.email)}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      {isDisconnecting === connection.email ? "Disconnecting..." : "Disconnect"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
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