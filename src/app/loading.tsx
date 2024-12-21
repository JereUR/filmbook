import Image from 'next/image'

import logoImg from '@/assets/logo.png'
import { Skeleton } from '@/components/ui/skeleton'

export default function RootLoading() {
  return (
    <div className="fixed inset-0 bg-[#0a0a1b] flex flex-col items-center justify-center p-4">
      <div className="relative w-24 h-24 sm:w-32 sm:h-32 mb-4">
        <Image
          src={logoImg}
          alt="Filmbook Logo"
          fill
          sizes="(max-width: 640px) 6rem, 8rem"
          priority
          className="object-contain animate-pulse"
        />
      </div>
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-6 sm:mb-8 animate-pulse">Filmbook</h1>
      <div className="flex space-x-2 sm:space-x-3">
        <Skeleton className="w-3 h-3 sm:w-4 sm:h-4 rounded-full animate-loading-dot" />
        <Skeleton className="w-3 h-3 sm:w-4 sm:h-4 rounded-full animate-loading-dot [animation-delay:0.8s]" />
        <Skeleton className="w-3 h-3 sm:w-4 sm:h-4 rounded-full animate-loading-dot [animation-delay:1s]" />
      </div>
      <div className="mt-6 sm:mt-8 text-sm sm:text-base italic text-gray-400 text-center animate-pulse">
        Cargando tu experiencia cinematográfica
      </div>
    </div>
  )
}

