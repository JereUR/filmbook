import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { validateRequest } from "@/auth";
import { ReviewData } from "@/lib/types";

export async function GET(
  req: Request,
  { params }: { params: { movieId: string } },
) {
  const { user: loggedInUser } = await validateRequest();

  if (!loggedInUser) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const review = await prisma.review.findFirst({
    where: {
      userId: loggedInUser.id,
      movieId: params.movieId,
    },
    select: {
      liked: true,
      watched:true,
      rating:true,
      review:true
    },
  });

  if (!review) {
    return NextResponse.json(null);
  }

  const data: ReviewData = {
    liked:review.liked,
    watched:review.watched,
    rating: review.rating,
    review: review.review,
  };

  return NextResponse.json(data);
}