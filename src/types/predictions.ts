export type Nominee = {
  name: string
  image: string | null | undefined
  type: "movie" | "person" | "song"
}

export type Prediction = {
  predictedWinner: Nominee
  favoriteWinner: Nominee
}

export type CategoryPredictions = Record<string, Prediction>

export type NominationCategory = {
  category: string
  nominees: Nominee[]
}

export type CategoryPredictionType = {
  category: string
  categoryId?: string
  predictedWinnerName?: string
  predictedWinnerImage?: string | null
  nomineeId?: string
  favoriteWinnerName?: string
  favoriteWinnerImage?: string | null
  favoriteNomineeId?: string
}

export type PredictionAward = {
  id: string
  predictedWinnerName: string
  predictedWinnerImage: string | null
  favoriteWinnerName: string
  favoriteWinnerImage: string | null
}

export type AwardEvent = {
  name: string
  year: number
  categories: Record<string, PredictionAward>
}
