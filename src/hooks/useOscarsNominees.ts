import { useMemo } from "react"

import actorLeadingRole from "@/data/oscars-nominations/actor-leading-role.json"
import actorSupportingRole from "@/data/oscars-nominations/actor-supporting-role.json"
import actreesSupportingRole from "@/data/oscars-nominations/actrees-supporting-role.json"
import actreesLeadingRole from "@/data/oscars-nominations/actress-leading-role.json"
import cinematography from "@/data/oscars-nominations/cinematography.json"
import costumeDesign from "@/data/oscars-nominations/costume-design.json"
import directing from "@/data/oscars-nominations/directing.json"
import filmEditing from "@/data/oscars-nominations/film-editing.json"
import makeUpAndHairstyling from "@/data/oscars-nominations/makeup-and-hairstyling.json"
import originalScore from "@/data/oscars-nominations/original-score.json"
import productionDesign from "@/data/oscars-nominations/production-design.json"
import sound from "@/data/oscars-nominations/sound.json"
import visualEffects from "@/data/oscars-nominations/visual-effects.json"
import writingAdaptedScreenplay from "@/data/oscars-nominations/writing-adapted-screenplay.json"
import writingOriginalScreenplay from "@/data/oscars-nominations/writing-original-screenplay.json"

import animatedFeatureFilm from "@/data/oscars-nominations/animated-feature-film.json"
import animatedShortFilm from "@/data/oscars-nominations/animated-short-film.json"
import bestPicture from "@/data/oscars-nominations/best-picture.json"
import documentaryFeatureFilm from "@/data/oscars-nominations/documentary-feature-film.json"
import documentaryShortFilm from "@/data/oscars-nominations/documentary-short-film.json"
import internationalFeatureFilm from "@/data/oscars-nominations/international-feature-film.json"
import liveActionShortFilm from "@/data/oscars-nominations/live-action-short-film.json"

import originalSong from "@/data/oscars-nominations/original-song.json"

import { MovieNomination, PersonNomination, SongNomination } from "@/lib/types"

export default function useOscarsNominees() {
  const nominationsPerson: PersonNomination[] = useMemo(() => {
    const data = [
      actorLeadingRole,
      actorSupportingRole,
      actreesSupportingRole,
      actreesLeadingRole,
      directing,
      writingAdaptedScreenplay,
      writingOriginalScreenplay,
      cinematography,
      costumeDesign,
      filmEditing,
      makeUpAndHairstyling,
      originalScore,
      productionDesign,
      sound,
      visualEffects,
    ]

    return data
  }, [])

  const nominationsMovie: MovieNomination[] = useMemo(() => {
    const data = [
      bestPicture,
      animatedFeatureFilm,
      animatedShortFilm,
      documentaryFeatureFilm,
      documentaryShortFilm,
      internationalFeatureFilm,
      liveActionShortFilm,
    ]

    return data
  }, [])

  const nominationsOriginalSong: SongNomination[] = useMemo(() => {
    const data = [originalSong]

    return data
  }, [])

  return { nominationsPerson, nominationsMovie, nominationsOriginalSong }
}
