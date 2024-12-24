"use client"

import { usePathname } from 'next/navigation'
import PopularMovies from './PopularMovies'

export default function ConditionalPopularMovies() {
  const pathname = usePathname()

  if (pathname === '/mensajes') {
    return null
  }

  return (
    <PopularMovies className="hidden h-fit flex-none space-y-3 rounded-2xl bg-card px-3 py-5 shadow-sm sm:block lg:px-5 xl:w-80 z-50" />
  )
}

