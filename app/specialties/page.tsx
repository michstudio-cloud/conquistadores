import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { SpecialtiesList } from "@/components/specialties/specialties-list"

export default async function SpecialtiesPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  // Fetch all categories
  const { data: categories } = await supabase.from("specialty_categories").select("*").order("name")

  // Fetch all published specialties with their categories
  const { data: specialties } = await supabase
    .from("specialties")
    .select(
      `
      *,
      category:specialty_categories(*),
      instructor:profiles(id, username, display_name, avatar_url)
    `,
    )
    .eq("is_published", true)
    .order("title")

  // Fetch user's enrolled specialties
  const { data: userSpecialties } = await supabase
    .from("user_specialties")
    .select("specialty_id, status, progress_percentage")
    .eq("user_id", user.id)

  return (
    <SpecialtiesList
      categories={categories || []}
      specialties={specialties || []}
      userSpecialties={userSpecialties || []}
      userId={user.id}
    />
  )
}
