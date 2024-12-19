import { useMemo } from "react"

import bestActorMusicalComedy from "@/data/golden-globes-nominations/best-actor-musical-comedy.json"
import bestActressMusicalComedy from "@/data/golden-globes-nominations/best-actress-musical-comedy.json"
import bestDirector from "@/data/golden-globes-nominations/best-director.json"
import bestMovieActorDrama from "@/data/golden-globes-nominations/best-movie-actor-drama.json"
import bestMovieActressDrama from "@/data/golden-globes-nominations/best-movie-actress-drama.json"
import bestOriginalScore from "@/data/golden-globes-nominations/best-original-score.json"
import bestScreenplay from "@/data/golden-globes-nominations/best-screenplay.json"
import bestSupportingActor from "@/data/golden-globes-nominations/best-supporting-actor.json"
import bestSupportingActress from "@/data/golden-globes-nominations/best-supporting-actress.json"

import bestAnimatedFilm from "@/data/golden-globes-nominations/best-animated-film.json"
import bestDramaFilm from "@/data/golden-globes-nominations/best-drama-film.json"
import bestForeignLanguageFilm from "@/data/golden-globes-nominations/best-foreign-language-film.json"
import bestMusicalComedyFilm from "@/data/golden-globes-nominations/best-musical-comedy-film.json"
import filmAndBox from "@/data/golden-globes-nominations/film-and-box-office-achievements.json"

import bestOriginalSong from "@/data/golden-globes-nominations/best-original-song.json"

import { MovieNomination, PersonNomination, SongNomination } from "@/lib/types"

export default function useGoldenGlobeNominees() {
  const nominationsPerson: PersonNomination[] = useMemo(() => {
    const data = [
      bestActorMusicalComedy,
      bestActressMusicalComedy,
      bestDirector,
      bestMovieActorDrama,
      bestMovieActressDrama,
      bestOriginalScore,
      bestScreenplay,
      bestSupportingActor,
      bestSupportingActress,
    ]

    return data
  }, [])

  const nominationsMovie: MovieNomination[] = useMemo(() => {
    const data = [
      bestAnimatedFilm,
      bestDramaFilm,
      bestForeignLanguageFilm,
      bestMusicalComedyFilm,
      filmAndBox,
    ]

    return data
  }, [])

  const nominationsOriginalSong: SongNomination[] = useMemo(() => {
    const data = [bestOriginalSong]

    return data
  }, [])

  return { nominationsPerson, nominationsMovie, nominationsOriginalSong }
}
