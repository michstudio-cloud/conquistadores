import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { InterestsOnboarding } from "@/components/profile/interests-onboarding"

export default async function InterestsOnboardingPage() {
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

  return <InterestsOnboarding profile={profile} />
}
