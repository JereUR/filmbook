import Image from "next/image";
import { Dispatch, SetStateAction} from "react"

import type { SearchMovie } from "@/lib/types";
import { getYear } from "@/lib/utils";
import noImage from "@/assets/no-image-film.jpg";

interface DiarySearchMovieItemProps {
  movie: SearchMovie;
  setMovieToAdd: Dispatch<SetStateAction<SearchMovie | null>>
  changeState: () => void
}

export default function DiarySearchMovieItem({ movie, setMovieToAdd, changeState }: DiarySearchMovieItemProps) {
  const { poster_path, title, release_date, genre_names } = movie;

  function handleClick() {
    setMovieToAdd(movie)
    changeState()
  }

  return (
    <div className="flex h-full cursor-pointer items-start space-x-4 overflow-hidden rounded-2xl border p-5 shadow-lg hover:bg-card/70 transition-colors duration-300 ease-in-out" onClick={handleClick}>
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
        />
      </div>
      <div className="p-4">
        <h2 className="mb-2 text-xl font-semibold">
          {title} ({getYear(release_date)})
        </h2>
        <p className="text-gray-500">Géneros: {genre_names.join(", ")}</p>
      </div>
    </div>
  );
}