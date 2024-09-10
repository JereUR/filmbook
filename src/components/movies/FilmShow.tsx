'use client'

import { getMovieById } from "@/lib/tmdb";
import { Movie } from "@/lib/types";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";


export default function FilmShow() {
  const [movie, setMovie] = useState<Movie|null>(null)
  const pathname = usePathname()
  const id=pathname.split('/')[2]

  async function getMovie(){
    if(id){
      try {
      const data=await getMovieById(id)
      setMovie(data)
      } catch (error) {
        console.error(error)
        setMovie(null)
      }
    }
  }

  useEffect(() => {
    getMovie()
  }, [id])

  return (
    <div>
      {movie?<div>
        <h1>{movie.title}</h1>
        <img src={`https://image.tmdb.org/t/p/w500${movie.posterPath}`} alt={movie.title} />
        <p>Sinopsis: {movie.overview}</p>
        <p>Duración: {movie.runtime} minutos</p>
        <p>Puntaje: {movie.voteAverage}</p>
      </div>:<>Nada</>}
    </div>
  );
}
