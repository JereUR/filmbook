import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { validateRequest } from "@/auth";
import { ReviewResumeInfo } from "@/lib/types";
import { getYear } from "@/lib/utils";

export async function GET(
  req: NextRequest,
  { params }: { params: { movieId: string; reviewId: string } },
) {
  const { user: loggedInUser } = await validateRequest();

  if (!loggedInUser) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const cursor = req.nextUrl.searchParams.get("cursor") || undefined;
  const pageSize = 80;

  const reviews = await prisma.review.findMany({
    where: {
      movieId: params.movieId,
      id: { not: params.reviewId },
    },
    select: {
      id: true,
      userId: true,
      movieId: true,
      rating: true,
      liked: true,
      review: true,
      updatedAt: true,
      createdAt: true,
      movie: {
        select: {
          title: true,
          releaseDate: true,
        },
      },
      user: {
        select: {
          username: true,
          avatarUrl: true,
        },
      },
    },
    take: pageSize + 1,
    cursor: cursor ? { id: cursor } : undefined,
    orderBy: { createdAt: "desc" },
  });

  const nextCursor = reviews.length > pageSize ? reviews[pageSize].id : null;

  const data: ReviewResumeInfo[] = reviews.slice(0, pageSize).map((review) => ({
    id: review.id,
    userId: review.userId,
    movieId: review.movieId,
    movie: {
      ...review.movie,
      releaseDate: getYear(
        review.movie.releaseDate ? review.movie.releaseDate?.toString() : "",
      ),
    },
    user: review.user,
    rating: review.rating,
    liked: review.liked,
    review: review.review,
    createdAt: review.createdAt,
  }));

  return NextResponse.json({ reviews: data, nextCursor });
}
