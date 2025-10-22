"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check } from "lucide-react"

const AVAILABLE_INTERESTS = [
  { id: "viajes", label: "Viajes", icon: "✈️" },
  { id: "comida", label: "Comida", icon: "🍔" },
  { id: "aventuras", label: "Aventuras", icon: "🏔️" },
  { id: "ayudar", label: "Ayudar", icon: "🙏" },
  { id: "naturaleza", label: "Naturaleza", icon: "🌿" },
  { id: "animales", label: "Animales", icon: "🐶" },
  { id: "musica", label: "Música", icon: "🎵" },
  { id: "artes", label: "Artes", icon: "🎨" },
  { id: "medicina", label: "Medicina", icon: "💊" },
  { id: "diversion", label: "Diversión", icon: "🎮" },
  { id: "deportes", label: "Deportes", icon: "🏀" },
  { id: "dibujar", label: "Dibujar", icon: "✏️" },
]

interface InterestsSelectorProps {
  selectedInterests: string[]
  onInterestsChange: (interests: string[]) => void
  onComplete?: () => void
}

export function InterestsSelector({ selectedInterests, onInterestsChange, onComplete }: InterestsSelectorProps) {
  const [selected, setSelected] = useState<string[]>(selectedInterests)

  const toggleInterest = (interestId: string) => {
    setSelected((prev) => {
      if (prev.includes(interestId)) {
        return prev.filter((id) => id !== interestId)
      }
      return [...prev, interestId]
    })
  }

  const handleSave = () => {
    onInterestsChange(selected)
    onComplete?.()
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>¿Qué te gusta?</CardTitle>
        <CardDescription>
          Selecciona tus intereses para recibir sugerencias de especialidades y conectar con personas con tus mismos
          gustos
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {AVAILABLE_INTERESTS.map((interest) => (
            <Button
              key={interest.id}
              variant={selected.includes(interest.id) ? "default" : "outline"}
              className="relative h-auto flex-col gap-2 p-4"
              onClick={() => toggleInterest(interest.id)}
            >
              {selected.includes(interest.id) && (
                <div className="absolute right-2 top-2">
                  <Check className="h-4 w-4" />
                </div>
              )}
              <span className="text-2xl">{interest.icon}</span>
              <span className="text-sm">{interest.label}</span>
            </Button>
          ))}
        </div>

        {selected.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Intereses seleccionados:</p>
            <div className="flex flex-wrap gap-2">
              {selected.map((id) => {
                const interest = AVAILABLE_INTERESTS.find((i) => i.id === id)
                return interest ? (
                  <Badge key={id} variant="secondary">
                    {interest.icon} {interest.label}
                  </Badge>
                ) : null
              })}
            </div>
          </div>
        )}

        <Button onClick={handleSave} className="w-full" disabled={selected.length === 0}>
          Guardar intereses
        </Button>
      </CardContent>
    </Card>
  )
}
