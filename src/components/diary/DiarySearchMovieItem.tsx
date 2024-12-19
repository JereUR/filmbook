import Image from "next/image"
import { Dispatch, SetStateAction } from "react"

import type { SearchMovie } from "@/lib/types"
import { getYear } from "@/lib/utils"
import noImage from "@/assets/no-image-film.jpg"

interface DiarySearchMovieItemProps {
  movie: SearchMovie
  setMovieToAdd: Dispatch<SetStateAction<SearchMovie | null>>
  changeState: () => void
}

export default function DiarySearchMovieItem({ movie, setMovieToAdd, changeState }: DiarySearchMovieItemProps) {
  const { poster_path, title, release_date, genre_names } = movie

  function handleClick() {
    setMovieToAdd(movie)
    changeState()
  }

  return (
    <div className="flex h-full cursor-pointer items-start overflow-hidden rounded-2xl border p-2 shadow-lg hover:bg-card/70 transition-colors duration-300 ease-in-out" onClick={handleClick}>
      <div className="relative h-20 w-16">
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
      <div className="flex flex-col gap-1 px-4">
        <h2 className="text-base md:text-lg font-semibold">
          {title} ({getYear(release_date)})
        </h2>
        <p className="text-xs md:text-sm text-muted-foreground/40">{genre_names.join(", ")}</p>
      </div>
    </div>
  )
}
