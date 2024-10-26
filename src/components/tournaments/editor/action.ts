"use server"

import { validateAdmin } from "@/auth"
import prisma from "@/lib/prisma"
import { createTournamentSchema } from "@/lib/validation"

export async function submitTournament(input: {
  content: string
  mediaIds: string[]
}) {
  const { user, admin } = await validateAdmin()

  if (!user || !admin) throw Error("No autorizado.")

  const { name, description } = createTournamentSchema.parse(input)

  const newTournament = await prisma.tournament.create({
    data: {
      name,
      description,
      startDate: new Date(),
    },
    include: {
      dates: true,
      participants: true,
    },
  })

  return newTournament
}
