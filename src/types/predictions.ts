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
