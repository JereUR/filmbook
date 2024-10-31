import { Metadata } from "next"

import TournamentsView from "@/components/tournaments/TournamentsView"

export const metadata: Metadata = {
  title: "Torneos",
}

export default function TournamentsPage() {
  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <TournamentsView />
      </div>
    </main>
  )
}
