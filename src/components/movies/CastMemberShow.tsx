import type { CastMember } from "@/lib/types";
import CircularImage from "./CircularImage";

interface CastMemberShowProps {
  member: CastMember;
}

export default function CastMemberShow({ member}: CastMemberShowProps) {
  return (
    <div className="flex items-center gap-2 md:gap-3">
      <CircularImage src={member.profilePath} alt={`${member.name} avatar`} size={36}/>
      <div className="flex flex-col">
        <span className="text-sm text-muted-foreground md:text-base">
          {member.name}
        </span>
        <span className="text-xs text-primary md:text-sm">
          {member.character}
        </span>
      </div>
    </div>
  );
}
