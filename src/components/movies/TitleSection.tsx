import Image from "next/image"
import { Eye, Heart, MessageSquareHeart } from "lucide-react"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import Link from "next/link"
import { User } from "lucia"

import { CrewMember, ImageInfo, ReviewData } from "@/lib/types"
import { getYear } from "@/lib/utils"
import noImagePath from "@/assets/no-image-film.jpg"
import CrewMemberShow from "./CrewMemberShow"

interface TitleSectionProps {
  user: User | null
  movieId: string
  reviewId: string | undefined
  username: string
  posterPath: string | undefined
  title: string
  releaseDate: Date | undefined
  runtime: number
  genres: any[]
  directors: CrewMember[]
  watched: boolean
  liked: boolean
  handleImageClick: (image: ImageInfo) => void
  ratingWasChanged: boolean
  setRatingWasChanged: Dispatch<SetStateAction<boolean>>
}

export default function TitleSection({
  user,
  movieId,
  reviewId,
  username,
  posterPath,
  title,
  releaseDate,
  runtime,
  genres,
  directors,
  watched,
  liked,
  handleImageClick,
  ratingWasChanged,
  setRatingWasChanged
}: TitleSectionProps) {
  const [appReview, setAppReview] = useState<ReviewData | null>(null)

  const image: ImageInfo = {
    src: posterPath ? posterPath : noImagePath,
    name: title,
  }
  const year = releaseDate ? getYear(releaseDate.toString()) : null

  async function fetchNewReview() {
    const response = await fetch(`/api/movie/review/movie/${movieId}`)
    const data = await response.json()

    if (data) {
      setAppReview(data)
    }

  }

  useEffect(() => {
    fetchNewReview().then(() => setRatingWasChanged(false))
  }, [ratingWasChanged])

  return (
    <div className="flex items-start gap-4 md:gap-8">
      <div>
        <div className="relative h-24 w-16 flex-shrink-0 md:h-40 md:w-28">
          <Image
            src={posterPath ? posterPath : noImagePath}
            alt={title}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className="cursor-pointer rounded"
            onClick={() => handleImageClick(image)}
            unoptimized
          />
          {user && <div className="absolute inset-0 flex items-end justify-center mb-1">
            <div className="bg-black/70 p-1 rounded flex space-x-2">
              {appReview ? <Eye
                className={`h-5 w-5 text-foreground/70 ${appReview.watched ? "fill-primary" : "fill-white/50"
                  }`}
              /> : <Eye
                className={`h-5 w-5 text-foreground/70 ${watched ? "fill-primary" : "fill-white/50"
                  }`}
              />}
              {appReview ? <Heart
                className={`h-5 w-5 text-foreground/70 ${appReview.liked ? "fill-red-500 dark:fill-red-600" : "fill-white/50"
                  }`}
              /> : <Heart
                className={`h-5 w-5 text-foreground/70 ${liked ? "fill-red-500 dark:fill-red-600" : "fill-white/50"
                  }`}
              />}
            </div>
          </div>}
        </div>
        {appReview ? (
          <Link
            href={`/pelicula/review/${appReview.id}?title=${title}&date=${getYear(releaseDate ? releaseDate.toString() : '')}&username=${username}&movieId=${movieId}`}
          >
            <div className="flex items-center justify-center gap-1 text-xs p-2 mt-2 font-semibold hover:bg-primary cursor-pointer bg-card-child rounded-2xl">
              <MessageSquareHeart className='h-[14px] w-[14px]' />
              <span>Ir a mi review</span>
            </div>
          </Link>
        ) : (
          reviewId && (
            <Link
              href={`/pelicula/review/${reviewId}?title=${title}&date=${getYear(releaseDate ? releaseDate.toString() : '')}&username=${username}&movieId=${movieId}`}
            >
              <div className="flex items-center justify-center gap-1 text-xs p-2 mt-2 font-semibold hover:bg-primary cursor-pointer bg-card-child rounded-2xl">
                <MessageSquareHeart className='h-[14px] w-[14px]' />
                <span>Ir a mi review</span>
              </div>
            </Link>
          )
        )}
      </div>
      <div className="flex flex-col space-y-3">
        <h1 className="text-2xl font-bold md:text-3xl lg:text-4xl">
          {title} {year ? `(${year})` : ""}
        </h1>
        {directors.map((director: CrewMember) => (
          <CrewMemberShow
            key={director.id}
            member={director}
            handleImageClick={handleImageClick}
          />
        ))}
        <p className="text-sm font-light italic text-foreground/40 md:text-base">
          {runtime} mins - {genres.map((genre: any) => genre.name).join(", ")}
        </p>
      </div>
    </div>
  )
}
