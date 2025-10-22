"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { MessageSquare, Send } from "lucide-react"

interface Message {
  id: string
  content: string
  is_read: boolean
  created_at: string
  sender_id: string
  recipient_id: string | null
  sender: {
    id: string
    username: string
    display_name: string | null
    avatar_url: string | null
  }
  recipient: {
    id: string
    username: string
    display_name: string | null
    avatar_url: string | null
  } | null
}

interface MessagesViewProps {
  messages: Message[]
  currentUserId: string
}

export function MessagesView({ messages: initialMessages, currentUserId }: MessagesViewProps) {
  const [messages, setMessages] = useState(initialMessages)
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [newMessage, setNewMessage] = useState("")
  const [isSending, setIsSending] = useState(false)
  const { toast } = useToast()

  // Group messages by conversation
  const conversations = messages.reduce(
    (acc, message) => {
      const otherUserId = message.sender_id === currentUserId ? message.recipient_id : message.sender_id
      if (!otherUserId) return acc

      if (!acc[otherUserId]) {
        acc[otherUserId] = {
          userId: otherUserId,
          user: message.sender_id === currentUserId ? message.recipient : message.sender,
          messages: [],
          unreadCount: 0,
        }
      }

      acc[otherUserId].messages.push(message)
      if (!message.is_read && message.recipient_id === currentUserId) {
        acc[otherUserId].unreadCount++
      }

      return acc
    },
    {} as Record<
      string,
      {
        userId: string
        user: any
        messages: Message[]
        unreadCount: number
      }
    >,
  )

  const conversationsList = Object.values(conversations).sort((a, b) => {
    const aLatest = new Date(a.messages[0].created_at).getTime()
    const bLatest = new Date(b.messages[0].created_at).getTime()
    return bLatest - aLatest
  })

  const selectedConversationData = selectedConversation ? conversations[selectedConversation] : null

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return

    setIsSending(true)
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("messages")
        .insert({
          sender_id: currentUserId,
          recipient_id: selectedConversation,
          content: newMessage.trim(),
        })
        .select(
          `
          *,
          sender:profiles!messages_sender_id_fkey(id, username, display_name, avatar_url),
          recipient:profiles!messages_recipient_id_fkey(id, username, display_name, avatar_url)
        `,
        )
        .single()

      if (error) throw error

      setMessages([data, ...messages])
      setNewMessage("")

      toast({
        title: "Mensaje enviado",
        description: "Tu mensaje ha sido enviado exitosamente",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo enviar el mensaje",
        variant: "destructive",
      })
    } finally {
      setIsSending(false)
    }
  }

  const markAsRead = async (messageIds: string[]) => {
    const supabase = createClient()
    await supabase.from("messages").update({ is_read: true }).in("id", messageIds)
  }

  useEffect(() => {
    if (selectedConversationData) {
      const unreadMessages = selectedConversationData.messages
        .filter((m) => !m.is_read && m.recipient_id === currentUserId)
        .map((m) => m.id)

      if (unreadMessages.length > 0) {
        markAsRead(unreadMessages)
      }
    }
  }, [selectedConversation])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold text-gray-900">Mensajes</h1>
          <p className="text-gray-600">Chatea con otros conquistadores</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Conversations List */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Conversaciones</CardTitle>
            </CardHeader>
            <CardContent>
              {conversationsList.length === 0 ? (
                <div className="py-8 text-center">
                  <MessageSquare className="mx-auto mb-2 h-12 w-12 text-gray-400" />
                  <p className="text-sm text-gray-600">No tienes conversaciones</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {conversationsList.map((conversation) => (
                    <button
                      key={conversation.userId}
                      onClick={() => setSelectedConversation(conversation.userId)}
                      className={`flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors ${
                        selectedConversation === conversation.userId ? "bg-blue-100" : "hover:bg-gray-100"
                      }`}
                    >
                      <Avatar>
                        <AvatarImage src={conversation.user?.avatar_url || undefined} />
                        <AvatarFallback>{conversation.user?.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-semibold">
                          {conversation.user?.display_name || conversation.user?.username}
                        </p>
                        <p className="text-sm text-gray-600 line-clamp-1">{conversation.messages[0].content}</p>
                      </div>
                      {conversation.unreadCount > 0 && (
                        <Badge className="bg-red-500 text-white">{conversation.unreadCount}</Badge>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Chat Area */}
          <Card className="lg:col-span-2">
            {selectedConversationData ? (
              <>
                <CardHeader className="border-b">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={selectedConversationData.user?.avatar_url || undefined} />
                      <AvatarFallback>
                        {selectedConversationData.user?.username.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">
                        {selectedConversationData.user?.display_name || selectedConversationData.user?.username}
                      </CardTitle>
                      <p className="text-sm text-gray-600">@{selectedConversationData.user?.username}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col">
                  {/* Messages */}
                  <div className="flex h-96 flex-col-reverse gap-4 overflow-y-auto p-4">
                    {selectedConversationData.messages
                      .slice()
                      .reverse()
                      .map((message) => {
                        const isOwn = message.sender_id === currentUserId
                        return (
                          <div key={message.id} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
                            <div
                              className={`max-w-xs rounded-lg p-3 ${
                                isOwn ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-900"
                              }`}
                            >
                              <p className="text-sm">{message.content}</p>
                              <p className={`mt-1 text-xs ${isOwn ? "text-blue-100" : "text-gray-600"}`}>
                                {new Date(message.created_at).toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                        )
                      })}
                  </div>

                  {/* Input */}
                  <div className="flex gap-2 border-t pt-4">
                    <Input
                      placeholder="Escribe un mensaje..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    />
                    <Button onClick={handleSendMessage} disabled={isSending || !newMessage.trim()} className="gap-2">
                      <Send className="h-4 w-4" />
                      Enviar
                    </Button>
                  </div>
                </CardContent>
              </>
            ) : (
              <CardContent className="flex h-full items-center justify-center py-16">
                <div className="text-center">
                  <MessageSquare className="mx-auto mb-4 h-16 w-16 text-gray-400" />
                  <h3 className="mb-2 text-xl font-semibold text-gray-900">Selecciona una conversación</h3>
                  <p className="text-gray-600">Elige una conversación para comenzar a chatear</p>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
