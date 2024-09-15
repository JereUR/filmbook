import { Metadata } from "next";
import { Loader2, TriangleAlert } from "lucide-react";
import { Suspense } from "react";

import SearchMovie from "@/components/movies/search/SearchMovie";

export const metadata: Metadata = {
  title: "Explorar películas",
};

export default function MoviesPage() {
  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <div className="rounded-2xl bg-card p-5 shadow-sm">
          <h1 className="text-center text-2xl font-bold">Explorar películas</h1>
        </div>
        <div className='flex items-center justify-around gap-2 w-full border border-w-4 p-4 border-primary mb-4 rounded-2xl'>
          <TriangleAlert className="text-yellow-500 h-6 w-6"/> <span className='text-2xl font-bold'>WORK IN PROGRESS...</span> <TriangleAlert className="text-yellow-500 h-6 w-6"/>
        </div>
        <Suspense fallback={<Loader2 className="mx-auto animate-spin" />}>
          <SearchMovie />
        </Suspense>
      </div>
    </main>
  );
}
