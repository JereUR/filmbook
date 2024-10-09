import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { validateRequest } from "@/auth";
import { ReviewInfo } from "@/lib/types";

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } },
) {
  const { user: loggedInUser } = await validateRequest();

  if (!loggedInUser) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const cursor = req.nextUrl.searchParams.get("cursor") || undefined;
  const pageSize = 20;

  const reviews = await prisma.review.findMany({
    where: {
      userId: params.userId,
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
          releaseDate: true,
        },
      },
      user: {
        select: {
          username: true,
          displayName: true,
        },
      },
    },
    take: pageSize + 1,
    cursor: cursor ? { id: cursor } : undefined,
    orderBy: { createdAt: "desc" },
  });

  const nextCursor = reviews.length > pageSize ? reviews[pageSize].id : null;

  const data: ReviewInfo[] = reviews.slice(0, pageSize).map((review) => ({
    id: review.id,
    movieId: review.movieId,
    movie: review.movie,
    user: review.user,
    userId: params.userId,
    liked: review.liked,
    watched: review.watched,
    rating: review.rating,
    review: review.review,
    createdAt: review.createdAt,
    updatedAt: review.updatedAt,
  }));

  return NextResponse.json({ reviews: data, nextCursor });
}
