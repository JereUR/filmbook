import Image from "next/image"
import Link from "next/link"

import type { SearchMovie } from "@/lib/types"
import { getYear } from "@/lib/utils"
import noImage from "@/assets/no-image-film.jpg"
import { Dispatch } from "react"

interface MovieItemProps {
  movie: SearchMovie
  selectedMovieId: string
  setSelectedMovieId: Dispatch<React.SetStateAction<string>>
}

export default function MovieItemForDate({ movie, selectedMovieId, setSelectedMovieId }: MovieItemProps) {
  const { id, poster_path, title, release_date, genre_names } = movie

  return (
    <div className={`flex h-full cursor-pointer items-start space-x-4 overflow-hidden rounded-2xl border p-2 md:p-5 shadow-lg hover:bg-card/70 transition-colors duration-300 ease-in-out ${id === selectedMovieId && 'border-2 border-green-500 dark:border-green-600'}`} onClick={() => setSelectedMovieId(id)}>
      <div className="relative h-20 w-14 flex-shrink-0">
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
        />
      </div>
      <div>
        <h2 className="text-sm md:text-base font-semibold">
          {title} ({getYear(release_date)})
        </h2>
        <p className="text-xs md:tex-sm text-gray-500">{genre_names.join(", ")}</p>
      </div>
    </div>
  )
}
