import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ClubSelection } from "@/components/clubs/club-selection"

export default async function ClubSelectionPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (!profile) {
    redirect("/auth/login")
  }

  // Fetch all clubs with their zones
  const { data: clubs } = await supabase
    .from("clubs")
    .select(
      `
      *,
      zone:zones(*)
    `,
    )
    .order("name")

  // Fetch zones for grouping
  const { data: zones } = await supabase.from("zones").select("*").order("name")

  return <ClubSelection clubs={clubs || []} zones={zones || []} userId={user.id} />
}
