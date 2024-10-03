import Image from 'next/image'
import { Heart, Popcorn, Text } from 'lucide-react'
import Link from 'next/link'

import { getYear } from "@/lib/utils";
import { ReviewInfo } from '@/lib/types'
import noImage from '@/assets/no-image-film.jpg'

interface ReviewItemProps {
  review: ReviewInfo
}

export default function ReviewItem({ review }: ReviewItemProps) {
  const { posterPath, title, releaseDate } = review.movie
  const { id, rating, review: reviewText, liked, movieId } = review

  const renderPopcorn = (index: number) => {
    if (!rating) {
      return undefined
    } else {
      if (rating >= index + 1) {
        return <Popcorn className="icon-thick h-2 w-2 md:h-3 md:w-3 cursor-pointer text-primary" />
      } else if (rating >= index + 0.5) {
        return (
          <div className="relative h-2 w-2 md:h-3 md:w-3">
            <div className="absolute inset-0 w-1/2 overflow-hidden">
              <Popcorn className="icon-thick h-2 w-2 md:h-3 md:w-3 text-primary" />
            </div>
            <div className="absolute inset-0 left-1/2 w-1/2 overflow-hidden">
              <Popcorn className="icon-thick h-2 w-2 md:h-3 md:w-3 text-transparent" />
            </div>
          </div>
        )
      } else {
        return undefined
      }
    }
  }

  return (
    <div className="space-y-1 flex flex-col justify-center items-center cursor-pointer">
      <Link href={`/pelicula/review/${id}?title=${title}&date=${getYear(releaseDate?releaseDate.toString():'')}&username=${review.user.username}&movieId=${movieId}`} className="relative flex-shrink-0">
        <Image
          className="h-32 w-20 md:h-40 md:w-28 rounded"
          src={posterPath ? posterPath : noImage}
          alt={`${title} poster`}
          aria-label={title}
          width={150}
          height={150}
        />
        <div className="absolute inset-0 flex items-end justify-center mb-1">
          <div className="bg-black/70 p-1 rounded flex space-x-2">
            <Heart
              className={`h-3 w-3 md:h-4 md:w-4 text-foreground/70 ${liked ? "fill-red-500 dark:fill-red-600" : "fill-white/50"}`}
            />
            {reviewText && <Text
              className='h-3 w-3 md:h-4 md:w-4 text-foreground/70 fill-primary'
            />}
          </div>
        </div>
      </Link>
      <div className="h-5 w-20 md:w-28 rounded flex justify-center items-center">
        <div className="flex gap-1">
          {[...Array(rating ? Math.floor(rating) + 1 : 7)].map((_, index) => (
            <div key={index}>
              {renderPopcorn(index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
