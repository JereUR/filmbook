import { validateAdmin } from "@/auth"
import prisma from "@/lib/prisma"

interface RequestBody {
  name: string
  username?: string
  nickname?: string
  tournamentsId?: string[]
}

export async function POST(req: Request) {
  try {
    const { user, admin } = await validateAdmin()

    if (!admin || !user) {
      return new Response(JSON.stringify({ error: "No autorizado." }), {
        status: 401,
      })
    }

    const { name, username, nickname, tournamentsId } =
      (await req.json()) as RequestBody

    const existingUser = await prisma.participant.findFirst({
      where: {
        name: {
          equals: name,
          mode: "insensitive",
        },
      },
      select: {
        id: true,
      },
    })

    if (existingUser) {
      return new Response(JSON.stringify({ error: "El nombre ya existe." }), {
        status: 400,
      })
    }

    const newParticipant = await prisma.participant.create({
      data: {
        name,
        username: username || "",
        nickname: nickname || "",
        tournaments: tournamentsId
          ? {
              create: tournamentsId.map((tournamentId) => ({
                tournament: {
                  connect: { id: tournamentId },
                },
              })),
            }
          : undefined,
      },
      include: {
        tournaments: true,
      },
    })

    return new Response(JSON.stringify(newParticipant), { status: 201 })
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Error al crear el participante." }),
      {
        status: 500,
      },
    )
  }
}
