"use client"

import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"

import type { Recommendation } from "@/lib/types"
import { getRecomendationsMovieById } from "@/lib/tmdb"
import RecommendationItem from "./RecommendationItem"

interface RecommendationsProps {
  id: string
  className?: string
}

export default function Recommendations({
  id,
  className,
}: RecommendationsProps) {
  const [loadingRecommendations, setLoadingRecommendations] =
    useState<boolean>(true)
  const [recommendations, setRecommendations] = useState<
    Recommendation[] | null
  >(null)
  const [counter, setCounter] = useState<number>(10)

  useEffect(() => {
    let countdownInterval: NodeJS.Timeout

    if (id) {
      countdownInterval = setInterval(() => {
        setCounter((prevCounter) => {
          if (prevCounter === 1) {
            clearInterval(countdownInterval)
            fetchRecommendations()
            return 0
          }
          return prevCounter - 1
        })
      }, 1000)

      return () => clearInterval(countdownInterval)
    }

    return () => clearInterval(countdownInterval)
  }, [id])

  async function fetchRecommendations() {
    setLoadingRecommendations(true)
    try {
      const data = await getRecomendationsMovieById(id)
      setRecommendations(data)
    } catch (error) {

      setRecommendations(null)
    } finally {
      setLoadingRecommendations(false)
    }
  }

  return (
    <div className="space-y-5 rounded-2xl bg-card p-5 shadow-sm">
      <div className="text-xl font-bold">Recomendaciones</div>
      {loadingRecommendations ? (
        <div className="flex items-center gap-2 italic">
          <p className="text-primary font-semibold">
            OBTENIENDO RECOMENDACIONES...
          </p>
          <div className="relative flex items-center justify-center">
            <div className="relative h-14 w-14">
              <Loader2 className="absolute inset-0 h-14 w-14 animate-spin text-primary" />
              <span className="absolute inset-0 flex items-center justify-center text-xl font-semibold">
                {counter}
              </span>
            </div>
          </div>
        </div>
      ) : recommendations ? (
        recommendations.length > 0 ? (
          <ul className="-px-2 space-y-2">
            {recommendations.map((rec) => (
              <RecommendationItem key={rec.id} recommendation={rec} />
            ))}
          </ul>
        ) : (
          <p className="text-center text-foreground/40">
            No hay recomendaciones disponibles.
          </p>
        )
      ) : (
        <p className="text-center text-destructive">
          No se pudieron cargar las recomendaciones.
        </p>
      )}
    </div>
  )
}
