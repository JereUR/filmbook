import { NextRequest } from "next/server"

import prisma from "@/lib/prisma"
import { ParticipantsData } from "@/lib/types"

export async function GET(req: NextRequest) {
  try {
    const participants = await prisma.participant.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        username: true,
        nickname: true,
      },
    })

    const data: ParticipantsData[] = participants.map((participant) => ({
      id: participant.id,
      name: participant.name,
      username: participant.username,
      nickname: participant.nickname || undefined,
    }))

    return Response.json(data)
  } catch (error) {
    return Response.json(
      { error: "Error Interno del Servidor." },
      { status: 500 },
    )
  }
}
