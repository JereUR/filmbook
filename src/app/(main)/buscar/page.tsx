import { Metadata } from "next"

import TrendsSidebar from "@/components/TrendsSidebar"
import SearchResults from "./SearchResults"

interface SearchPageProps {
  searchParams: Promise<{ q: string }>
}

export async function generateMetadata({
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const { q } = await searchParams
  return {
    title: `Resultado de búsqueda para "${q}"`,
  }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams

  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <div className="rounded-2xl bg-card p-5 shadow-sm">
          <h1 className="text-center text-2xl font-bold line-clamp-2 break-all">
            Resultado de búsqueda para &quot;{q}&quot;
          </h1>
        </div>
        <SearchResults query={q} />
      </div>
      <TrendsSidebar />
    </main>
  )
}
