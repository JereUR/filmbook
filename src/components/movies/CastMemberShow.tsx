import CircularImage from './CircularImage'

import type { CastMember, ImageInfo } from '@/lib/types'

interface CastMemberShowProps {
	member: CastMember
	handleImageClick: (image: ImageInfo) => void
}

export default function CastMemberShow({
	member,
	handleImageClick
}: CastMemberShowProps) {
	return (
		<div className="flex min-h-[70px] items-center gap-2 md:gap-3">
			<CircularImage
				src={member.profilePath}
				alt={`${member.name} avatar`}
				size={40}
				handleImageClick={handleImageClick}
			/>
			<div className="flex flex-col">
				<span className="text-sm text-muted-foreground md:text-base">
					{member.name}
				</span>
				<span className="text-xs text-primary md:text-sm">
					{member.character}
				</span>
			</div>
		</div>
	)
}
