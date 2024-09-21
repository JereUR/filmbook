import Image from "next/image";

import { translateCountryToSpanish, translateLanguageToSpanish } from "@/lib/translations";
import noLogoImage from "@/assets/no-image-film.jpg";

interface Companies {
  id: number;
  name: string;
  logo_path: string;
  origin_country: string;
}

interface Countries {
  iso_3166_1: string;
  name: string;
}

type Language = {
  iso_639_1: string;
  name: string;
  english_name: string;
};

interface DetailsSectionProps {
  productionCompanies: Companies[];
  productionCountries: Countries[];
  spokenLanguages: Language[];
}

export default function DetailsSection({
  productionCompanies,
  productionCountries,
  spokenLanguages,
}: DetailsSectionProps) {
  return (
    <>
      <div className="flex flex-col gap-2 space-y-2 p-2 md:mx-5 md:space-y-3">
        <h2
          className="ml-1 font-light text-foreground/40 underline md:ml-0 lg:text-lg"
          style={{ textUnderlineOffset: "3px" }}
        >
          Detalles
        </h2>
        <div className="ml-3 flex flex-col gap-2 rounded-2xl border border-primary/40 p-2 md:ml-5 md:gap-4 md:p-5">
          <h3 className="text-sm font-semibold text-foreground/40 md:text-base mb-1 md:mb-0">
            Idiomas
          </h3>
          <ul className="ml-5 flex list-inside list-disc flex-wrap items-center gap-2 md:gap-4 md:ml-8">
            {spokenLanguages.map((language: Language) => (
              <li
                key={language.iso_639_1}
                className="mr-2 text-xs md:mr-4 md:text-sm italic"
              >
                {translateLanguageToSpanish(language.english_name)}.
              </li>
            ))}
          </ul>
        </div>
        <div className="ml-3 flex flex-col gap-2 rounded-2xl border border-primary/40 p-2 md:ml-5 md:gap-4 md:p-5">
          <h3 className="text-sm font-semibold text-foreground/40 md:text-base mb-1 md:mb-0">
            Países de producción
          </h3>
          <ul className="ml-5 flex list-inside list-disc flex-wrap items-center gap-2 md:gap-4 md:ml-8">
            {productionCountries.map((country: Countries) => (
              <li
                key={country.iso_3166_1}
                className="mr-2 flex items-center gap-2 text-xs md:mr-4 md:text-sm italic"
              >
                <Image
                  src={`https://flagcdn.com/w20/${country.iso_3166_1.toLowerCase()}.png`}
                  width={20}
                  height={20}
                  alt={`${country.name} flag`}
                />
                {translateCountryToSpanish(country.name)}.
              </li>
            ))}
          </ul>
        </div>
        <div className="ml-3 flex flex-col gap-2 rounded-2xl border border-primary/40 p-2 md:ml-5 md:gap-4 md:p-5">
          <h3 className="text-sm font-semibold text-foreground/40 md:text-base">
            Producción
          </h3>
          <ul className="ml-5 flex list-inside list-disc flex-wrap items-center gap-2 md:gap-4 md:ml-8">
            {productionCompanies.map((company: Companies) => (
              <li
                key={company.id}
                className="mr-2 flex flex-col items-center justify-center gap-1 text-xs md:mr-4 md:text-sm italic"
              >
                <Image
                  src={company.logo_path ? company.logo_path : noLogoImage}
                  width={80}
                  height={80}
                  alt={`${company.name} logo`}
                  title={company.name}
                  className="rounded-2xl bg-primary/40 p-2"
                />
                {company.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
