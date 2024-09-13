'use client'

import { useEffect, useState } from "react";
import type { Recommendation } from "@/lib/types";
import { getRecomendationsMovieById } from "@/lib/tmdb";

interface RecommendationsProps {
  id: string;
  className?: string;
}

export default function Recommendations({ id, className }: RecommendationsProps) {
  const [loadingRecommendations, setLoadingRecommendations] = useState<boolean>(true);
  const [recommendations, setRecommendations] = useState<Recommendation[] | null>(null);
  const [counter, setCounter] = useState<number>(10);

  useEffect(() => {
    let countdownInterval: NodeJS.Timeout;

    if (id) {
      countdownInterval = setInterval(() => {
        setCounter((prevCounter) => {
          if (prevCounter === 1) {
            clearInterval(countdownInterval);
            fetchRecommendations();
            return 0;
          }
          return prevCounter - 1;
        });
      }, 1000);

      return () => clearInterval(countdownInterval);
    }

    return () => clearInterval(countdownInterval);

  }, [id]);

  async function fetchRecommendations() {
    setLoadingRecommendations(true);
    try {
      const data = await getRecomendationsMovieById(id);
      setRecommendations(data);
    } catch (error) {
      console.error(error);
      setRecommendations(null);
    } finally {
      setLoadingRecommendations(false);
    }
  }

  return (
    <div className={className}>
      <h2 className="text-xl font-bold">Recomendaciones</h2>
      {loadingRecommendations ? (
        <p>Obteniendo recomendaciones en {counter} segundos...</p>
      ) : recommendations ? (
        recommendations.length > 0 ? (
          <ul className="space-y-2">
            {recommendations.map((rec) => (
              <li key={rec.id} className="text-muted-foreground line-clamp-1 hover:underline">
                {rec.title}
              </li>
            ))}
          </ul>
        ) : (
          <p>No hay recomendaciones disponibles.</p>
        )
      ) : (
        <p>No se pudieron cargar las recomendaciones.</p>
      )}
    </div>
  );
}
