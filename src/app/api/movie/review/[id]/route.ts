import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { validateRequest } from "@/auth";
import { ReviewInfo } from "@/lib/types";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const { user: loggedInUser } = await validateRequest();

  if (!loggedInUser) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const reviewData = await prisma.review.findUnique({
    where: {
      id: params.id,
    },
    select: {
      id: true,
      movieId: true,
      liked: true,
      watched: true,
      rating: true,
      review: true,
      updatedAt: true,
      createdAt: true,
      movie: {
        select: {
          posterPath: true,
          title: true,
          releaseDate: true
        },
      },
      user:{
        select:{
          username: true,
          avatarUrl: true
        }
      }
    },
  });

  if (!reviewData) {
    return NextResponse.json(null);
  }

  const review: ReviewInfo ={
    id: reviewData.id,
    movieId: reviewData.movieId,
    movie: reviewData.movie,
    user: reviewData.user,
    liked: reviewData.liked,
    watched: reviewData.watched,
    rating: reviewData.rating,
    review: reviewData.review,
    createdAt: reviewData.createdAt,
    updatedAt: reviewData.updatedAt,
  };

  return NextResponse.json(review);
}
