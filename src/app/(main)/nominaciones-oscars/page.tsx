import { Metadata } from "next"

import NomineesPageOscars from "@/components/awards/NomineesPageOscars"

export const metadata: Metadata = {
  title: "Nominaciones Oscars 97th Academy Awards",
}

export default function NominationsPage() {

  return (
    <NomineesPageOscars />
  )
}
