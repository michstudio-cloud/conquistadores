"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Users,
  Award,
  Calendar,
  BookOpen,
  MessageSquare,
  TrendingUp,
  MapPin,
  ArrowRight,
  Bell,
  Search,
} from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"

interface Profile {
  id: string
  username: string
  display_name: string | null
  avatar_url: string | null
  role: string
  city: string | null
  country: string | null
}

interface UserClub {
  club: {
    id: string
    name: string
    logo_url: string | null
    city: string
  }
}

interface ActiveSpecialty {
  specialty_id: string
  progress_percentage: number
  status: string
  specialty: {
    id: string
    title: string
    slug: string
    badge_image_url: string | null
  }
}

interface Event {
  id: string
  title: string
  start_date: string
  location: string | null
  image_url: string | null
}

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  cover_image_url: string | null
  published_at: string | null
}

interface DashboardProps {
  profile: Profile
  userClubs: UserClub[]
  activeSpecialties: ActiveSpecialty[]
  upcomingEvents: Event[]
  recentPosts: BlogPost[]
  unreadMessages: number
}

export function Dashboard({
  profile,
  userClubs,
  activeSpecialties,
  upcomingEvents,
  recentPosts,
  unreadMessages,
}: DashboardProps) {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="border-b bg-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={profile.avatar_url || undefined} />
                <AvatarFallback>{profile.username.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Hola, {profile.display_name || profile.username}</h2>
                <p className="text-sm text-gray-600">
                  {getRoleLabel(profile.role)}
                  {profile.city && ` • ${profile.city}`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {unreadMessages > 0 && (
                  <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                    {unreadMessages}
                  </span>
                )}
              </Button>
              <Button asChild variant="ghost" size="icon">
                <Link href="/profile">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={profile.avatar_url || undefined} />
                    <AvatarFallback>{profile.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl p-6">
        {/* Search Bar */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <Input placeholder="Buscar especialidades, eventos, amigos..." className="pl-10 text-lg" />
            </div>
          </CardContent>
        </Card>

        {/* Quick Access */}
        <div className="mb-6">
          <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
            <TrendingUp className="h-5 w-5" />
            Acceso Rápido
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Button asChild variant="outline" className="h-auto flex-col gap-2 bg-white p-6">
              <Link href="/specialties">
                <Award className="h-8 w-8 text-blue-600" />
                <span className="font-semibold">Especialidades</span>
                <span className="text-xs text-gray-600">{activeSpecialties.length} activas</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto flex-col gap-2 bg-white p-6">
              <Link href="/clubs">
                <Users className="h-8 w-8 text-green-600" />
                <span className="font-semibold">Mis Clubes</span>
                <span className="text-xs text-gray-600">{userClubs.length} clubes</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto flex-col gap-2 bg-white p-6">
              <Link href="/events">
                <Calendar className="h-8 w-8 text-purple-600" />
                <span className="font-semibold">Eventos</span>
                <span className="text-xs text-gray-600">{upcomingEvents.length} próximos</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto flex-col gap-2 bg-white p-6">
              <Link href="/messages">
                <MessageSquare className="h-8 w-8 text-orange-600" />
                <span className="font-semibold">Mensajes</span>
                {unreadMessages > 0 && <Badge className="bg-red-500 text-white">{unreadMessages} nuevos</Badge>}
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="space-y-6 lg:col-span-2">
            {/* Active Specialties */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Mis Especialidades
                </CardTitle>
                <Button asChild variant="ghost" size="sm">
                  <Link href="/specialties">
                    Ver todas <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                {activeSpecialties.length === 0 ? (
                  <div className="py-8 text-center">
                    <Award className="mx-auto mb-2 h-12 w-12 text-gray-400" />
                    <p className="text-sm text-gray-600">No tienes especialidades activas</p>
                    <Button asChild className="mt-4" size="sm">
                      <Link href="/specialties">Explorar Especialidades</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {activeSpecialties.map((item) => (
                      <Link
                        key={item.specialty_id}
                        href={`/specialties/${item.specialty.slug}`}
                        className="block rounded-lg border p-4 transition-all hover:shadow-md"
                      >
                        <div className="flex items-center gap-4">
                          {item.specialty.badge_image_url ? (
                            <img
                              src={item.specialty.badge_image_url || "/placeholder.svg"}
                              alt={item.specialty.title}
                              className="h-12 w-12 rounded-full object-cover"
                            />
                          ) : (
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                              <Award className="h-6 w-6 text-blue-600" />
                            </div>
                          )}
                          <div className="flex-1">
                            <h4 className="font-semibold">{item.specialty.title}</h4>
                            <div className="mt-2 flex items-center gap-2">
                              <Progress value={item.progress_percentage} className="flex-1" />
                              <span className="text-sm font-medium">{item.progress_percentage}%</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Upcoming Events */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Próximos Eventos
                </CardTitle>
                <Button asChild variant="ghost" size="sm">
                  <Link href="/events">
                    Ver todos <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                {upcomingEvents.length === 0 ? (
                  <div className="py-8 text-center">
                    <Calendar className="mx-auto mb-2 h-12 w-12 text-gray-400" />
                    <p className="text-sm text-gray-600">No hay eventos próximos</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {upcomingEvents.map((event) => (
                      <div key={event.id} className="flex gap-4 rounded-lg border p-4">
                        {event.image_url && (
                          <img
                            src={event.image_url || "/placeholder.svg"}
                            alt={event.title}
                            className="h-16 w-16 rounded-lg object-cover"
                          />
                        )}
                        <div className="flex-1">
                          <h4 className="font-semibold">{event.title}</h4>
                          <div className="mt-1 flex items-center gap-3 text-sm text-gray-600">
                            <span>{new Date(event.start_date).toLocaleDateString()}</span>
                            {event.location && (
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {event.location}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* My Clubs */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Mis Clubes
                </CardTitle>
              </CardHeader>
              <CardContent>
                {userClubs.length === 0 ? (
                  <div className="py-4 text-center">
                    <Users className="mx-auto mb-2 h-8 w-8 text-gray-400" />
                    <p className="mb-3 text-sm text-gray-600">No estás en ningún club</p>
                    <Button asChild size="sm">
                      <Link href="/onboarding/club-selection">Unirse a un Club</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {userClubs.map((item) => (
                      <Link
                        key={item.club.id}
                        href={`/clubs/${item.club.id}`}
                        className="flex items-center gap-3 rounded-lg border p-3 transition-all hover:shadow-md"
                      >
                        {item.club.logo_url ? (
                          <img
                            src={item.club.logo_url || "/placeholder.svg"}
                            alt={item.club.name}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                            <Users className="h-5 w-5 text-blue-600" />
                          </div>
                        )}
                        <div className="flex-1">
                          <p className="font-semibold">{item.club.name}</p>
                          <p className="text-xs text-gray-600">{item.club.city}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Blog Posts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Noticias
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recentPosts.length === 0 ? (
                  <p className="py-4 text-center text-sm text-gray-600">No hay publicaciones recientes</p>
                ) : (
                  <div className="space-y-3">
                    {recentPosts.map((post) => (
                      <Link
                        key={post.id}
                        href={`/blog/${post.slug}`}
                        className="block rounded-lg border p-3 transition-all hover:shadow-md"
                      >
                        <h4 className="font-semibold line-clamp-2">{post.title}</h4>
                        {post.excerpt && <p className="mt-1 text-sm text-gray-600 line-clamp-2">{post.excerpt}</p>}
                        {post.published_at && (
                          <p className="mt-2 text-xs text-gray-500">
                            {new Date(post.published_at).toLocaleDateString()}
                          </p>
                        )}
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
