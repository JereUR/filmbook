import { z } from "zod"

const requiredString = z.string().trim().min(1, "Requerido")

export const signUpSchema = z.object({
  email: requiredString.email("Correo electrónico inválido."),
  username: requiredString.regex(
    /^[a-zA-Z0-9_-]+$/,
    "Solo esta permitido palabras, números, _ y -.",
  ),
  password: requiredString.min(
    8,
    "Contraseña debe tener al menos 8 caracteres.",
  ),
})

export type SignUpValues = z.infer<typeof signUpSchema>

export const loginSchema = z.object({
  username: requiredString,
  password: requiredString,
})

export type LoginValues = z.infer<typeof loginSchema>

export const createPostSchema = z.object({
  content: requiredString,
  mediaIds: z
    .array(z.string())
    .max(5, "No puede tener más de 5 archivos adjuntos."),
})

export const updateUserProfileSchema = z.object({
  displayName: requiredString,
  bio: z.string().max(1000, "Debe tener como máximo 1000 caracteres"),
})

export type UpdateUserProfileValues = z.infer<typeof updateUserProfileSchema>

export const createCommentSchema = z.object({
  content: requiredString,
})

export const createReviewSchema = z.object({
  rating: z
    .number({
      required_error: "Rating es requerido",
    })
    .min(0, "Rating debe tener un valor 0 o más")
    .max(7, "Rating debe ser como máximo 7"),
  movieId: requiredString,
  review: z.string().optional(),
})

export const createTournamentSchema = z.object({
  id: z.string().optional(),
  name: requiredString,
  description: z.string().optional(),
})

export const updateTournamentParticipantSchema = z.object({
  id: requiredString,
  name: requiredString,
  username: z.string().optional(),
  nickname: z.string().optional(),
  tournamentsId: z.string().array().optional(),
})

export const assignPointsSchema = z.object({
  participantId: requiredString,
  tournamentId: requiredString,
  dateId: requiredString,
  points: z.number().min(0, "Puntos deben ser 0 o más"),
  extraPoints: z.number().optional(),
})

const eventIdSchema = z.string().refine(
  (value) => {
    const [name, year] = value.split("-")
    return name && !isNaN(Number(year))
  },
  {
    message: "El formato del eventId debe ser 'nombre-año'",
  },
)

export const predictionInputSchema = z.object({
  userId: z.string().min(1, "Usuario es requerido"),
  eventId: eventIdSchema,
  category: z.string().min(1, "Categoría es requerida"),
  predictedWinnerName: z.string().min(1, "Ganador predicho es requerido"),
  predictedWinnerImage: z.string().nullable(),
  favoriteWinnerName: z.string().min(1, "Favorito es requerido"),
  favoriteWinnerImage: z.string().nullable(),
})

export const deletePredictionsSchema = z.object({
  userId: z.string().min(1, "Usuario es requerido"),
  eventId: eventIdSchema,
})

export const predictionsArraySchema = z.array(predictionInputSchema)

export type PredictionInput = z.infer<typeof predictionInputSchema>
