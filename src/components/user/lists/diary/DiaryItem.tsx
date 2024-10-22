import Image from "next/image";
import Link from "next/link"

import { DiaryInfo } from "@/lib/types";
import noImage from '@/assets/no-image-film.jpg';
import { getYear } from "@/lib/utils";

interface DiaryItemProps {
  diary: DiaryInfo;
}

export default function DiaryItem({ diary }: DiaryItemProps) {
  return (
    <div className='relative p-2 md:p-4 first:border-t last:border-b border-foreground/40 w-full'>
      <Link href={`/pelicula/review/${diary.reviewId}?title=${diary.movie.title}&date=${getYear(diary.movie.releaseDate ? diary.movie.releaseDate.toString() : '')}&username=${diary.user.username}&movieId=${diary.movieId}`} className="flex items-center gap-4">
        <Image
          src={diary.movie.posterPath || noImage}
          alt={diary.movie.title}
          width={64}
          height={96}
          className="w-16 h-24 object-cover rounded-lg"
        />
        <div>
          <h4 className="text-lg font-semibold">{diary.movie.title}</h4>
          {diary.review?.rating && (
            <p>Rating: {diary.review.rating}/10</p>
          )}
          <p>Visto el: {new Date(diary.watchedOn).toLocaleDateString("es-ES")}</p>
        </div>
      </Link>
    </div>
  );
}
