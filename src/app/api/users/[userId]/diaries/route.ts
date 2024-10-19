import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/prisma";
import { validateRequest } from "@/auth";
import { DiaryInfo } from "@/lib/types";

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

  const diaries = await prisma.diary.findMany({
    where: {
      userId: params.userId,
    },
    select: {
      id: true,
      movieId: true,
      userId: true,
      reviewId: true,
      movie: {
        select: {
          id: true,
          posterPath: true,
          title: true,
          releaseDate: true,
        },
      },
      review: {
        select: {
          liked: true,
          rating: true,
          review: true,
        },
      },
      watchedOn: true,
    },
    take: pageSize + 1,
    cursor: cursor ? { id: cursor } : undefined,
    orderBy: { createdAt: "desc" },
  });

  const nextCursor = diaries.length > pageSize ? diaries[pageSize].id : null;

  const data: DiaryInfo[] = diaries.slice(0, pageSize).map((review) => ({
    id: review.id,
    userId: params.userId,
    movieId: review.movieId,
    movie: review.movie,
    reviewId: review.reviewId,
    review: {
      liked: review.review?.liked ?? false,
      reviewText: review.review?.review ?? null,
      rating: review.review?.rating ?? null,
    },
    watchedOn: review.watchedOn,
  }));

  return NextResponse.json({ diaries: data, nextCursor });
}
