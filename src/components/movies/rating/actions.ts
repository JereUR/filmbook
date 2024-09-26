"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { createReviewSchema } from "@/lib/validation";

export async function submitReview(input: {
  rating: number;
  movieId: string;
  review: string | undefined | null;
  previousRating: number | null;
}) {
  const { user } = await validateRequest();

  if (!user) throw new Error("No autorizado.");

  const { rating, movieId, review, previousRating } = createReviewSchema.parse(input);

  const movieRating = await prisma.movieRating.findUnique({
    where: { movieId },
  });

  let newAverageRating: number;
  let newNumberOfRatings: number;

  if (!movieRating) {
    newAverageRating = rating; 
    newNumberOfRatings = 1; 
  } else {
    newNumberOfRatings = movieRating.numberOfRatings;
    newAverageRating = previousRating
      ? ((movieRating.averageRating * newNumberOfRatings) - previousRating + rating) / newNumberOfRatings
      : ((movieRating.averageRating * newNumberOfRatings) + rating) / (newNumberOfRatings + 1);
    
    newNumberOfRatings += previousRating ? 0 : 1; 
  }

  const [newReview] = await prisma.$transaction([
    prisma.review.upsert({
      where: {
        userId_movieId: {
          userId: user.id,
          movieId: movieId,
        },
      },
      update: {
        rating,
        watched: true,
        review,
      },
      create: {
        rating,
        userId: user.id,
        movieId: movieId,
        watched: true,
        review,
      },
      include: {
        movie: true,
      },
    }),
    prisma.movieRating.upsert({
      where: { movieId },
      update: {
        averageRating: newAverageRating,
        numberOfRatings: newNumberOfRatings,
      },
      create: {
        movieId,
        averageRating: newAverageRating,
        numberOfRatings: newNumberOfRatings,
      },
    }),
  ]);

  return newReview;
}
