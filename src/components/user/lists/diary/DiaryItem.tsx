import Image from "next/image"
import Link from "next/link"
import { Heart, Text, Popcorn, Cross, Trash, Trash2 } from "lucide-react"

import { DiaryInfo } from "@/lib/types"
import noImage from '@/assets/no-image-film.jpg'
import { getYear } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface DiaryItemProps {
  diary: DiaryInfo
}

export default function DiaryItem({ diary }: DiaryItemProps) {
  const renderPopcorn = (index: number) => {
    if (!diary.review.rating) {
      return undefined
    } else {
      if (diary.review.rating >= index + 1) {
        return <Popcorn className="icon-thick h-3 w-3 md:h-4 md:w-4 cursor-pointer text-primary" />
      } else if (diary.review.rating >= index + 0.5) {
        return (
          <div className="relative h-3 w-3 md:h-4 md:w-4">
            <div className="absolute inset-0 w-1/2 overflow-hidden">
              <Popcorn className="icon-thick h-3 w-3 md:h-4 md:w-4 text-primary" />
            </div>
            <div className="absolute inset-0 left-1/2 w-1/2 overflow-hidden">
              <Popcorn className="icon-thick h-3 w-3 md:h-4 md:w-4 text-transparent" />
            </div>
          </div>
        )
      } else {
        return undefined
      }
    }
  }

  return (
    <div className='relative p-2 md:p-4 bg-background rounded-2xl w-full transition duration-300 ease-in-out'>
      <button className='absolute top-5 right-5 p-2 hover:bg-card-child/40 rounded'><Trash2 className="text-destructive h-3 w-3 md:h-4 md:w-4" /></button>
      <Link href={`/pelicula/review/${diary.reviewId}?title=${diary.movie.title}&date=${getYear(diary.movie.releaseDate ? diary.movie.releaseDate.toString() : '')}&username=${diary.user.username}&movieId=${diary.movieId}`} className="flex gap-4 cursor-pointer">
        <Image
          src={diary.movie.posterPath || noImage}
          alt={diary.movie.title}
          width={64}
          height={96}
          className="w-16 h-24 object-cover rounded-lg"
        />
        <div className='flex flex-col gap-2'>
          <div className='flex items-center gap-2'>
            <h4 className="text-lg font-semibold">{diary.movie.title}</h4>
            <div className='flex p-1 rounded-2xl gap-2'>
              {diary.review.liked && <Heart
                className='h-3 w-3 md:h-4 md:w-4 text-red-500 dark:text-red-600 fill-red-500 dark:fill-red-600'
              />}
              {diary.review.reviewText && <Text
                className='h-3 w-3 md:h-4 md:w-4 text-foreground/70 fill-primary'
              />}
            </div>
          </div>
          <div className="flex gap-1">
            {[...Array(diary.review.rating ? Math.floor(diary.review.rating) + 1 : 7)].map((_, index) => (
              <div key={index}>
                {renderPopcorn(index)}
              </div>
            ))}
          </div>
        </div>
      </Link>
    </div>
  )
}
