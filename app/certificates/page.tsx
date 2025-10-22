import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { CertificatesList } from "@/components/certificates/certificates-list"

export default async function CertificatesPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  // Fetch user's certificates
  const { data: certificates } = await supabase
    .from("certificates")
    .select(
      `
      *,
      specialty:specialties(*),
      issued_by_profile:profiles!certificates_issued_by_fkey(id, username, display_name)
    `,
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  return <CertificatesList certificates={certificates || []} />
}
