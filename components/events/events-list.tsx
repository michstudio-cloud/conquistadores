"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Calendar, MapPin, Users, Search, CheckCircle2 } from "lucide-react"

interface Event {
  id: string
  title: string
  description: string | null
  event_type: string | null
  start_date: string
  end_date: string | null
  location: string | null
  image_url: string | null
  max_participants: number | null
  organizer: {
    id: string
    username: string
    display_name: string | null
    avatar_url: string | null
  } | null
}

interface Registration {
  event_id: string
}

interface EventsListProps {
  events: Event[]
  userRegistrations: Registration[]
  userId: string
}

export function EventsList({ events, userRegistrations, userId }: EventsListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [filter, setFilter] = useState<"all" | "upcoming" | "registered">("all")
  const [isRegistering, setIsRegistering] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  const isRegistered = (eventId: string) => {
    return userRegistrations.some((r) => r.event_id === eventId)
  }

  const handleRegister = async (eventId: string) => {
    setIsRegistering(eventId)
    try {
      const supabase = createClient()
      const { error } = await supabase.from("event_registrations").insert({
        event_id: eventId,
        user_id: userId,
      })

      if (error) throw error

      toast({
        title: "Registro exitoso",
        description: "Te has registrado en el evento",
      })

      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo registrar",
        variant: "destructive",
      })
    } finally {
      setIsRegistering(null)
    }
  }

  const handleUnregister = async (eventId: string) => {
    setIsRegistering(eventId)
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from("event_registrations")
        .delete()
        .eq("event_id", eventId)
        .eq("user_id", userId)

      if (error) throw error

      toast({
        title: "Registro cancelado",
        description: "Has cancelado tu registro en el evento",
      })

      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo cancelar el registro",
        variant: "destructive",
      })
    } finally {
      setIsRegistering(null)
    }
  }

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description?.toLowerCase().includes(searchQuery.toLowerCase())

    const now = new Date()
    const eventDate = new Date(event.start_date)
    const isUpcoming = eventDate >= now

    const matchesFilter =
      filter === "all" || (filter === "upcoming" && isUpcoming) || (filter === "registered" && isRegistered(event.id))

    return matchesSearch && matchesFilter
  })

  const getEventTypeColor = (type: string | null) => {
    const colors: Record<string, string> = {
      camporee: "bg-green-500",
      training: "bg-blue-500",
      meeting: "bg-purple-500",
      service: "bg-orange-500",
    }
    return type ? colors[type] || "bg-gray-500" : "bg-gray-500"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold text-gray-900">Eventos</h1>
          <p className="text-gray-600">Descubre y participa en eventos de conquistadores</p>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Buscar eventos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant={filter === "all" ? "default" : "outline"} size="sm" onClick={() => setFilter("all")}>
                  Todos
                </Button>
                <Button
                  variant={filter === "upcoming" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter("upcoming")}
                >
                  Próximos
                </Button>
                <Button
                  variant={filter === "registered" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter("registered")}
                >
                  Mis Eventos
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Events Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.map((event) => {
            const registered = isRegistered(event.id)
            const eventDate = new Date(event.start_date)
            const isPast = eventDate < new Date()

            return (
              <Card key={event.id} className="flex flex-col">
                {event.image_url && (
                  <div className="h-48 overflow-hidden rounded-t-lg">
                    <img
                      src={event.image_url || "/placeholder.svg"}
                      alt={event.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                <CardHeader>
                  <div className="mb-2 flex items-start justify-between">
                    <CardTitle className="text-lg">{event.title}</CardTitle>
                    {event.event_type && (
                      <Badge className={`${getEventTypeColor(event.event_type)} text-white`}>{event.event_type}</Badge>
                    )}
                  </div>
                  {event.description && <p className="text-sm text-gray-600 line-clamp-2">{event.description}</p>}
                </CardHeader>
                <CardContent className="flex flex-1 flex-col justify-between space-y-4">
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{eventDate.toLocaleDateString()}</span>
                      {event.end_date && (
                        <>
                          <span>-</span>
                          <span>{new Date(event.end_date).toLocaleDateString()}</span>
                        </>
                      )}
                    </div>
                    {event.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{event.location}</span>
                      </div>
                    )}
                    {event.max_participants && (
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span>Máximo {event.max_participants} participantes</span>
                      </div>
                    )}
                  </div>

                  {registered ? (
                    <div className="space-y-2">
                      <Badge className="w-full justify-center bg-green-500 text-white">
                        <CheckCircle2 className="mr-1 h-4 w-4" />
                        Registrado
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full bg-transparent"
                        onClick={() => handleUnregister(event.id)}
                        disabled={isRegistering === event.id || isPast}
                      >
                        Cancelar Registro
                      </Button>
                    </div>
                  ) : (
                    <Button
                      onClick={() => handleRegister(event.id)}
                      disabled={isRegistering === event.id || isPast}
                      className="w-full"
                    >
                      {isPast ? "Evento Finalizado" : isRegistering === event.id ? "Registrando..." : "Registrarse"}
                    </Button>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>

        {filteredEvents.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Calendar className="mb-4 h-16 w-16 text-gray-400" />
              <h3 className="mb-2 text-xl font-semibold text-gray-900">No se encontraron eventos</h3>
              <p className="text-center text-gray-600">Intenta ajustar tus filtros de búsqueda</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
