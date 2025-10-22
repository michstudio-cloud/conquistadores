"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Search, MapPin, Users, ArrowRight } from "lucide-react"
import { ClubLocationMap } from "./club-location-map"

interface Club {
  id: string
  name: string
  logo_url: string | null
  description: string | null
  city: string
  state: string
  country: string
  latitude: number | null
  longitude: number | null
  zone: {
    id: string
    name: string
  } | null
}

interface Zone {
  id: string
  name: string
  city: string
  state: string
  country: string
}

interface ClubSelectionProps {
  clubs: Club[]
  zones: Zone[]
  userId: string
}

export function ClubSelection({ clubs, zones, userId }: ClubSelectionProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedZone, setSelectedZone] = useState<string | null>(null)
  const [selectedClub, setSelectedClub] = useState<string | null>(null)
  const [showMap, setShowMap] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const filteredClubs = clubs.filter((club) => {
    const matchesSearch =
      club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      club.city.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesZone = !selectedZone || club.zone?.id === selectedZone
    return matchesSearch && matchesZone
  })

  const groupedClubs = zones.reduce(
    (acc, zone) => {
      acc[zone.name] = filteredClubs.filter((club) => club.zone?.id === zone.id)
      return acc
    },
    {} as Record<string, Club[]>,
  )

  const handleJoinClub = async () => {
    if (!selectedClub) return

    setIsLoading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.from("club_members").insert({
        club_id: selectedClub,
        user_id: userId,
        role: "conquistador",
      })

      if (error) throw error

      toast({
        title: "Te has unido al club",
        description: "Bienvenido a tu nuevo club de conquistadores",
      })

      router.push("/home")
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo unir al club",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSkip = () => {
    router.push("/home")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-4xl font-bold text-gray-900">Selecciona un Club</h1>
          <p className="text-gray-600">Encuentra y únete a un club de conquistadores cerca de ti</p>
        </div>

        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Buscar por nombre o ciudad..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" onClick={() => setShowMap(!showMap)} className="gap-2">
                <MapPin className="h-4 w-4" />
                {showMap ? "Ver Lista" : "Ver Mapa"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {showMap ? (
          <Card>
            <CardContent className="p-6">
              <ClubLocationMap clubs={clubs} onClubSelect={setSelectedClub} selectedClubId={selectedClub} />
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedClubs).map(([zoneName, zoneClubs]) => {
              if (zoneClubs.length === 0) return null

              return (
                <div key={zoneName}>
                  <h2 className="mb-4 text-2xl font-bold text-gray-900">{zoneName}</h2>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {zoneClubs.map((club) => (
                      <Card
                        key={club.id}
                        className={`cursor-pointer transition-all hover:shadow-lg ${
                          selectedClub === club.id ? "ring-2 ring-blue-500" : ""
                        }`}
                        onClick={() => setSelectedClub(club.id)}
                      >
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              {club.logo_url ? (
                                <img
                                  src={club.logo_url || "/placeholder.svg"}
                                  alt={club.name}
                                  className="h-12 w-12 rounded-full object-cover"
                                />
                              ) : (
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                                  <Users className="h-6 w-6 text-blue-600" />
                                </div>
                              )}
                              <div>
                                <CardTitle className="text-lg">{club.name}</CardTitle>
                                <div className="mt-1 flex items-center gap-1 text-sm text-gray-600">
                                  <MapPin className="h-3 w-3" />
                                  <span>
                                    {club.city}, {club.state}
                                  </span>
                                </div>
                              </div>
                            </div>
                            {selectedClub === club.id && (
                              <Badge className="bg-blue-500">
                                <span className="text-white">Seleccionado</span>
                              </Badge>
                            )}
                          </div>
                        </CardHeader>
                        {club.description && (
                          <CardContent>
                            <p className="text-sm text-gray-600">{club.description}</p>
                          </CardContent>
                        )}
                      </Card>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        <div className="mt-8 flex justify-between">
          <Button variant="outline" onClick={handleSkip}>
            Saltar por ahora
          </Button>
          <Button onClick={handleJoinClub} disabled={!selectedClub || isLoading} className="gap-2">
            {isLoading ? "Uniéndose..." : "Unirse al Club"}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
