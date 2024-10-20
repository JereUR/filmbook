import Image from 'next/image'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'

import { Provider, ProvidersByCountry } from './ProvidersInfo'

interface ProvidersResultProps {
	providers: ProvidersByCountry | null
}

export default function ProvidersResult({ providers }: ProvidersResultProps) {
	return (
		<div className="w-full min-w-0 space-y-5">
			<Tabs defaultValue="flatrate" className="w-full">
				<TabsList className="rounded-md bg-card-child p-1 text-muted-foreground shadow-sm">
					<TabsTrigger value="flatrate" className="text-xs sm:text-sm">
						Suscripción
					</TabsTrigger>
					<TabsTrigger value="rent" className="text-xs sm:text-sm">
						Alquilar
					</TabsTrigger>
					<TabsTrigger value="buy" className="text-xs sm:text-sm">
						Comprar
					</TabsTrigger>
				</TabsList>
				<TabsContent value="flatrate">
					<Providers
						providers={providers?.flatrate}
						noDataText="ver en streaming"
					/>
				</TabsContent>
				<TabsContent value="rent">
					<Providers providers={providers?.rent} noDataText="alquilar" />
				</TabsContent>
				<TabsContent value="buy">
					<Providers providers={providers?.buy} noDataText="comprar" />
				</TabsContent>
			</Tabs>
		</div>
	)
}

interface ProvidersProps {
	providers: Provider[] | undefined
	noDataText: string
}

const Providers = ({ providers, noDataText }: ProvidersProps) => {
	return (
		<div className="m-6 mb-2">
			{providers && providers.length > 0 ? (
				<div>
					<ul className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
						{providers.map(provider => (
							<li
								key={provider.provider_name}
								className="flex items-center space-x-2"
							>
								<Image
									src={provider.logo_path}
									alt={provider.provider_name}
									width={35}
									height={35}
									className="rounded-full"
								/>
								<span className="font-semibold">{provider.provider_name}</span>
							</li>
						))}
					</ul>
				</div>
			) : (
				<p className="text-center text-sm leading-relaxed text-foreground/40 md:text-base">
					No hay proveedores para {noDataText}.
				</p>
			)}
		</div>
	)
}
