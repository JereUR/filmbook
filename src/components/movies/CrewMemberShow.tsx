import CircularImage from './CircularImage'

import { CrewMember, ImageInfo } from '@/lib/types'

interface CrewMemberShowProps {
	member: CrewMember
	handleImageClick: (image: ImageInfo) => void
}

export default function CrewMemberShow({
	member,
	handleImageClick
}: CrewMemberShowProps) {
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
				<span className="text-xs text-primary md:text-sm">{member.job}</span>
			</div>
		</div>
	)
}
