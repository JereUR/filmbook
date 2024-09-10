import Image from "next/image";
import Link from "next/link";

import type { SearchMovie } from "@/lib/types";
import { getYear } from "@/lib/utils";
import noImage from "@/assets/no-image-film.jpg";

interface MovieItemProps {
  movie: SearchMovie;
}

export default function MovieItem({ movie }: MovieItemProps) {
  const { id, poster_path, title, release_date, genre_names } = movie;

  return (
    <Link href={`/film/${id}?title=${title}&date=${getYear(release_date)}`}>
      <div className="flex h-full cursor-pointer items-start space-x-4 overflow-hidden rounded-2xl border p-5 shadow-lg">
      <div className="relative flex-shrink-0 h-48 w-32">
          <Image
            src={
              poster_path
                ? `https://image.tmdb.org/t/p/w500${poster_path}`
                : noImage
            }
            alt={title}
            layout="fill"
            objectFit="cover"
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
    </Link>
  );
}
