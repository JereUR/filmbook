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
import { PersonNomination } from "@/lib/types"

export default function useGoldenGlobePersons() {
  const nominations = useMemo(() => {
    const data: Record<string, PersonNomination> = {
      "Best Actor - Musical/Comedy": bestActorMusicalComedy,
      "Best Actress - Musical/Comedy": bestActressMusicalComedy,
      "Best Director": bestDirector,
      "Best Movie Actor - Drama": bestMovieActorDrama,
      "Best Movie Actress - Drama": bestMovieActressDrama,
      "Best Original Score": bestOriginalScore,
      "Best Screenplay": bestScreenplay,
      "Best Supporting Actor": bestSupportingActor,
      "Best Supporting Actress": bestSupportingActress,
    }

    return data
  }, [])

  const nominationsArray = useMemo(() => {
    return Object.entries(nominations).map(([category, data]) => ({
      category,
      ...data,
    }))
  }, [nominations])

  return { nominations, nominationsArray }
}
