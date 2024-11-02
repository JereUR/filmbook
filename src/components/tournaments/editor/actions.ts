"use server"

import { validateAdmin } from "@/auth"
import prisma from "@/lib/prisma"
import { createTournamentSchema } from "@/lib/validation"
import { InputTournamentProps } from "./AddTournamentButton"

export async function submitTournament(input: InputTournamentProps) {
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

export async function updateTournament(input: InputTournamentProps) {
  const { user, admin } = await validateAdmin()

  if (!user || !admin) throw Error("No autorizado.")

  const { id, name, description } = createTournamentSchema.parse(input)

  const updatedTournament = await prisma.tournament.update({
    where: { id },
    data: {
      name,
      description,
    },
    include: {
      dates: true,
      participants: true,
    },
  })

  return updatedTournament
}
