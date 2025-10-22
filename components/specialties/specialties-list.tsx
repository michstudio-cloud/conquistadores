"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Search, Clock, Award, TrendingUp } from "lucide-react"
import Link from "next/link"

interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  icon: string | null
  color: string | null
}

interface Specialty {
  id: string
  title: string
  slug: string
  description: string | null
  badge_image_url: string | null
  duration_hours: number | null
  difficulty_level: number
  category: Category | null
  instructor: {
    id: string
    username: string
    display_name: string | null
    avatar_url: string | null
  } | null
}

interface UserSpecialty {
  specialty_id: string
  status: string
  progress_percentage: number
}

interface SpecialtiesListProps {
  categories: Category[]
  specialties: Specialty[]
  userSpecialties: UserSpecialty[]
  userId: string
}

export function SpecialtiesList({ categories, specialties, userSpecialties }: SpecialtiesListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<"all" | "enrolled" | "available">("all")

  const getUserSpecialtyStatus = (specialtyId: string) => {
    return userSpecialties.find((us) => us.specialty_id === specialtyId)
  }

  const filteredSpecialties = specialties.filter((specialty) => {
    const matchesSearch =
      specialty.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      specialty.description?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = !selectedCategory || specialty.category?.id === selectedCategory
    const userStatus = getUserSpecialtyStatus(specialty.id)
    const matchesFilter =
      filterStatus === "all" ||
      (filterStatus === "enrolled" && userStatus) ||
      (filterStatus === "available" && !userStatus)

    return matchesSearch && matchesCategory && matchesFilter
  })

  const getDifficultyLabel = (level: number) => {
    if (level === 1) return "Básico"
    if (level === 2) return "Intermedio"
    return "Avanzado"
  }

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { label: string; color: string }> = {
      active: { label: "En Progreso", color: "bg-blue-500" },
      pending: { label: "Pendiente", color: "bg-yellow-500" },
      completed: { label: "Completado", color: "bg-green-500" },
      archived: { label: "Archivado", color: "bg-gray-500" },
    }
    return badges[status] || { label: status, color: "bg-gray-500" }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold text-gray-900">Especialidades</h1>
          <p className="text-gray-600">Explora y completa especialidades para obtener certificados</p>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Buscar especialidades..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  variant={filterStatus === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterStatus("all")}
                >
                  Todas
                </Button>
                <Button
                  variant={filterStatus === "enrolled" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterStatus("enrolled")}
                >
                  Mis Especialidades
                </Button>
                <Button
                  variant={filterStatus === "available" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterStatus("available")}
                >
                  Disponibles
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          <Button
            variant={!selectedCategory ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(null)}
          >
            Todas las categorías
          </Button>
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className="whitespace-nowrap"
            >
              {category.icon} {category.name}
            </Button>
          ))}
        </div>

        {/* Specialties Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredSpecialties.map((specialty) => {
            const userStatus = getUserSpecialtyStatus(specialty.id)
            const statusBadge = userStatus ? getStatusBadge(userStatus.status) : null

            return (
              <Link key={specialty.id} href={`/specialties/${specialty.slug}`}>
                <Card className="h-full transition-all hover:shadow-lg">
                  <CardHeader>
                    <div className="mb-4 flex items-center justify-center">
                      {specialty.badge_image_url ? (
                        <img
                          src={specialty.badge_image_url || "/placeholder.svg"}
                          alt={specialty.title}
                          className="h-24 w-24 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-indigo-600">
                          <Award className="h-12 w-12 text-white" />
                        </div>
                      )}
                    </div>
                    <CardTitle className="text-center text-lg">{specialty.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {specialty.description && (
                      <p className="line-clamp-2 text-sm text-gray-600">{specialty.description}</p>
                    )}

                    <div className="flex flex-wrap gap-2">
                      {specialty.category && (
                        <Badge variant="secondary" style={{ backgroundColor: specialty.category.color || undefined }}>
                          {specialty.category.name}
                        </Badge>
                      )}
                      <Badge variant="outline">{getDifficultyLabel(specialty.difficulty_level)}</Badge>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      {specialty.duration_hours && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{specialty.duration_hours}h</span>
                        </div>
                      )}
                      {userStatus && (
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-4 w-4" />
                          <span>{userStatus.progress_percentage}%</span>
                        </div>
                      )}
                    </div>

                    {statusBadge && (
                      <Badge className={`${statusBadge.color} w-full justify-center text-white`}>
                        {statusBadge.label}
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>

        {filteredSpecialties.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Award className="mb-4 h-16 w-16 text-gray-400" />
              <h3 className="mb-2 text-xl font-semibold text-gray-900">No se encontraron especialidades</h3>
              <p className="text-center text-gray-600">Intenta ajustar tus filtros de búsqueda</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
