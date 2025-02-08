import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { validateAdmin } from "@/auth"
import { DateForTournamentData } from "@/lib/types"

export async function GET(
  req: NextRequest,
  { params }: { params: { tournamentId: string } },
): Promise<NextResponse<DateForTournamentData[] | { error: string }>> {
  const { user, admin } = await validateAdmin()

  if (!user || !admin) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 })
  }

  try {
    const dates = await prisma.tournament.findFirst({
      where: { id: params.tournamentId },
      select: {
        dates: {
          orderBy: {
            date: "desc",
          },
          select: {
            id: true,
            date: true,
            name: true,
            visible: true,
            extraPoints: true,
            extraPointsSolution: true,
            movie: {
              select: {
                id: true,
                title: true,
                posterPath: true,
              },
            },
          },
        },
      },
    })

    const formattedData: DateForTournamentData[] =
      dates?.dates.map((date) => ({
        dateId: date.id,
        date: date.date,
        name: date.name,
        visible: date.visible,
        extraPoints: date.extraPoints,
        extraPointsSolution: date.extraPointsSolution,
        movie: {
          id: date.movie.id,
          title: date.movie.title,
          posterPath: date.movie.posterPath,
        },
      })) || []

    return NextResponse.json(formattedData)
  } catch (error) {
    return NextResponse.json(
      { error: "Error al obtener los datos del participante." },
      { status: 500 },
    )
  }
}
