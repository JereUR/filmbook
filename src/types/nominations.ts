export type MovieNomination = {
  category: string
  winner: string
  nominees: {
    id: string | null
    title: string
    posterPath: string
    releaseDate: string
    runtime: number
    voteAverage: number | null
    genres: string[]
    directors: string[]
    providers: string[]
  }[]
}

export type PersonNomination = {
  category: string
  winner: string
  nominees: {
    name: string
    movieId: string
    movieTitle: string
    photo: string
    providers: string[]
  }[]
}

export type SongNomination = {
  category: string
  winner: string
  nominees: {
    name: string
    movieId: string
    movieTitle: string
    composers: string[]
    posterPath: string
    providers: string[]
  }[]
}

export type UnifiedNominee = {
  name: string
  image: string | null
  details: {
    movie?: string
    director?: string
    artists?: string[]
  }
}

export type UnifiedNomination = {
  category: string
  type: "person" | "movie" | "song"
  nominees: UnifiedNominee[]
}

export type Prediction = {
  predictedWinner: UnifiedNominee
  favoriteWinner: UnifiedNominee
}

export type CategoryPredictions = Record<string, Prediction>
