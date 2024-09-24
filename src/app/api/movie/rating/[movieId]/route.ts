import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { validateRequest } from '@/auth';

export async function GET(req: Request, { params }: { params: { movieId: string } }) {
  const { user: loggedInUser } = await validateRequest();

  console.log({params})
  console.log({loggedInUser})

  if (!loggedInUser) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const rating = await prisma.review.findFirst({
    where: {
      userId: loggedInUser.id,
      movieId: params.movieId,
    },
    select: {
      rating: true,
    },
  });

  console.log(rating)

  if (!rating) {
    return NextResponse.json(null);
  }

  return NextResponse.json(rating);
}
