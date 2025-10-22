import { redirect, notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ClubDetails } from "@/components/clubs/club-details"

export default async function ClubDetailsPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  // Fetch club details
  const { data: club } = await supabase
    .from("clubs")
    .select(
      `
      *,
      zone:zones(*),
      church:churches(*)
    `,
    )
    .eq("id", params.id)
    .single()

  if (!club) {
    notFound()
  }

  // Fetch club members
  const { data: members } = await supabase
    .from("club_members")
    .select(
      `
      *,
      profile:profiles(*)
    `,
    )
    .eq("club_id", params.id)
    .order("joined_at", { ascending: false })

  // Check if user is a member
  const userMembership = members?.find((m) => m.profile.id === user.id)

  return <ClubDetails club={club} members={members || []} userMembership={userMembership} userId={user.id} />
}
