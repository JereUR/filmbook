'use client'

import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import Image from 'next/image'

import kyInstance from '@/lib/ky'
import { FavoriteMovie } from "@/lib/types"

interface FavoriteMoviesProps {
  initialData: FavoriteMovie[]
  username: string
}

export default function FavoriteMovies({ initialData, username }: FavoriteMoviesProps) {
  const { data: favoriteMovies, isLoading, isError, error } = useQuery({
    queryKey: ['favorite-movies', username],
    queryFn: () =>
      kyInstance.get(`/api/users/username/${username}/favorite-movies`).json<FavoriteMovie[]>(),
    initialData,
  })

  if (isLoading) return <p>Cargando películas favoritas...</p>
  if (isError) return <p>Error al cargar películas favoritas: {error instanceof Error ? error.message : 'Unknown error'}</p>
  if (favoriteMovies.length === 0) return null

  const sortedFavoriteMovies = [...favoriteMovies].sort((a, b) => {
    const posA = a.position ?? Infinity
    const posB = b.position ?? Infinity
    return posA - posB
  })

  return (
    <div className="bg-card rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl">
      <h2 className="text-xl md:text-2xl font-bold mb-4 text-primary/70">Mi Filmoteca</h2>
      <div className="grid grid-cols-4 gap-2 sm:gap-4">
        {sortedFavoriteMovies.map((movie) => (
          <Link
            key={movie.id}
            href={`/pelicula/${movie.movieId}?title=${encodeURIComponent(movie.movie.title)}&date=${movie.movie.releaseDate ? new Date(movie.movie.releaseDate).getFullYear() : ''
              }`}
            className="group block"
          >
            <div className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-md transition-all duration-300 group-hover:shadow-xl group-hover:scale-105">
              <Image
                src={movie.movie.posterPath || '/placeholder-movie-poster.jpg'}
                alt={movie.movie.title}
                layout="fill"
                objectFit="cover"
                className="transition-all duration-300 group-hover:brightness-110"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-1 sm:p-3 text-foreground/70 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <p className="text-xs sm:text-sm font-bold line-clamp-2">{movie.movie.title}</p>
                {movie.movie.releaseDate && (
                  <p className="text-xs mt-1 opacity-80 hidden sm:block">
                    {new Date(movie.movie.releaseDate).getFullYear()}
                  </p>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

