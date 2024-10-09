"use client";

import { useToast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";
import { Heart, Loader2, Popcorn } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { CrewMember, ReviewInfo } from "@/lib/types";
import CircularImage from "@/components/movies/CircularImage";
import { DateFormat, getYear } from "@/lib/utils";
import noImage from "@/assets/no-image-film.jpg";
import LikeReviewButton from "@/components/movies/LikeReviewButton";
import ReviewMoreButton from "@/components/movies/review/ReviewMoreButton";

interface UserReviewProps {
  reviewId: string;
}

export default function UserReview({ reviewId }: UserReviewProps) {
  const [review, setReview] = useState<ReviewInfo | null>(null);
  const { toast } = useToast();

  async function getReview() {
    const response = await fetch(`/api/movie/review/${reviewId}`);
    if (!response.ok)
      toast({ variant: "destructive", title: response.statusText });
    const data = await response.json();
    setReview(data);
  }

  useEffect(() => {
    getReview();
  }, []);

  if (!review) {
    return (
      <div className="space-y-3 rounded-2xl bg-card p-2 md:space-y-5 md:p-5">
        <Loader2 className="mx-auto animate-spin" />
      </div>
    );
  }

  const renderPopcorn = (index: number) => {
    if (!review.rating) {
      return undefined;
    } else {
      if (review.rating >= index + 1) {
        return (
          <Popcorn className="icon-thick h-5 w-5 cursor-pointer text-primary md:h-6 md:w-6" />
        );
      } else if (review.rating >= index + 0.5) {
        return (
          <div className="relative h-5 w-5 md:h-6 md:w-6">
            <div className="absolute inset-0 w-1/2 overflow-hidden">
              <Popcorn className="icon-thick h-5 w-5 text-primary md:h-6 md:w-6" />
            </div>
            <div className="absolute inset-0 left-1/2 w-1/2 overflow-hidden">
              <Popcorn className="icon-thick h-5 w-5 text-transparent md:h-6 md:w-6" />
            </div>
          </div>
        );
      } else {
        return undefined;
      }
    }
  };

  return (
    <div className="space-y-3 rounded-2xl bg-card p-2 md:space-y-5 md:p-5">
      <div className="mb-2 flex items-center justify-between gap-2 md:mb-4 md:gap-4">
        <div className="flex flex-col">
          {review.user && (
            <Link
              className="mb-4 flex items-center gap-2 md:gap-4"
              href={`/usuarios/${review.user.username}`}
            >
              <CircularImage
                src={review.user?.avatarUrl || null}
                alt={`${review.user?.username} photo`}
                size={34}
                transform={false}
              />
              <span className="text-sm font-medium italic md:text-base">
                {review.user?.username}
              </span>
            </Link>
          )}
          <div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-2 font-semibold md:text-lg">
                {review.movie.title}{" "}
              </span>
              <span className="text-sm font-light text-foreground/40 md:text-base">
                {getYear(
                  review.movie.releaseDate
                    ? review.movie.releaseDate?.toString()
                    : "",
                )}
              </span>
              {review.liked && (
                <Heart className="h-3 w-3 fill-red-500 text-red-700 dark:fill-red-600 dark:text-red-800 md:h-4 md:w-4" />
              )}
            </div>
            <span className="flex items-center gap-2 text-sm italic text-foreground/40 md:text-base">
              {review.movie.directors
                .map((director: CrewMember) => director.name)
                .join(", ")}
            </span>
            <div className="my-4 flex max-w-48 items-center justify-center rounded md:my-6">
              <div className="flex gap-1">
                {[
                  ...Array(review.rating ? Math.floor(review.rating) + 1 : 7),
                ].map((_, index) => (
                  <div key={index}>{renderPopcorn(index)}</div>
                ))}
              </div>
            </div>
            <span className="text-sm font-light text-foreground/40 md:text-base">
              Vista el {DateFormat(review.createdAt.toString())}{" "}
              {review.updatedAt && review.updatedAt !== review.createdAt && (
                <span className="text-xs italic md:text-sm">
                  (Actualizada el {DateFormat(review.updatedAt.toString())})
                </span>
              )}
            </span>
          </div>
        </div>
        <div className="mr-5 flex flex-col items-end">
          <ReviewMoreButton
            review={review}
          />
          <Link
            href={`/pelicula/${review.movieId}?title=${review.movie.title}&date=${getYear(review.movie.releaseDate ? review.movie.releaseDate?.toString() : "")}`}
          >
            <Image
              className="h-32 w-20 cursor-pointer rounded md:h-40 md:w-28"
              src={review.movie.posterPath ? review.movie.posterPath : noImage}
              alt={`${review.movie.title} poster`}
              aria-label={review.movie.title}
              width={150}
              height={150}
            />
          </Link>
        </div>
      </div>
      <span className="text-sm font-semibold text-foreground/40 md:text-base">
        <p className="mx-2 text-justify indent-2 md:mx-4 md:indent-4">
          {review.review}
        </p>
      </span>
      <LikeReviewButton
        reviewId={review.id}
        initialState={review.likesData || { likes: 0, isLikedByUser: false }}
      />
    </div>
  );
}
