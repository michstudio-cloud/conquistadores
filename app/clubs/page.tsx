import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ClubsList } from "@/components/clubs/clubs-list"

export default async function ClubsPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  // Fetch user's clubs
  const { data: userClubs } = await supabase
    .from("club_members")
    .select(
      `
      *,
      club:clubs(
        *,
        zone:zones(*)
      )
    `,
    )
    .eq("user_id", user.id)

  return <ClubsList userClubs={userClubs || []} userId={user.id} />
}
