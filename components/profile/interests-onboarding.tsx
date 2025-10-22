"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { InterestsSelector } from "./interests-selector"
import { useToast } from "@/hooks/use-toast"
import type { Database } from "@/types/database"

type Profile = Database["public"]["Tables"]["profiles"]["Row"]

interface InterestsOnboardingProps {
  profile: Profile
}

export function InterestsOnboarding({ profile }: InterestsOnboardingProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleInterestsChange = async (interests: string[]) => {
    setIsLoading(true)

    try {
      const supabase = createClient()
      const { error } = await supabase.from("profiles").update({ interests }).eq("id", profile.id)

      if (error) throw error

      toast({
        title: "Intereses guardados",
        description: "Tus intereses han sido guardados exitosamente.",
      })

      router.push("/onboarding/club-selection")
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudieron guardar los intereses",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <InterestsSelector
        selectedInterests={profile.interests || []}
        onInterestsChange={handleInterestsChange}
        onComplete={() => {}}
      />
    </div>
  )
}
