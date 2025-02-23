"use client"

import { useState, useEffect } from "react"
import type { AwardEvent } from "@/types/predictions"

export function usePredictions(userId: string) {
  const [awardEvents, setAwardEvents] = useState<AwardEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (userId) {
      fetchPredictions()
    }
  }, [userId])

  const fetchPredictions = async () => {
    try {
      const response = await fetch(`/api/predictions/${userId}`)
      if (!response.ok) {
        throw new Error("Error al cargar las predicciones")
      }
      const data = await response.json()
      setAwardEvents(data)
    } catch (err) {
      setError("Error al cargar las predicciones")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const updatePredictions = (newEvents: AwardEvent[]) => {
    setAwardEvents(newEvents)
  }

  return {
    awardEvents,
    isLoading,
    error,
    updatePredictions,
  }
}
