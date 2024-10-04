'use client'

import { useToast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";
import { Heart, Loader2, Popcorn } from "lucide-react";
import Image from "next/image";

import { CrewMember, ReviewInfo } from "@/lib/types";
import CircularImage from "@/components/movies/CircularImage";
import { DateFormat, getYear } from "@/lib/utils";
import noImage from '@/assets/no-image-film.jpg'
import Link from "next/link";

interface UserReviewProps {
  id: string
}

export default function UserReview({ id }: UserReviewProps) {
  const [review, setReview] = useState<ReviewInfo | null>(null);
  const { toast } = useToast()

  async function getReview() {
    const response = await fetch(`/api/movie/review/${id}`);
    if (!response.ok) toast({ variant: 'destructive', title: response.statusText })
    const data = await response.json();
    setReview(data);
  }

  useEffect(() => {
    getReview();
  }, [])

  if (!review) return null;

  const renderPopcorn = (index: number) => {
    if (!review.rating) {
      return undefined
    } else {
      if (review.rating >= index + 1) {
        return <Popcorn className="icon-thick h-4 w-4 md:h-5 md:w-5 cursor-pointer text-primary" />
      } else if (review.rating >= index + 0.5) {
        return (
          <div className="relative h-4 w-4 md:h-5 md:w-5">
            <div className="absolute inset-0 w-1/2 overflow-hidden">
              <Popcorn className="icon-thick h-4 w-4 md:h-5 md:w-5 text-primary" />
            </div>
            <div className="absolute inset-0 left-1/2 w-1/2 overflow-hidden">
              <Popcorn className="icon-thick h-4 w-4 md:h-5 md:w-5 text-transparent" />
            </div>
          </div>
        )
      } else {
        return undefined
      }
    }
  }

  return (
    <div className='p-2 md:p-5 bg-card rounded-2xl space-y-3 md:space-y-5'>
      <div className="flex justify-between items-center gap-2 md:gap-4 mb-2 md:mb-4 ">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 md:gap-4 mb-4">
            <CircularImage src={review.user?.avatarUrl || null} alt={`${review.user?.username} photo`} size={34} transform={false} />
            <span className="text-sm md:text-base italic font-medium">{review.user?.username}</span>
          </div>
          <div>
            <div className="flex gap-2 items-center">
              <span className="flex gap-2 items-center md:text-lg font-semibold">{review.movie.title} </span>
              <span className="text-sm md:text-base font-light text-foreground/40">{getYear(review.movie.releaseDate ? review.movie.releaseDate?.toString() : '')}</span>
              {review.liked && <Heart
                className='h-3 w-3 md:h-4 md:w-4 text-red-700 dark:text-red-800 fill-red-500 dark:fill-red-600'
              />}
            </div>
            <span className="flex gap-2 items-center text-sm md:text-base text-foreground/40 italic">{review.movie.directors.map((director: CrewMember) => director.name).join(", ")}</span>
            <div className="my-4 md:my-6 max-w-48 rounded flex justify-center items-center">
              <div className="flex gap-1">
                {[...Array(review.rating ? Math.floor(review.rating) + 1 : 7)].map((_, index) => (
                  <div key={index}>
                    {renderPopcorn(index)}
                  </div>
                ))}
              </div>
            </div>
            <span className="text-sm md:text-base text-foreground/40">Vista el {DateFormat(review.createdAt.toString())} {review.updatedAt && review.updatedAt !== review.createdAt && < span className="italic text-xs md:text-sm">(Actualizada el {DateFormat(review.updatedAt.toString())})</span>}</span>
          </div>
        </div>
        <div>
          <Link href={`/pelicula/${review.movieId}?title=${review.movie.title}&date=${getYear(review.movie.releaseDate ? review.movie.releaseDate?.toString() : '')}`}>
            <Image
              className="h-32 w-20 md:h-40 md:w-28 rounded cursor-pointer"
              src={review.movie.posterPath ? review.movie.posterPath : noImage}
              alt={`${review.movie.title} poster`}
              aria-label={review.movie.title}
              width={150}
              height={150}
            />
          </Link>
        </div>
      </div>
      <span className="text-sm md:text-base text-foreground/40">
        <p className="text-justify mx-2 md:mx-4 indent-2 md:indent-4">{review.review}</p>
      </span>
    </div >
  )
}
