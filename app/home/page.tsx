import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Dashboard } from "@/components/dashboard/dashboard"

export default async function HomePage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  // Fetch user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (!profile) {
    redirect("/auth/login")
  }

  // Fetch user's clubs
  const { data: userClubs } = await supabase
    .from("club_members")
    .select(
      `
      *,
      club:clubs(*)
    `,
    )
    .eq("user_id", user.id)
    .limit(3)

  // Fetch user's active specialties
  const { data: activeSpecialties } = await supabase
    .from("user_specialties")
    .select(
      `
      *,
      specialty:specialties(*)
    `,
    )
    .eq("user_id", user.id)
    .in("status", ["active", "pending"])
    .order("enrolled_at", { ascending: false })
    .limit(4)

  // Fetch upcoming events
  const { data: upcomingEvents } = await supabase
    .from("events")
    .select("*")
    .eq("is_published", true)
    .gte("start_date", new Date().toISOString())
    .order("start_date")
    .limit(3)

  // Fetch recent blog posts
  const { data: recentPosts } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("is_published", true)
    .order("published_at", { ascending: false })
    .limit(3)

  // Fetch unread messages count
  const { count: unreadMessages } = await supabase
    .from("messages")
    .select("*", { count: "exact", head: true })
    .eq("recipient_id", user.id)
    .eq("is_read", false)

  return (
    <Dashboard
      profile={profile}
      userClubs={userClubs || []}
      activeSpecialties={activeSpecialties || []}
      upcomingEvents={upcomingEvents || []}
      recentPosts={recentPosts || []}
      unreadMessages={unreadMessages || 0}
    />
  )
}
