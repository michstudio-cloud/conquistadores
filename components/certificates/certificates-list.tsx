"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Award, Download, Calendar, CheckCircle2, Clock, XCircle } from "lucide-react"

interface Certificate {
  id: string
  certificate_number: string
  status: string
  issued_at: string | null
  created_at: string
  specialty: {
    id: string
    title: string
    badge_image_url: string | null
  }
  issued_by_profile: {
    id: string
    username: string
    display_name: string | null
  } | null
}

interface CertificatesListProps {
  certificates: Certificate[]
}

export function CertificatesList({ certificates }: CertificatesListProps) {
  const getStatusBadge = (status: string) => {
    const badges: Record<string, { label: string; color: string; icon: any }> = {
      pending: { label: "Pendiente", color: "bg-yellow-500", icon: Clock },
      approved: { label: "Aprobado", color: "bg-green-500", icon: CheckCircle2 },
      rejected: { label: "Rechazado", color: "bg-red-500", icon: XCircle },
    }
    return badges[status] || { label: status, color: "bg-gray-500", icon: Clock }
  }

  const approvedCertificates = certificates.filter((c) => c.status === "approved")
  const pendingCertificates = certificates.filter((c) => c.status === "pending")

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold text-gray-900">Mis Certificados</h1>
          <p className="text-gray-600">Visualiza y descarga tus certificados de especialidades</p>
        </div>

        {/* Stats */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-green-600">{approvedCertificates.length}</div>
              <div className="text-sm text-gray-600">Certificados Aprobados</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-yellow-600">{pendingCertificates.length}</div>
              <div className="text-sm text-gray-600">En Revisión</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-blue-600">{certificates.length}</div>
              <div className="text-sm text-gray-600">Total de Certificados</div>
            </CardContent>
          </Card>
        </div>

        {/* Certificates List */}
        {certificates.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Award className="mb-4 h-16 w-16 text-gray-400" />
              <h3 className="mb-2 text-xl font-semibold text-gray-900">No tienes certificados</h3>
              <p className="text-center text-gray-600">Completa especialidades para obtener certificados</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {certificates.map((certificate) => {
              const statusBadge = getStatusBadge(certificate.status)
              const StatusIcon = statusBadge.icon

              return (
                <Card key={certificate.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        {certificate.specialty.badge_image_url ? (
                          <img
                            src={certificate.specialty.badge_image_url || "/placeholder.svg"}
                            alt={certificate.specialty.title}
                            className="h-16 w-16 rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-indigo-600">
                            <Award className="h-8 w-8 text-white" />
                          </div>
                        )}
                        <div>
                          <CardTitle className="text-lg">{certificate.specialty.title}</CardTitle>
                          <p className="text-sm text-gray-600">#{certificate.certificate_number}</p>
                        </div>
                      </div>
                      <Badge className={`${statusBadge.color} gap-1 text-white`}>
                        <StatusIcon className="h-3 w-3" />
                        {statusBadge.label}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>Solicitado: {new Date(certificate.created_at).toLocaleDateString()}</span>
                      </div>
                      {certificate.issued_at && (
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4" />
                          <span>Emitido: {new Date(certificate.issued_at).toLocaleDateString()}</span>
                        </div>
                      )}
                      {certificate.issued_by_profile && (
                        <div className="text-sm">
                          <span className="font-medium">Emitido por:</span>{" "}
                          {certificate.issued_by_profile.display_name || certificate.issued_by_profile.username}
                        </div>
                      )}
                    </div>

                    {certificate.status === "approved" && (
                      <Button className="w-full gap-2">
                        <Download className="h-4 w-4" />
                        Descargar Certificado
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
