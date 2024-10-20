import { useState, useMemo } from 'react'
import Image from 'next/image'
import { Check, ChevronsUpDown } from 'lucide-react'

import { Card } from '../ui/card'
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList
} from '../ui/command'

import ProvidersResult from './ProvidersResult'

import { Button } from '@/components/ui/button'
import {
	Popover,
	PopoverContent,
	PopoverTrigger
} from '@/components/ui/popover'
import { countryOptions } from '@/lib/countries'

export interface Provider {
	logo_path: string
	provider_name: string
	display_priority: number
}

export interface ProvidersByCountry {
	flatrate?: Provider[]
	rent?: Provider[]
	buy?: Provider[]
}

interface FormattedResults {
	[key: string]: ProvidersByCountry
}

interface ProvidersInfoProps {
	providersList: FormattedResults
}

interface CountryOption {
	code: string
	name: string
}

export default function ProvidersInfo({ providersList }: ProvidersInfoProps) {
	const [open, setOpen] = useState(false)
	const [selectedCountry, setSelectedCountry] = useState<CountryOption | null>(
		countryOptions && countryOptions.length > 0 ? countryOptions[1] : null
	)

	const handleCountryChange = (country: CountryOption) => {
		setSelectedCountry(country)
		setOpen(false)
	}

	const providers = useMemo(
		() =>
			selectedCountry && providersList
				? providersList[selectedCountry.code]
				: null,
		[providersList, selectedCountry]
	)

	if (!countryOptions || countryOptions.length === 0) {
		return (
			<p className="text-red-500">
				Error: No hay opciones de países disponibles.
			</p>
		)
	}

	return (
		<Card className="mx-2 my-1 space-y-2 border-2 border-primary/50 p-5 md:m-5 md:space-y-4">
			<div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
				<h3 className="font-semibold md:text-lg">
					Donde ver en {selectedCountry?.name}:
				</h3>
				<Popover open={open} onOpenChange={setOpen}>
					<PopoverTrigger
						asChild
						className="border-1 border-primary/50 bg-background text-xs hover:bg-background/50 md:text-sm"
					>
						<Button
							variant="outline"
							role="combobox"
							aria-expanded={open}
							className="min-w-[250px] justify-between"
						>
							{selectedCountry ? (
								<div className="flex items-center">
									<Image
										src={`https://flagcdn.com/w20/${selectedCountry.code.toLowerCase()}.png`}
										width={20}
										height={15}
										alt={`${selectedCountry.name} flag`}
										className="mr-2"
									/>
									{selectedCountry.name}
								</div>
							) : (
								'Selecciona un país'
							)}
							<ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
						</Button>
					</PopoverTrigger>
					<PopoverContent className="w-[250px] p-2">
						<Command className="max-h-[300px]">
							<CommandInput placeholder="Buscar país..." />
							<CommandList className="scrollbar-thin overflow-auto">
								<CommandEmpty>Sin resultados.</CommandEmpty>
								<CommandGroup heading="Paises">
									{countryOptions.map(country => (
										<CommandItem
											key={country.code}
											className={`data-[selected='true']:bg-transparent`}
										>
											<Button
												key={country.code}
												variant="ghost"
												className="w-full justify-start text-left"
												onClick={() => handleCountryChange(country)}
											>
												<div className="flex items-center gap-2">
													<Image
														src={`https://flagcdn.com/w20/${country.code.toLowerCase()}.png`}
														width={20}
														height={20}
														alt={`${country.name} flag`}
														className="mr-2"
													/>
													{country.name}
													{selectedCountry?.code === country.code && (
														<Check className="ml-auto size-4 text-green-600" />
													)}
												</div>
											</Button>
										</CommandItem>
									))}
								</CommandGroup>
							</CommandList>
						</Command>
					</PopoverContent>
				</Popover>
			</div>
			<ProvidersResult providers={providers} />
		</Card>
	)
}
