import { Search } from 'lucide-react'

import LoadingButton from '@/components/LoadingButton'
import { Input } from '@/components/ui/input'

interface SearchFormProps {
	searchTerm: string
	setSearchTerm: (searchTerm: string) => void
	searchMovies: () => void
	loading: boolean
}

export default function SearchForm({
	searchTerm,
	setSearchTerm,
	searchMovies,
	loading
}: SearchFormProps) {
	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			e.preventDefault()
			searchMovies()
		}
	}

	return (
		<div className="mb-8 flex items-center justify-center space-x-2">
			<div className="relative max-w-md grow">
				<Input
					type="text"
					value={searchTerm}
					onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
						setSearchTerm(e.target.value)
					}
					onKeyDown={handleKeyDown}
					placeholder="Ingresa el título de la película"
					className="w-full rounded-l-md border border-muted py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary"
				/>
				<Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
			</div>
			<LoadingButton
				onClick={searchMovies}
				loading={loading}
				className="rounded-r-md bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
			>
				Buscar
			</LoadingButton>
		</div>
	)
}
