"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { createReviewSchema } from "@/lib/validation";

export async function submitReview(input: {
  rating: number;
  movieId: string;
  review: string | undefined | null;
  diary?: boolean | null;
}) {
  const { user } = await validateRequest();
  if (!user) throw new Error("No autorizado.");

  const { rating, movieId, review } = createReviewSchema.parse(input);

  const existingReview = await prisma.review.findUnique({
    where: {
      userId_movieId: {
        userId: user.id,
        movieId,
      },
    },
  });

  const previousRating = existingReview ? existingReview.rating : null;

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
      ? (movieRating.averageRating * newNumberOfRatings -
          previousRating +
          rating) /
        newNumberOfRatings
      : (movieRating.averageRating * newNumberOfRatings + rating) /
        (newNumberOfRatings + 1);

    newNumberOfRatings += previousRating ? 0 : 1;
  }

  const followers = await prisma.follow.findMany({
    where: { followingId: user.id },
    select: { followerId: true },
  });

  const [newReview, updatedMovieRating] = await prisma.$transaction([
    prisma.review.upsert({
      where: {
        userId_movieId: {
          userId: user.id,
          movieId,
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
        movieId,
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

  if (input.diary) {
    await prisma.diary.create({
      data: {
        userId: user.id,
        movieId,
        reviewId: newReview.id,
        watchedOn: new Date(),
      },
    });
  }

  const notifications = followers.map((follower) =>
    prisma.notification.create({
      data: {
        issuerId: user.id,
        recipientId: follower.followerId,
        reviewId: newReview.id,
        type: "REVIEW",
      },
    }),
  );

  await prisma.$transaction(notifications);

  return newReview;
}
