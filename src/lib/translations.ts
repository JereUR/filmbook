export function translateJobToSpanish(job: string) {
	switch (job) {
		case 'Director':
			return 'Director'
		case 'Writer':
			return 'Guionista'
		case 'Producer':
			return 'Productor'
		case 'Director of Photography':
			return 'Director de Fotografía'
		case 'Casting':
			return 'Casting'
		case 'Co-Producer':
			return 'Co-Productor'
		case 'Original Music Composer':
			return 'Compositor de Música Original'
		case 'Visual Effects Produce':
			return 'Productor de Efectos Visuales'
		default:
			return job
	}
}

export function translateLanguageToSpanish(language: string): string {
	switch (language.toLowerCase()) {
		case 'english':
			return 'Inglés'
		case 'french':
			return 'Francés'
		case 'spanish':
			return 'Español'
		case 'german':
			return 'Alemán'
		case 'japanese':
			return 'Japonés'
		case 'chinese':
			return 'Chino'
		case 'italian':
			return 'Italiano'
		case 'korean':
			return 'Coreano'
		case 'russian':
			return 'Ruso'
		case 'portuguese':
			return 'Portugués'
		case 'arabic':
			return 'Árabe'
		case 'dutch':
			return 'Neerlandés'
		case 'hindi':
			return 'Hindi'
		case 'turkish':
			return 'Turco'
		case 'polish':
			return 'Polaco'
		case 'swedish':
			return 'Sueco'
		case 'greek':
			return 'Griego'
		case 'hebrew':
			return 'Hebreo'
		case 'thai':
			return 'Tailandés'
		case 'norwegian':
			return 'Noruego'
		case 'finnish':
			return 'Finlandés'
		case 'danish':
			return 'Danés'
		case 'hungarian':
			return 'Húngaro'
		case 'czech':
			return 'Checo'
		case 'vietnamese':
			return 'Vietnamita'
		case 'ukrainian':
			return 'Ucraniano'
		case 'bengali':
			return 'Bengalí'
		case 'indonesian':
			return 'Indonesio'
		case 'romanian':
			return 'Rumano'
		case 'persian':
			return 'Persa'
		case 'swahili':
			return 'Suajili'
		case 'malay':
			return 'Malayo'
		case 'filipino':
			return 'Filipino'
		case 'icelandic':
			return 'Islandés'
		default:
			return language
	}
}

export function translateCountryToSpanish(country: string): string {
	switch (country.toLowerCase()) {
		case 'united states':
			return 'Estados Unidos'
		case 'canada':
			return 'Canadá'
		case 'mexico':
			return 'México'
		case 'argentina':
			return 'Argentina'
		case 'brazil':
			return 'Brasil'
		case 'spain':
			return 'España'
		case 'france':
			return 'Francia'
		case 'germany':
			return 'Alemania'
		case 'italy':
			return 'Italia'
		case 'united kingdom':
			return 'Reino Unido'
		case 'china':
			return 'China'
		case 'japan':
			return 'Japón'
		case 'south korea':
			return 'Corea del Sur'
		case 'russia':
			return 'Rusia'
		case 'india':
			return 'India'
		case 'portugal':
			return 'Portugal'
		case 'australia':
			return 'Australia'
		case 'netherlands':
			return 'Países Bajos'
		case 'greece':
			return 'Grecia'
		case 'sweden':
			return 'Suecia'
		case 'norway':
			return 'Noruega'
		case 'finland':
			return 'Finlandia'
		case 'denmark':
			return 'Dinamarca'
		case 'switzerland':
			return 'Suiza'
		case 'poland':
			return 'Polonia'
		case 'turkey':
			return 'Turquía'
		case 'egypt':
			return 'Egipto'
		case 'south africa':
			return 'Sudáfrica'
		case 'saudi arabia':
			return 'Arabia Saudita'
		case 'iran':
			return 'Irán'
		case 'israel':
			return 'Israel'
		case 'thailand':
			return 'Tailandia'
		case 'vietnam':
			return 'Vietnam'
		case 'new zealand':
			return 'Nueva Zelanda'
		case 'indonesia':
			return 'Indonesia'
		case 'philippines':
			return 'Filipinas'
		case 'malaysia':
			return 'Malasia'
		case 'iceland':
			return 'Islandia'
		case 'romania':
			return 'Rumania'
		case 'ukraine':
			return 'Ucrania'
		case 'hungary':
			return 'Hungría'
		case 'czech republic':
			return 'República Checa'
		default:
			return country
	}
}
