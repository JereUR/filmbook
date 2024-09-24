import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { validateRequest } from "@/auth";

export async function GET(
  req: Request,
  { params }: { params: { movieId: string } },
) {
  const { user: loggedInUser } = await validateRequest();

  if (!loggedInUser) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const movie = await prisma.review.findFirst({
    where: {
      userId: loggedInUser.id,
      movieId: params.movieId,
    },
    select: {
      like: true,
    },
  });

  if (!movie) {
    return NextResponse.json({ watched: false, like: false });
  }

  return NextResponse.json({ watched: true, like: movie.like });
}
