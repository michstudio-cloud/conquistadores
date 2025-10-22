"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { CheckCircle2, Circle } from "lucide-react"

interface Requirement {
  id: string
  title: string
  description: string | null
  type: string
  options: any
  order_index: number
  is_required: boolean
}

interface Section {
  id: string
  title: string
  description: string | null
  content: string | null
  video_url: string | null
  requirements: Requirement[]
}

interface UserProgress {
  id: string
  requirement_id: string
  answer: string | null
  is_completed: boolean
}

interface SpecialtySectionProps {
  section: Section
  userProgress: UserProgress[]
  userId: string
  onProgressUpdate: () => void
}

export function SpecialtySection({ section, userProgress, userId, onProgressUpdate }: SpecialtySectionProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const getRequirementProgress = (requirementId: string) => {
    return userProgress.find((p) => p.requirement_id === requirementId)
  }

  const handleSubmitAnswer = async (requirementId: string, answer: string) => {
    setIsSubmitting(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.from("user_requirement_progress").upsert({
        user_id: userId,
        requirement_id: requirementId,
        answer,
        is_completed: true,
      })

      if (error) throw error

      toast({
        title: "Respuesta guardada",
        description: "Tu progreso ha sido actualizado",
      })

      onProgressUpdate()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo guardar la respuesta",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6 rounded-lg bg-gray-50 p-6">
      {section.description && <p className="text-gray-700">{section.description}</p>}

      {section.content && (
        <div className="prose prose-sm max-w-none">
          <div dangerouslySetInnerHTML={{ __html: section.content }} />
        </div>
      )}

      {section.video_url && (
        <div className="aspect-video overflow-hidden rounded-lg">
          <iframe
            src={section.video_url}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}

      {section.requirements.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900">Requisitos</h4>
          {section.requirements.map((requirement, index) => {
            const progress = getRequirementProgress(requirement.id)
            const isCompleted = progress?.is_completed || false

            return (
              <div key={requirement.id} className="rounded-lg border bg-white p-4">
                <div className="mb-3 flex items-start gap-2">
                  {isCompleted ? (
                    <CheckCircle2 className="mt-1 h-5 w-5 flex-shrink-0 text-green-500" />
                  ) : (
                    <Circle className="mt-1 h-5 w-5 flex-shrink-0 text-gray-400" />
                  )}
                  <div className="flex-1">
                    <h5 className="font-medium">
                      {index + 1}. {requirement.title}
                      {requirement.is_required && <span className="ml-1 text-red-500">*</span>}
                    </h5>
                    {requirement.description && <p className="mt-1 text-sm text-gray-600">{requirement.description}</p>}
                  </div>
                </div>

                {!isCompleted && (
                  <div className="ml-7 space-y-3">
                    {requirement.type === "text" && (
                      <>
                        <Textarea
                          placeholder="Escribe tu respuesta..."
                          value={answers[requirement.id] || ""}
                          onChange={(e) => setAnswers({ ...answers, [requirement.id]: e.target.value })}
                          rows={4}
                        />
                        <Button
                          onClick={() => handleSubmitAnswer(requirement.id, answers[requirement.id] || "")}
                          disabled={!answers[requirement.id] || isSubmitting}
                          size="sm"
                        >
                          Enviar Respuesta
                        </Button>
                      </>
                    )}

                    {requirement.type === "multiple_choice" && requirement.options?.choices && (
                      <>
                        <RadioGroup
                          value={answers[requirement.id]}
                          onValueChange={(value) => setAnswers({ ...answers, [requirement.id]: value })}
                        >
                          {requirement.options.choices.map((choice: string, idx: number) => (
                            <div key={idx} className="flex items-center space-x-2">
                              <RadioGroupItem value={choice} id={`${requirement.id}-${idx}`} />
                              <Label htmlFor={`${requirement.id}-${idx}`}>{choice}</Label>
                            </div>
                          ))}
                        </RadioGroup>
                        <Button
                          onClick={() => handleSubmitAnswer(requirement.id, answers[requirement.id] || "")}
                          disabled={!answers[requirement.id] || isSubmitting}
                          size="sm"
                        >
                          Enviar Respuesta
                        </Button>
                      </>
                    )}
                  </div>
                )}

                {isCompleted && progress?.answer && (
                  <div className="ml-7 rounded-lg bg-green-50 p-3">
                    <p className="text-sm text-green-900">
                      <strong>Tu respuesta:</strong> {progress.answer}
                    </p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
