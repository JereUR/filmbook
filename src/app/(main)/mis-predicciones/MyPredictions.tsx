"use client"

import { useState, useEffect } from "react"

type Prediction = {
  id: string
  category: string
  predictedWinner: string
  favoriteWinner: string
  awardEvent: {
    name: string
    year: number
  }
}

export default function MyPredictions({ userId }: { userId: string }) {
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (userId) {
      fetchPredictions(userId)
    }
  }, [userId])

  const fetchPredictions = async (userId: string) => {
    try {
      const response = await fetch(`/api/predictions/${userId}`)
      if (!response.ok) {
        throw new Error("Failed to fetch predictions")
      }
      const data = await response.json()
      setPredictions(data)
    } catch (err) {
      setError("Error al cargar las predicciones")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) return <div>Cargando predicciones...</div>
  if (error) return <div>{error}</div>
  if (predictions.length === 0) return <div>No se encontraron predicciones.</div>

  return (
    <div className="space-y-6">
      {predictions.map((prediction) => (
        <div key={prediction.id} className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-2">{prediction.category}</h2>
          <p className="text-gray-600">
            Evento: {prediction.awardEvent.name} {prediction.awardEvent.year}
          </p>
          <p>Ganador predicho: {prediction.predictedWinner}</p>
          <p>Favorito personal: {prediction.favoriteWinner}</p>
        </div>
      ))}
    </div>
  )
}

