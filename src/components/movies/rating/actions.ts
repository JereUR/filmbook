"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { createRatingSchema } from "@/lib/validation";

export async function submitRating(input: {
  rating: number;
  movieId: string;
}) {
  const { user } = await validateRequest();

  if (!user) throw new Error("No autorizado.");

  const { rating, movieId } = createRatingSchema.parse(input);

  console.log({rating})

  const newRating = await prisma.review.upsert({
    where: {
      userId_movieId: {
        userId: user.id,
        movieId: movieId,
      },
    },
    update: {
      rating,
    },
    create: {
      rating,
      userId: user.id,
      movieId: movieId,
    },
    include: {
      movie: true, 
    },
  });

  return newRating;
}
