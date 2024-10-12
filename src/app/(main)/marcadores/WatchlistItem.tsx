import Image from "next/image";
import Link from "next/link";

import { WatchlistData } from "@/lib/types";
import { getYear, ratingColor } from "@/lib/utils";
import noImage from "@/assets/no-image-film.jpg";
import TmdbLogo from "@/assets/TMDB.png";

interface WatchlistItemProps {
  item: WatchlistData
}

export default function WatchlistItem({ item }: WatchlistItemProps) {
  const { title, releaseDate, posterPath, genres, voteAverage } = item.movie

  console.log({ item })

  return (
    <Link href={`/pelicula/${item.movieId}?title=${title}&date=${getYear(releaseDate ? releaseDate.toString() : '')}`}
      className="m-1 flex cursor-pointer items-start gap-3 rounded-2xl border border-primary/40 bg-background p-2 transition-colors duration-300 ease-in-out hover:bg-background/40 md:p-4"
    >
      <div className="my-auto flex-none">
        <Image
          src={posterPath ? posterPath : noImage}
          alt={`${title} poster`}
          width={70}
          height={90}
          className="rounded"
        />
      </div>

      <div className="flex flex-grow flex-col justify-center gap-1 md:gap-2">
        <h1 className="text-sm font-semibold">
          <span className="line-clamp-2 whitespace-pre-line">{title}</span> (
          {releaseDate ? getYear(releaseDate.toString()) : "N/A"})
        </h1>
        <div className="flex items-center gap-1 md:gap-2">
          <div className="flex gap-1 font-semibold italic md:text-lg">
            <span className={voteAverage ? ratingColor(voteAverage) : ''}>
              {voteAverage ? voteAverage.toFixed(1) : "N/A"}
            </span>
            <span className="text-gray-400">/10</span>
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
  )
}