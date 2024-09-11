'use client'
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { fetchMovieRecommendations, getMovieById, getRecomendationsMovieById } from "@/lib/tmdb";
import { Movie, Recommendation } from "@/lib/types";
import { useToast } from "../ui/use-toast";

export default function FilmShow() {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[] | null>(null);
  const [loadingRecommendations, setLoadingRecommendations] = useState<boolean>(true);
  const [counter, setCounter] = useState<number>(10);

  const pathname = usePathname();
  const id = pathname.split('/')[2];
  const { toast } = useToast();

  console.log(recommendations)

  useEffect(() => {
    async function getMovie() {
      if (id) {
        try {
          const data = await getMovieById(id);
          setMovie(data);
        } catch (error) {
          console.error(error);
          setMovie(null);
          toast({
            variant: "destructive",
            description: "Error al obtener los datos de la película. Por favor vuelve a intentarlo.",
          });
        }
      }
    }

    getMovie();
  }, [id, toast]);

  useEffect(() => {
    let countdownInterval: NodeJS.Timeout;

    if (movie) {
      // Iniciar el conteo regresivo
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

  }, [movie, id, toast]);

  async function fetchRecommendations() {
    if (id) {
      setLoadingRecommendations(true);
      try {
        const data = await getRecomendationsMovieById(id);
        setRecommendations(data);
      } catch (error) {
        console.error(error);
        setRecommendations(null);
        toast({
          variant: "destructive",
          description: "Error al obtener las recomendaciones. Por favor vuelve a intentarlo.",
        });
      } finally {
        setLoadingRecommendations(false);
      }
    }
  }

  return (
    <div>
      {movie ? (
        <div>
          <h1>{movie.title}</h1>
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.posterPath}`}
            alt={movie.title}
          />
          <p>Sinopsis: {movie.overview}</p>
          <p>Duración: {movie.runtime} minutos</p>
          <p>Puntaje: {movie.voteAverage}</p>

          <div className="mt-8">
            <h2>Recomendaciones</h2>
            {loadingRecommendations ? (
              <p>Obteniendo recomendaciones en {counter} segundos...</p>
            ) : recommendations ? (
              recommendations.length > 0 ? (
                <ul>
                  {recommendations.map((rec) => (
                    <li key={rec.id}>{rec.title}</li>
                  ))}
                </ul>
              ) : (
                <p>No hay recomendaciones disponibles.</p>
              )
            ) : (
              <p>No se pudieron cargar las recomendaciones.</p>
            )}
          </div>
        </div>
      ) : (
        <>Nada</>
      )}
    </div>
  );
}
