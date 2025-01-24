import NomineesPageGoldenGlobes from "@/components/awards/NomineesPageGoldenGlobes"
import { Metadata } from "next"


export const metadata: Metadata = {
  title: "Nominaciones Golden Globes Awards 2025",
}

export default function NominationsPage() {

  return (
    <NomineesPageGoldenGlobes />
  )
}
