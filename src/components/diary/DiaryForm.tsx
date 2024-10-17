import { SearchMovie } from "@/lib/types";
import { ChevronLeft } from "lucide-react";

interface MovieItemProps {
  movie: SearchMovie | null;
  changeState: () => void;
}

export default function DiaryForm({ movie, changeState }: MovieItemProps) {
  return <div className='relative'>
    <button className='flex gap-2 items-center p-2 bg-card border border-muted text-xs md:text-sm rounded-2xl' onClick={changeState}>
      <ChevronLeft className="size-5" /> Atras
    </button>
    {movie ? movie.title : null}
  </div>
}