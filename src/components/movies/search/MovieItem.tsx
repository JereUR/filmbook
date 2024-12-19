import Image from "next/image"
import Link from "next/link"

import type { SearchMovie } from "@/lib/types"
import { getYear } from "@/lib/utils"
import noImage from "@/assets/no-image-film.jpg"

interface MovieItemProps {
  movie: SearchMovie
}

export default function MovieItem({ movie }: MovieItemProps) {
  const { id, poster_path, title, release_date, genre_names } = movie

  return (
    <Link href={`/pelicula/${id}?title=${title}&date=${getYear(release_date)}`}>
      <div className="flex h-full cursor-pointer items-start space-x-4 overflow-hidden rounded-2xl border p-5 shadow-lg hover:bg-card/70 transition-colors duration-300 ease-in-out">
        <div className="relative h-40 w-28 flex-shrink-0">
          <Image
            src={
              poster_path
                ? poster_path
                : noImage
            }
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="rounded"
            unoptimized
          />
        </div>
        <div className="p-4">
          <h2 className="mb-2 text-xl font-semibold">
            {title} ({getYear(release_date)})
          </h2>
          <p className="text-muted-foreground/40">{genre_names.join(", ")}</p>
        </div>
      </div>
    </Link>
  )
}
