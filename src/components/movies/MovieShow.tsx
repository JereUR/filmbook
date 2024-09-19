'use client'

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

import { getMovieById, getRecomendationsMovieById } from "@/lib/tmdb";
import { Movie, Recommendation } from "@/lib/types";
import { useToast } from "../ui/use-toast";
import MovieDetails from "./MovieDetails";

interface MovieShowProps{
  id:string
}

export default function MovieShow({id}:MovieShowProps) {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loadingMovie, setLoadingMovie] = useState<boolean>(true)
  const [recommendations, setRecommendations] = useState<Recommendation[] | null>(null);
  const [loadingRecommendations, setLoadingRecommendations] = useState<boolean>(true);
  const [counter, setCounter] = useState<number>(10);

  const { toast } = useToast();

  useEffect(() => {
    async function getMovie() {
      setLoadingMovie(true)
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
        }finally{
          setLoadingMovie(false);
        }
      }
    }

    getMovie();
  }, [id, toast]);

  useEffect(() => {
    let countdownInterval: NodeJS.Timeout;

    if (movie) {
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

  if (loadingMovie) {
    return <Loader2 className="mx-auto my-3 animate-spin" />;
  }

  return (
    <div className="pb-1 md:p-5 space-y-3 bg-card rounded-2xl shadow-sm">
      {movie  ? (
          <MovieDetails movie={movie}/>
      ) : (
        <div>
          <p>Pelicula no encontrada.</p>
        </div>
      )}
    </div>
  );
}


