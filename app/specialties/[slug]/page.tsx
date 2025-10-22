import { redirect, notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { SpecialtyDetails } from "@/components/specialties/specialty-details"

export default async function SpecialtyDetailsPage({ params }: { params: { slug: string } }) {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  // Fetch specialty details
  const { data: specialty } = await supabase
    .from("specialties")
    .select(
      `
      *,
      category:specialty_categories(*),
      instructor:profiles(id, username, display_name, avatar_url)
    `,
    )
    .eq("slug", params.slug)
    .eq("is_published", true)
    .single()

  if (!specialty) {
    notFound()
  }

  // Fetch specialty sections with requirements
  const { data: sections } = await supabase
    .from("specialty_sections")
    .select(
      `
      *,
      requirements:specialty_requirements(*)
    `,
    )
    .eq("specialty_id", specialty.id)
    .order("order_index")

  // Check if user is enrolled
  const { data: enrollment } = await supabase
    .from("user_specialties")
    .select("*")
    .eq("user_id", user.id)
    .eq("specialty_id", specialty.id)
    .single()

  // Fetch user's progress on requirements
  const { data: userProgress } = await supabase.from("user_requirement_progress").select("*").eq("user_id", user.id)

  return (
    <SpecialtyDetails
      specialty={specialty}
      sections={sections || []}
      enrollment={enrollment}
      userProgress={userProgress || []}
      userId={user.id}
    />
  )
}
