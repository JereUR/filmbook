"use client"

import { Award } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function EmptyPredictions() {
  const router = useRouter()

  return (
    <Card className="text-center">
      <CardHeader>
        <CardTitle>No hay predicciones</CardTitle>
        <CardDescription>Comienza creando tus predicciones para los premios</CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={() => router.push("/crear-predicciones/Oscars-2025")} className="gap-2">
          <Award className="h-4 w-4" />
          Crear predicciones para los Oscars 2025
        </Button>
      </CardContent>
    </Card>
  )
}

