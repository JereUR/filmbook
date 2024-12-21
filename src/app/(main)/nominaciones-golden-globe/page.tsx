import { Metadata } from "next"

import NomineesPage from "@/components/golgen-globe/NomineesPage"

export const metadata: Metadata = {
  title: "Nominaciones Golden Globe Awards 2025",
}

export default function NominationsPage() {

  return (
    <NomineesPage />
  )
}
