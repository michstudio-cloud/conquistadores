import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { MessagesView } from "@/components/messages/messages-view"

export default async function MessagesPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  // Fetch user's conversations (unique senders/recipients)
  const { data: messages } = await supabase
    .from("messages")
    .select(
      `
      *,
      sender:profiles!messages_sender_id_fkey(id, username, display_name, avatar_url),
      recipient:profiles!messages_recipient_id_fkey(id, username, display_name, avatar_url)
    `,
    )
    .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
    .order("created_at", { ascending: false })
    .limit(100)

  return <MessagesView messages={messages || []} currentUserId={user.id} />
}
