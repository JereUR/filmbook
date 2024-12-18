import { Metadata } from "next"
import GoldenGlobeNominationspersons from "./GoldenGlobeNominationsPersons"

export const metadata: Metadata = {
  title: "Nominaciones Golden Globe Awards 2025",
}

export default function NominationsPage() {

  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <div className="rounded-2xl bg-card p-5 shadow-sm">
          <h1 className="text-center text-2xl font-bold">Nominaciones</h1>
        </div>
        <GoldenGlobeNominationspersons />
      </div>
    </main>
  )
}
