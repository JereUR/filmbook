"use client"

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
        <Button onClick={() => router.push("/")}>
          Ir a la página principal
        </Button>
      </CardContent>
    </Card>
  )
}

