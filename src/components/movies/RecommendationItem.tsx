import Image from "next/image"
import Link from "next/link"

import { Recommendation } from "@/lib/types"
import noPoster from "@/assets/no-image-film.jpg"
import TmdbLogo from "@/assets/TMDB.png"
import { getYear, ratingColor } from "@/lib/utils"

interface RecommendationItemProps {
  recommendation: Recommendation
}

export default function RecommendationItem({
  recommendation,
}: RecommendationItemProps) {
  const { id, title, poster_path, release_date, vote_average } = recommendation

  return (
    <Link
      href={`/pelicula/${id}?title=${title}&date=${getYear(release_date)}`}
      className="m-1 flex cursor-pointer items-start gap-3 rounded-2xl border border-primary/40 bg-background p-2 transition-colors duration-300 ease-in-out hover:bg-background/40 md:p-4"
    >
      <div className="my-auto flex-none">
        <Image
          src={poster_path ? poster_path : noPoster}
          alt={`${title} poster`}
          width={50}
          height={75}
          className="rounded"
        />
      </div>

      <div className="flex flex-grow flex-col justify-center gap-1 md:gap-2">
        <h1 className="text-sm font-semibold">
          <span className="line-clamp-2 whitespace-pre-line">{title}</span> (
          {release_date ? getYear(release_date) : "N/A"})
        </h1>
        <div className="flex items-center gap-1 md:gap-2">
          <div className="flex gap-1 font-semibold italic md:text-lg">
            <span className={ratingColor(vote_average)}>
              {vote_average.toFixed(1)}
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
