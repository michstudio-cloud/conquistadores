"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, MapPin, Church, Calendar, Settings } from "lucide-react"
import Link from "next/link"

interface Club {
  id: string
  name: string
  logo_url: string | null
  description: string | null
  city: string
  state: string
  country: string
  created_at: string
  zone: {
    id: string
    name: string
  } | null
  church: {
    id: string
    name: string
    address: string | null
  } | null
}

interface Member {
  id: string
  role: string
  joined_at: string
  profile: {
    id: string
    username: string
    display_name: string | null
    avatar_url: string | null
  }
}

interface ClubDetailsProps {
  club: Club
  members: Member[]
  userMembership: Member | undefined
  userId: string
}

export function ClubDetails({ club, members, userMembership }: ClubDetailsProps) {
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

  const canManage =
    userMembership && ["director", "coordinador_zona", "coordinador_general"].includes(userMembership.role)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Club Header */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
              {club.logo_url ? (
                <img
                  src={club.logo_url || "/placeholder.svg"}
                  alt={club.name}
                  className="h-32 w-32 rounded-full object-cover shadow-lg"
                />
              ) : (
                <div className="flex h-32 w-32 items-center justify-center rounded-full bg-blue-100 shadow-lg">
                  <Users className="h-16 w-16 text-blue-600" />
                </div>
              )}

              <div className="flex-1 text-center md:text-left">
                <h1 className="mb-2 text-3xl font-bold text-gray-900">{club.name}</h1>
                {club.description && <p className="mb-4 text-gray-700">{club.description}</p>}

                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>
                      {club.city}, {club.state}, {club.country}
                    </span>
                  </div>
                  {club.zone && (
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">Zona: {club.zone.name}</Badge>
                    </div>
                  )}
                  {club.church && (
                    <div className="flex items-center gap-2">
                      <Church className="h-4 w-4" />
                      <span>{club.church.name}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Creado: {new Date(club.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {canManage && (
                <Button asChild variant="outline" className="gap-2 bg-transparent">
                  <Link href={`/clubs/${club.id}/manage`}>
                    <Settings className="h-4 w-4" />
                    Administrar
                  </Link>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Members List */}
        <Card>
          <CardHeader>
            <CardTitle>Miembros del Club ({members.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {members.map((member) => (
                <div key={member.id} className="flex items-center justify-between rounded-lg border p-4">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={member.profile.avatar_url || undefined} />
                      <AvatarFallback>{member.profile.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{member.profile.display_name || member.profile.username}</p>
                      <p className="text-sm text-gray-600">@{member.profile.username}</p>
                    </div>
                  </div>
                  <Badge variant="secondary">{getRoleLabel(member.role)}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
