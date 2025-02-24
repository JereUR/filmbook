import { NextResponse } from "next/server"

import prisma from "@/lib/prisma"
import { validateAdmin, validateRequest } from "@/auth"
import { TournamentDateInfo } from "@/lib/types"

export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  const { user: loggedInUser } = await validateRequest()

  if (!loggedInUser) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 })
  }

  const tournamentDate = await prisma.tournamentDate.findUnique({
    where: {
      id: params.id,
    },
    select: {
      id: true,
      date: true,
      name: true,
      movie: {
        select: {
          id: true,
          title: true,
        },
      },
      tournament: {
        select: {
          id: true,
          name: true,
        },
      },
      scores: {
        select: {
          id: true,
          points: true,
          extraPoints: true,
          participant: {
            select: {
              id: true,
              name: true,
              username: true,
            },
          },
        },
        orderBy: {
          points: "desc",
        },
      },
      visible: true,
      extraPoints: true,
      extraPointsSolution: true,
    },
  })

  if (!tournamentDate) {
    return NextResponse.json(
      { error: "Fecha de torneo no encontrada." },
      { status: 404 },
    )
  }

  const data: TournamentDateInfo = {
    id: tournamentDate.id,
    date: tournamentDate.date,
    name: tournamentDate.name,
    movie: tournamentDate.movie,
    tournament: tournamentDate.tournament,
    scores: tournamentDate.scores.map((score) => ({
      id: score.id,
      points: score.points,
      extraPoints: score.extraPoints,
      participant: score.participant,
    })),
    visible: tournamentDate.visible,
    extraPoints: tournamentDate.extraPoints,
    extraPointsSolution: tournamentDate.extraPointsSolution,
  }

  return NextResponse.json(data)
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string; mode?: string } },
) {
  const { user: loggedInUser, admin } = await validateAdmin()

  if (!loggedInUser || !admin) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 })
  }

  try {
    if (params.mode === "setVisible") {
      const updatedTournamentDate = await prisma.tournamentDate.update({
        where: { id: params.id },
        data: { visible: true },
      })

      return NextResponse.json(updatedTournamentDate, { status: 200 })
    } else {
      const body = await req.json()
      const { date, movieId, visible } = body

      const updatedTournamentDate = await prisma.tournamentDate.update({
        where: { id: params.id },
        data: {
          ...(date !== undefined && { date }),
          ...(movieId !== undefined && { movieId }),
          ...(visible !== undefined && { visible }),
        },
      })

      return NextResponse.json(updatedTournamentDate, { status: 200 })
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Error al actualizar los datos del tournamentDate." },
      { status: 500 },
    )
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {
  const { user: loggedInUser, admin } = await validateAdmin()

  if (!loggedInUser || !admin) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 })
  }

  try {
    await prisma.participantScore.deleteMany({
      where: {
        tournamentDateId: params.id,
      },
    })

    await prisma.tournamentDate.delete({
      where: {
        id: params.id,
      },
    })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("Error al eliminar el tournamentDate:", error)
    return NextResponse.json(
      { error: "Error al eliminar el tournamentDate." },
      { status: 500 },
    )
  }
}
