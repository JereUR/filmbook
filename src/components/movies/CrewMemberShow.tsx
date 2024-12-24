import { CrewMember, ImageInfo } from "@/lib/types"
import CircularImage from "./CircularImage"
import { cn } from "@/lib/utils"

interface CrewMemberShowProps {
  member: CrewMember
  handleImageClick: (image: ImageInfo) => void
  isDirector?: boolean
}

export default function CrewMemberShow({ member, handleImageClick, isDirector = false }: CrewMemberShowProps) {
  return (
    <div className={cn("flex items-center gap-2 md:gap-3 min-h-[70px]", isDirector && "min-h-fit")}>
      <CircularImage src={member.profilePath} alt={`${member.name} avatar`} size={40} handleImageClick={handleImageClick} />
      <div className="flex flex-col">
        <span className="text-sm text-muted-foreground md:text-base">
          {member.name}
        </span>
        <span className="text-xs text-primary md:text-sm">
          {member.job}
        </span>
      </div>
    </div>
  )
}
