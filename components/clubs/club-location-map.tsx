"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Navigation } from "lucide-react"

interface Club {
  id: string
  name: string
  city: string
  state: string
  latitude: number | null
  longitude: number | null
}

interface ClubLocationMapProps {
  clubs: Club[]
  onClubSelect: (clubId: string) => void
  selectedClubId: string | null
}

export function ClubLocationMap({ clubs, onClubSelect, selectedClubId }: ClubLocationMapProps) {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [nearbyClubs, setNearbyClubs] = useState<Club[]>([])

  useEffect(() => {
    // Request user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }
          setUserLocation(location)

          // Calculate distances and find nearby clubs
          const clubsWithDistance = clubs
            .filter((club) => club.latitude && club.longitude)
            .map((club) => {
              const distance = calculateDistance(location.lat, location.lng, club.latitude!, club.longitude!)
              return { ...club, distance }
            })
            .sort((a, b) => a.distance - b.distance)
            .slice(0, 10)

          setNearbyClubs(clubsWithDistance)
        },
        (error) => {
          console.error("Error getting location:", error)
        },
      )
    }
  }, [clubs])

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371 // Radius of the Earth in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180
    const dLon = ((lon2 - lon1) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Clubes cercanos a ti</h3>
        {userLocation && (
          <Badge variant="secondary" className="gap-1">
            <Navigation className="h-3 w-3" />
            Ubicación detectada
          </Badge>
        )}
      </div>

      {!userLocation && (
        <div className="rounded-lg bg-blue-50 p-4 text-center">
          <p className="text-sm text-blue-900">Permite el acceso a tu ubicación para encontrar clubes cerca de ti</p>
        </div>
      )}

      <div className="space-y-3">
        {nearbyClubs.length > 0 ? (
          nearbyClubs.map((club) => (
            <div
              key={club.id}
              className={`flex items-center justify-between rounded-lg border p-4 transition-all hover:shadow-md ${
                selectedClubId === club.id ? "border-blue-500 bg-blue-50" : "border-gray-200"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                  <MapPin className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold">{club.name}</h4>
                  <p className="text-sm text-gray-600">
                    {club.city}, {club.state} • {club.distance?.toFixed(1)} km
                  </p>
                </div>
              </div>
              <Button
                variant={selectedClubId === club.id ? "default" : "outline"}
                size="sm"
                onClick={() => onClubSelect(club.id)}
              >
                {selectedClubId === club.id ? "Seleccionado" : "Seleccionar"}
              </Button>
            </div>
          ))
        ) : (
          <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center">
            <MapPin className="mx-auto mb-2 h-8 w-8 text-gray-400" />
            <p className="text-sm text-gray-600">No se encontraron clubes cercanos</p>
          </div>
        )}
      </div>
    </div>
  )
}
