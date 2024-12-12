import { getPopularMovies } from "@/lib/tmdb"
import Image from "next/image"
import Link from "next/link"

import noImagePath from '@/assets/no-image-film.jpg'
import TmdbLogo from '@/assets/TMDB.png'
import { getYear, ratingColor } from "@/lib/utils"

interface PopularMoviesProps {
  className: string
}

export default async function PopularMovies({ className }: PopularMoviesProps) {
  const movies = await getPopularMovies()

  if (!movies) {
    return <div className={className}>No se pudieron cargar las películas populares</div>
  }

  return (
    <div className={className}>
      <h2 className="text-lg font-bold mb-4">Películas populares</h2>
      <ul className="space-y-2">
        {movies.map((movie) => (
          <li key={movie.id}>
            <Link href={`/pelicula/${movie.id}?title=${movie.title}&date=${movie.releaseDate ? getYear(movie.releaseDate.toString()) : 'N/A'}`} className="m-1 flex cursor-pointer items-start gap-3 rounded-2xl border border-primary/40 bg-background p-2 transition-colors duration-300 ease-in-out hover:bg-background/40 md:p-4">
              <div className="my-auto flex-none">
                <Image
                  src={movie.posterPath ? movie.posterPath : noImagePath}
                  alt={`${movie.title} poster`}
                  width={50}
                  height={75}
                  className="rounded"
                  unoptimized
                />
              </div>
              <div className="flex flex-grow flex-col justify-center gap-1 md:gap-2">
                <h1 className="text-sm font-semibold">
                  <span className="line-clamp-2 whitespace-pre-line">{movie.title}</span> (
                  {movie.releaseDate ? getYear(movie.releaseDate.toString()) : "N/A"})
                </h1>
                <div className="flex items-center gap-1 md:gap-2">
                  <div className="flex gap-1 font-semibold italic md:text-lg">
                    <span className={ratingColor(movie.voteAverage || 0)}>
                      {movie.voteAverage ? movie.voteAverage.toFixed(1) : 'S/P'}
                    </span>
                    <span className="text-muted-foreground/70">/10</span>
                  </div>
                  <Image
                    src={TmdbLogo}
                    width={25}
                    height={25}
                    alt="TMDB logo"
                    className="rounded"
                  />
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

