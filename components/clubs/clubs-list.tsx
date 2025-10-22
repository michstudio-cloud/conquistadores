"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, MapPin, Plus, Settings } from "lucide-react"
import Link from "next/link"

interface ClubMember {
  id: string
  role: string
  joined_at: string
  club: {
    id: string
    name: string
    logo_url: string | null
    description: string | null
    city: string
    state: string
    country: string
    zone: {
      id: string
      name: string
    } | null
  }
}

interface ClubsListProps {
  userClubs: ClubMember[]
  userId: string
}

export function ClubsList({ userClubs }: ClubsListProps) {
  const getRoleLabel = (role: string) => {
    const roles: Record<string, string> = {
      conquistador: "Conquistador",
      guia_mayor: "Guía Mayor",
      director: "Director",
      coordinador_zona: "Coordinador de Zona",
      coordinador_general: "Coordinador General",
      instructor: "Instructor",
    }
    return roles[role] || role
  }

  const getRoleBadgeColor = (role: string) => {
    const colors: Record<string, string> = {
      conquistador: "bg-blue-500",
      guia_mayor: "bg-green-500",
      director: "bg-purple-500",
      coordinador_zona: "bg-orange-500",
      coordinador_general: "bg-red-500",
      instructor: "bg-indigo-500",
    }
    return colors[role] || "bg-gray-500"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Mis Clubes</h1>
            <p className="text-gray-600">Gestiona tus clubes de conquistadores</p>
          </div>
          <Button asChild className="gap-2">
            <Link href="/onboarding/club-selection">
              <Plus className="h-4 w-4" />
              Unirse a un Club
            </Link>
          </Button>
        </div>

        {userClubs.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Users className="mb-4 h-16 w-16 text-gray-400" />
              <h3 className="mb-2 text-xl font-semibold text-gray-900">No estás en ningún club</h3>
              <p className="mb-6 text-center text-gray-600">
                Únete a un club para comenzar tu aventura como conquistador
              </p>
              <Button asChild>
                <Link href="/onboarding/club-selection">Buscar Clubes</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {userClubs.map((membership) => (
              <Card key={membership.id} className="transition-all hover:shadow-lg">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {membership.club.logo_url ? (
                        <img
                          src={membership.club.logo_url || "/placeholder.svg"}
                          alt={membership.club.name}
                          className="h-12 w-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                          <Users className="h-6 w-6 text-blue-600" />
                        </div>
                      )}
                      <div>
                        <CardTitle className="text-lg">{membership.club.name}</CardTitle>
                        <div className="mt-1 flex items-center gap-1 text-sm text-gray-600">
                          <MapPin className="h-3 w-3" />
                          <span>
                            {membership.club.city}, {membership.club.state}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Badge className={`${getRoleBadgeColor(membership.role)} mt-2 w-fit text-white`}>
                    {getRoleLabel(membership.role)}
                  </Badge>
                </CardHeader>
                <CardContent>
                  {membership.club.description && (
                    <p className="mb-4 text-sm text-gray-600">{membership.club.description}</p>
                  )}
                  {membership.club.zone && (
                    <div className="mb-4 text-sm text-gray-600">
                      <span className="font-medium">Zona:</span> {membership.club.zone.name}
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Button asChild variant="outline" size="sm" className="flex-1 bg-transparent">
                      <Link href={`/clubs/${membership.club.id}`}>Ver Detalles</Link>
                    </Button>
                    {(membership.role === "director" || membership.role === "coordinador_zona") && (
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/clubs/${membership.club.id}/manage`}>
                          <Settings className="h-4 w-4" />
                        </Link>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
