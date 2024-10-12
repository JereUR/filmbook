import Image from "next/image";
import Link from "next/link";

import { WatchlistData } from "@/lib/types";
import { getYear } from "@/lib/utils";
import noImage from "@/assets/no-image-film.jpg";

interface WatchlistItemProps {
  item: WatchlistData
}

export default function WatchlistItem({ item }: WatchlistItemProps) {
  const { title, releaseDate, posterPath, genres } = item.movie

  return (
    <Link href={`/pelicula/${item.movieId}?title=${title}&date=${getYear(releaseDate ? releaseDate.toString() : '')}`}>
      <div className="flex h-full cursor-pointer items-start space-x-4 overflow-hidden rounded-2xl border p-5 shadow-lg hover:bg-card/70 transition-colors duration-300 ease-in-out">
        <div className="relative h-40 w-28 flex-shrink-0">
          <Image
            src={
              posterPath
                ? posterPath
                : noImage
            }
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="rounded"
          />
        </div>
        <div className="p-4">
          <h2 className="mb-2 text-xl font-semibold">
            {title} ({getYear(releaseDate ? releaseDate.toString() : '')})
          </h2>
          <p className="text-gray-500">Géneros: {genres.map((genre: { id: number, name: string }) => genre.name).join(", ")}</p>
        </div>
      </div>
    </Link>
  )
}