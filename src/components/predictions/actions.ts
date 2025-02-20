"use server"

import { validateRequest } from "@/auth"
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

type PredictionInput = {
  userId: string
  eventId: string
  category: string
  predictedWinnerName: string
  predictedWinnerImage: string | null
  favoriteWinnerName: string
  favoriteWinnerImage: string | null
}

export async function addPrediction(input: PredictionInput) {
  const { user } = await validateRequest()
  if (!user) throw new Error("Unauthorized")

  const [eventName, eventYear] = input.eventId.split("-")

  const awardEvent = await prisma.awardEvent.findFirst({
    where: {
      name: eventName,
      year: Number.parseInt(eventYear),
    },
  })

  if (!awardEvent) throw new Error("Award event not found")

  await prisma.prediction.create({
    data: {
      userId: user.id,
      awardEventId: awardEvent.id,
      category: input.category,
      predictedWinnerName: input.predictedWinnerName,
      predictedWinnerImage: input.predictedWinnerImage,
      favoriteWinnerName: input.favoriteWinnerName,
      favoriteWinnerImage: input.favoriteWinnerImage,
    },
  })

  revalidatePath("/mis-predicciones")
}

export async function updatePrediction(input: PredictionInput) {
  const { user } = await validateRequest()
  if (!user) throw new Error("Unauthorized")

  const [eventName, eventYear] = input.eventId.split("-")

  await prisma.prediction.updateMany({
    where: {
      userId: user.id,
      awardEvent: {
        name: eventName,
        year: Number.parseInt(eventYear),
      },
      category: input.category,
    },
    data: {
      predictedWinnerName: input.predictedWinnerName,
      predictedWinnerImage: input.predictedWinnerImage,
      favoriteWinnerName: input.favoriteWinnerName,
      favoriteWinnerImage: input.favoriteWinnerImage,
    },
  })

  revalidatePath("/mis-predicciones")
}

export async function deletePredictions(userId: string, eventId: string) {
  const { user } = await validateRequest()
  if (!user) throw new Error("Unauthorized")

  const [eventName, eventYear] = eventId.split("-")

  await prisma.prediction.deleteMany({
    where: {
      userId: userId,
      awardEvent: {
        name: eventName,
        year: Number.parseInt(eventYear),
      },
    },
  })

  revalidatePath("/mis-predicciones")
}

export async function getPredictions(userId: string) {
  const predictions = await prisma.prediction.findMany({
    where: {
      userId: userId,
    },
    include: {
      awardEvent: true,
    },
    orderBy: [
      { awardEvent: { year: "desc" } },
      { awardEvent: { name: "asc" } },
      { category: "asc" },
    ],
  })

  const groupedPredictions = predictions.reduce(
    (acc, prediction) => {
      const eventKey = `${prediction.awardEvent.name}-${prediction.awardEvent.year}`
      if (!acc[eventKey]) {
        acc[eventKey] = {
          name: prediction.awardEvent.name,
          year: prediction.awardEvent.year,
          categories: {},
        }
      }
      acc[eventKey].categories[prediction.category] = {
        id: prediction.id,
        predictedWinnerName: prediction.predictedWinnerName,
        predictedWinnerImage: prediction.predictedWinnerImage,
        favoriteWinnerName: prediction.favoriteWinnerName,
        favoriteWinnerImage: prediction.favoriteWinnerImage,
      }
      return acc
    },
    {} as Record<
      string,
      { name: string; year: number; categories: Record<string, any> }
    >,
  )

  return Object.values(groupedPredictions)
}
