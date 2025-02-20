import { useMemo } from "react"
import type {
  MovieNomination,
  PersonNomination,
  SongNomination,
  UnifiedNomination,
} from "@/types/nominations"

// Importaciones de JSON (mantenidas como en tu código original)
import actorLeadingRole from "@/data/oscars-nominations/actor-leading-role.json"
import actorSupportingRole from "@/data/oscars-nominations/actor-supporting-role.json"
import actreesSupportingRole from "@/data/oscars-nominations/actress-supporting-role.json"
import actreesLeadingRole from "@/data/oscars-nominations/actress-leading-role.json"
import animatedFeatureFilm from "@/data/oscars-nominations/animated-feature-film.json"
import animatedShortFilm from "@/data/oscars-nominations/animated-short-film.json"
import bestPicture from "@/data/oscars-nominations/best-picture.json"
import cinematography from "@/data/oscars-nominations/cinematography.json"
import costumeDesign from "@/data/oscars-nominations/costume-design.json"
import directing from "@/data/oscars-nominations/directing.json"
import documentaryFeatureFilm from "@/data/oscars-nominations/documentary-feature-film.json"
import documentaryShortFilm from "@/data/oscars-nominations/documentary-short-film.json"
import filmEditing from "@/data/oscars-nominations/film-editing.json"
import internationalFeatureFilm from "@/data/oscars-nominations/international-feature-film.json"
import liveActionShortFilm from "@/data/oscars-nominations/live-action-short-film.json"
import makeUpAndHairstyling from "@/data/oscars-nominations/makeup-and-hairstyling.json"
import originalScore from "@/data/oscars-nominations/original-score.json"
import originalSong from "@/data/oscars-nominations/original-song.json"
import productionDesign from "@/data/oscars-nominations/production-design.json"
import sound from "@/data/oscars-nominations/sound.json"
import visualEffects from "@/data/oscars-nominations/visual-effects.json"
import writingAdaptedScreenplay from "@/data/oscars-nominations/writing-adapted-screenplay.json"
import writingOriginalScreenplay from "@/data/oscars-nominations/writing-original-screenplay.json"

export default function useOscarsNominees() {
  const nominationsPerson = useMemo<PersonNomination[]>(() => {
    return [
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
  }, [])

  const nominationsMovie = useMemo<MovieNomination[]>(() => {
    return [
      bestPicture,
      animatedFeatureFilm,
      animatedShortFilm,
      documentaryFeatureFilm,
      documentaryShortFilm,
      internationalFeatureFilm,
      liveActionShortFilm,
    ]
  }, [])

  const nominationsOriginalSong = useMemo<SongNomination[]>(() => {
    return [originalSong]
  }, [])

  const unifiedNominations = useMemo<UnifiedNomination[]>(() => {
    const transformNominations = (
      nominations: any[],
      type: "person" | "movie" | "song",
    ): UnifiedNomination[] => {
      return nominations.map((nomination) => ({
        category: nomination.category,
        type,
        nominees: nomination.nominees.map((nominee: any) => ({
          name: type === "movie" ? nominee.title : nominee.name,
          image: type === "person" ? nominee.photo : nominee.posterPath,
          details: {
            movie: type === "person" ? nominee.movieTitle : undefined,
            director: type === "movie" ? nominee.directors?.[0] : undefined,
            artists: type === "song" ? nominee.composers : undefined,
          },
        })),
      }))
    }

    return [
      ...transformNominations(nominationsPerson, "person"),
      ...transformNominations(nominationsMovie, "movie"),
      ...transformNominations(nominationsOriginalSong, "song"),
    ]
  }, [nominationsPerson, nominationsMovie, nominationsOriginalSong])

  return {
    nominationsPerson,
    nominationsMovie,
    nominationsOriginalSong,
    unifiedNominations,
  }
}
