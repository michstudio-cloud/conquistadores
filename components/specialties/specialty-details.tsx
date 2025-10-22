"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { Clock, Award, BookOpen, CheckCircle2, Circle, Play } from "lucide-react"
import { SpecialtySection } from "./specialty-section"

interface Specialty {
  id: string
  title: string
  description: string | null
  badge_image_url: string | null
  duration_hours: number | null
  difficulty_level: number
  category: {
    name: string
    color: string | null
  } | null
  instructor: {
    id: string
    username: string
    display_name: string | null
    avatar_url: string | null
  } | null
}

interface Section {
  id: string
  title: string
  description: string | null
  content: string | null
  video_url: string | null
  order_index: number
  duration_minutes: number | null
  requirements: Requirement[]
}

interface Requirement {
  id: string
  title: string
  description: string | null
  type: string
  options: any
  order_index: number
  is_required: boolean
}

interface Enrollment {
  id: string
  status: string
  progress_percentage: number
  enrolled_at: string
}

interface UserProgress {
  id: string
  requirement_id: string
  answer: string | null
  is_completed: boolean
}

interface SpecialtyDetailsProps {
  specialty: Specialty
  sections: Section[]
  enrollment: Enrollment | null
  userProgress: UserProgress[]
  userId: string
}

export function SpecialtyDetails({ specialty, sections, enrollment, userProgress, userId }: SpecialtyDetailsProps) {
  const [isEnrolling, setIsEnrolling] = useState(false)
  const [expandedSection, setExpandedSection] = useState<string | null>(sections[0]?.id || null)
  const router = useRouter()
  const { toast } = useToast()

  const handleEnroll = async () => {
    setIsEnrolling(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.from("user_specialties").insert({
        user_id: userId,
        specialty_id: specialty.id,
        status: "active",
        progress_percentage: 0,
      })

      if (error) throw error

      toast({
        title: "Inscripción exitosa",
        description: "Te has inscrito en esta especialidad",
      })

      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo inscribir",
        variant: "destructive",
      })
    } finally {
      setIsEnrolling(false)
    }
  }

  const getDifficultyLabel = (level: number) => {
    if (level === 1) return "Básico"
    if (level === 2) return "Intermedio"
    return "Avanzado"
  }

  const totalRequirements = sections.reduce((sum, section) => sum + section.requirements.length, 0)
  const completedRequirements = userProgress.filter((p) => p.is_completed).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="mx-auto max-w-5xl space-y-6">
        {/* Specialty Header */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
              <div className="flex-shrink-0">
                {specialty.badge_image_url ? (
                  <img
                    src={specialty.badge_image_url || "/placeholder.svg"}
                    alt={specialty.title}
                    className="h-32 w-32 rounded-full object-cover shadow-lg"
                  />
                ) : (
                  <div className="flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 shadow-lg">
                    <Award className="h-16 w-16 text-white" />
                  </div>
                )}
              </div>

              <div className="flex-1 text-center md:text-left">
                <h1 className="mb-2 text-3xl font-bold text-gray-900">{specialty.title}</h1>
                {specialty.description && <p className="mb-4 text-gray-700">{specialty.description}</p>}

                <div className="mb-4 flex flex-wrap gap-2">
                  {specialty.category && (
                    <Badge style={{ backgroundColor: specialty.category.color || undefined }}>
                      {specialty.category.name}
                    </Badge>
                  )}
                  <Badge variant="outline">{getDifficultyLabel(specialty.difficulty_level)}</Badge>
                  {specialty.duration_hours && (
                    <Badge variant="secondary" className="gap-1">
                      <Clock className="h-3 w-3" />
                      {specialty.duration_hours} horas
                    </Badge>
                  )}
                  <Badge variant="secondary" className="gap-1">
                    <BookOpen className="h-3 w-3" />
                    {sections.length} lecciones
                  </Badge>
                </div>

                {specialty.instructor && (
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={specialty.instructor.avatar_url || undefined} />
                      <AvatarFallback>{specialty.instructor.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="text-sm">
                      <p className="font-medium">Instructor</p>
                      <p className="text-gray-600">
                        {specialty.instructor.display_name || specialty.instructor.username}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {!enrollment ? (
                <Button onClick={handleEnroll} disabled={isEnrolling} size="lg" className="gap-2">
                  <Play className="h-4 w-4" />
                  {isEnrolling ? "Inscribiendo..." : "Comenzar Especialidad"}
                </Button>
              ) : (
                <div className="w-full md:w-auto">
                  <div className="mb-2 text-sm font-medium text-gray-700">Progreso</div>
                  <div className="flex items-center gap-2">
                    <Progress value={enrollment.progress_percentage} className="w-32" />
                    <span className="text-sm font-semibold">{enrollment.progress_percentage}%</span>
                  </div>
                  <div className="mt-1 text-xs text-gray-600">
                    {completedRequirements} de {totalRequirements} requisitos completados
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Course Content */}
        {enrollment && (
          <Card>
            <CardHeader>
              <CardTitle>Contenido del Curso</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {sections.map((section, index) => {
                const sectionProgress = section.requirements.filter((req) =>
                  userProgress.some((p) => p.requirement_id === req.id && p.is_completed),
                ).length
                const sectionTotal = section.requirements.length
                const isCompleted = sectionProgress === sectionTotal && sectionTotal > 0

                return (
                  <div key={section.id} className="border-b pb-4 last:border-b-0">
                    <button
                      onClick={() => setExpandedSection(expandedSection === section.id ? null : section.id)}
                      className="flex w-full items-center justify-between text-left"
                    >
                      <div className="flex items-center gap-3">
                        {isCompleted ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        ) : (
                          <Circle className="h-5 w-5 text-gray-400" />
                        )}
                        <div>
                          <h3 className="font-semibold">
                            {index + 1}. {section.title}
                          </h3>
                          {section.duration_minutes && (
                            <p className="text-sm text-gray-600">{section.duration_minutes} minutos</p>
                          )}
                        </div>
                      </div>
                      <Badge variant="secondary">
                        {sectionProgress}/{sectionTotal}
                      </Badge>
                    </button>

                    {expandedSection === section.id && (
                      <div className="mt-4">
                        <SpecialtySection
                          section={section}
                          userProgress={userProgress}
                          userId={userId}
                          onProgressUpdate={() => router.refresh()}
                        />
                      </div>
                    )}
                  </div>
                )
              })}
            </CardContent>
          </Card>
        )}

        {!enrollment && (
          <Card>
            <CardContent className="py-16 text-center">
              <Award className="mx-auto mb-4 h-16 w-16 text-gray-400" />
              <h3 className="mb-2 text-xl font-semibold text-gray-900">Inscríbete para comenzar</h3>
              <p className="mb-6 text-gray-600">Inscríbete en esta especialidad para acceder al contenido completo</p>
              <Button onClick={handleEnroll} disabled={isEnrolling} size="lg">
                {isEnrolling ? "Inscribiendo..." : "Comenzar Ahora"}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
