"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Pencil, MapPin, Calendar, Phone, Mail } from "lucide-react"
import { EditProfileDialog } from "./edit-profile-dialog"
import type { Database } from "@/types/database"

type Profile = Database["public"]["Tables"]["profiles"]["Row"]

interface ProfileViewProps {
  profile: Profile
}

export function ProfileView({ profile }: ProfileViewProps) {
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [currentProfile, setCurrentProfile] = useState(profile)

  const getInitials = (name: string | null, username: string) => {
    if (name) {
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    }
    return username.slice(0, 2).toUpperCase()
  }

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
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Profile Header Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
              <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
                <AvatarImage src={currentProfile.avatar_url || undefined} alt={currentProfile.username} />
                <AvatarFallback className="text-2xl">
                  {getInitials(currentProfile.display_name, currentProfile.username)}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 text-center md:text-left">
                <div className="mb-2 flex flex-col items-center gap-2 md:flex-row md:items-start">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {currentProfile.display_name || currentProfile.username}
                  </h1>
                  <Badge className={`${getRoleBadgeColor(currentProfile.role)} text-white`}>
                    {getRoleLabel(currentProfile.role)}
                  </Badge>
                </div>
                <p className="mb-4 text-gray-600">@{currentProfile.username}</p>

                {currentProfile.bio && <p className="mb-4 text-gray-700">{currentProfile.bio}</p>}

                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  {currentProfile.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <span>{currentProfile.email}</span>
                    </div>
                  )}
                  {currentProfile.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <span>{currentProfile.phone}</span>
                    </div>
                  )}
                  {currentProfile.city && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>
                        {currentProfile.city}
                        {currentProfile.country && `, ${currentProfile.country}`}
                      </span>
                    </div>
                  )}
                  {currentProfile.birth_date && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(currentProfile.birth_date).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>

              <Button onClick={() => setIsEditOpen(true)} variant="outline" className="gap-2">
                <Pencil className="h-4 w-4" />
                Editar Perfil
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Interests Card */}
        {currentProfile.interests && currentProfile.interests.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Intereses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {currentProfile.interests.map((interest) => (
                  <Badge key={interest} variant="secondary">
                    {interest}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Card */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-blue-600">0</div>
              <div className="text-sm text-gray-600">Especialidades Completadas</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-green-600">0</div>
              <div className="text-sm text-gray-600">Certificados Obtenidos</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-purple-600">0</div>
              <div className="text-sm text-gray-600">Eventos Asistidos</div>
            </CardContent>
          </Card>
        </div>
      </div>

      <EditProfileDialog
        profile={currentProfile}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        onProfileUpdate={setCurrentProfile}
      />
    </div>
  )
}
