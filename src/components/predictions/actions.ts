"use server"

import { validateRequest } from "@/auth"
import prisma from "@/lib/prisma"
import { type PredictionInput, predictionsArraySchema } from "@/lib/validation"
import { CategoryPredictionType } from "@/types/predictions"
import { revalidatePath } from "next/cache"

export async function addPredictions(values: PredictionInput[]) {
  const { user } = await validateRequest()
  if (!user) throw new Error("Unauthorized")

  if (values.length === 0) {
    throw new Error("No hay predicciones para guardar")
  }

  const eventId = values[0].eventId
  let awardEvent

  if (eventId.includes("-")) {
    const [eventName] = eventId.split("-")
    awardEvent = await prisma.awardEvent.findFirst({
      where: { name: eventName },
    })
  } else {
    awardEvent = await prisma.awardEvent.findUnique({
      where: { id: eventId },
    })
  }

  if (!awardEvent) throw new Error("Award event not found")

  try {
    const validatedData = predictionsArraySchema.parse(values)

    const predictions = await prisma.$transaction(
      validatedData.map((prediction) =>
        prisma.prediction.upsert({
          where: {
            userId_awardEventId_categoryId: {
              userId: user.id,
              awardEventId: awardEvent.id,
              categoryId: prediction.categoryId || "", // This fallback might be problematic if categoryId is missing but we have unique constraint
            },
          },
          update: {
            nomineeId: prediction.nomineeId,
            favoriteNomineeId: prediction.favoriteNomineeId,
            predictedWinnerName: prediction.predictedWinnerName,
            predictedWinnerImage: prediction.predictedWinnerImage,
            favoriteWinnerName: prediction.favoriteWinnerName,
            favoriteWinnerImage: prediction.favoriteWinnerImage,
            categoryName: prediction.category,
          },
          create: {
            userId: user.id,
            awardEventId: awardEvent.id,
            categoryId: prediction.categoryId,
            nomineeId: prediction.nomineeId,
            favoriteNomineeId: prediction.favoriteNomineeId,
            categoryName: prediction.category,
            predictedWinnerName: prediction.predictedWinnerName,
            predictedWinnerImage: prediction.predictedWinnerImage,
            favoriteWinnerName: prediction.favoriteWinnerName,
            favoriteWinnerImage: prediction.favoriteWinnerImage,
          },
        }),
      ),
    )

    revalidatePath(`/usuarios/predicciones/${user.id}`)
    return { userId: user.id, username: user.username }
  } catch (error) {
    console.error("Error en addPredictions:", error)
    throw error
  }
}

export async function updatePredictions(values: PredictionInput[]) {
  // Now using upsert logic in addPredictions, so update can be same as add or similar
  return addPredictions(values)
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
      },
    },
  })

  revalidatePath(`/usuarios/predicciones/${user.id}`)
}

export async function getPredictions(userId: string, eventId?: string) {
  let whereClause: any = { userId }

  if (eventId) {
    if (eventId.includes("-")) {
      const [eventName] = eventId.split("-")
      whereClause = {
        ...whereClause,
        awardEvent: { name: eventName },
      }
    } else {
      whereClause = {
        ...whereClause,
        awardEventId: eventId,
      }
    }
  }

  const predictions = await prisma.prediction.findMany({
    where: whereClause,
    include: {
      awardEvent: true,
    },
    orderBy: [
      { awardEvent: { createdAt: "desc" } },
      { awardEvent: { name: "asc" } },
      { categoryName: "asc" },
    ],
  })

  if (eventId) {
    return predictions.map((prediction) => ({
      category: prediction.categoryName,
      predictedWinnerName: prediction.predictedWinnerName,
      predictedWinnerImage: prediction.predictedWinnerImage,
      favoriteWinnerName: prediction.favoriteWinnerName,
      favoriteWinnerImage: prediction.favoriteWinnerImage,
    })) as CategoryPredictionType[]
  }

  const groupedPredictions = predictions.reduce(
    (acc, prediction) => {
      const event = prediction.awardEvent as any
      const eventKey = `${event.name}`
      if (!acc[eventKey]) {
        acc[eventKey] = {
          name: event.name,
          year: new Date(event.createdAt).getFullYear(),
          categories: {},
        }
      }
      acc[eventKey].categories[prediction.categoryName ?? ""] = {
        id: prediction.id,
        predictedWinnerName: prediction.predictedWinnerName ?? "",
        predictedWinnerImage: prediction.predictedWinnerImage,
        favoriteWinnerName: prediction.favoriteWinnerName ?? "",
        favoriteWinnerImage: prediction.favoriteWinnerImage,
      }
      return acc
    },
    {} as Record<
      string,
      {
        name: string
        year: number
        categories: Record<
          string,
          {
            id: string
            predictedWinnerName: string
            predictedWinnerImage: string | null
            favoriteWinnerName: string
            favoriteWinnerImage: string | null
          }
        >
      }
    >,
  )

  return Object.values(groupedPredictions)
}
