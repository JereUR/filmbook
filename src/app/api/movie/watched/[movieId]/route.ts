import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { validateRequest } from "@/auth";
import { WatchedInfo } from "@/lib/types";

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
      watched: true,
    },
  });
  
  const data: WatchedInfo = {
    isWatchedByUser: movie ? movie.watched : false,
  };

  return NextResponse.json(data);
}

export async function POST(
  req: Request,
  { params: { movieId } }: { params: { movieId: string } },
) {
  try {
    const { user: loggedInUser } = await validateRequest();

    if (!loggedInUser) {
      return Response.json({ error: "No autorizado." }, { status: 401 });
    }

    await prisma.review.upsert({
      where: {
        userId_movieId: {
          userId: loggedInUser.id,
          movieId,
        },
      },
      create: { userId: loggedInUser.id, movieId, watched: true },
      update: { watched: true },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error Interno del Servidor." },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: Request,
  { params: { movieId } }: { params: { movieId: string } },
) {
  try {
    const { user: loggedInUser } = await validateRequest();

    if (!loggedInUser) {
      return Response.json({ error: "No autorizado." }, { status: 401 });
    }

    await prisma.review.upsert({
      where: {
        userId_movieId: {
          userId: loggedInUser.id,
          movieId,
        },
      },
      create: { userId: loggedInUser.id, movieId, watched: false },
      update: { watched: false },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error Interno del Servidor." },
      { status: 500 },
    );
  }
}
