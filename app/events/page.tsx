import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { EventsList } from "@/components/events/events-list"

export default async function EventsPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  // Fetch all published events
  const { data: events } = await supabase
    .from("events")
    .select(
      `
      *,
      organizer:profiles(id, username, display_name, avatar_url)
    `,
    )
    .eq("is_published", true)
    .order("start_date")

  // Fetch user's event registrations
  const { data: registrations } = await supabase.from("event_registrations").select("event_id").eq("user_id", user.id)

  return <EventsList events={events || []} userRegistrations={registrations || []} userId={user.id} />
}
