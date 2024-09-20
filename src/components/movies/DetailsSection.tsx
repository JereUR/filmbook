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
      <div className="flex flex-col gap-2 space-y-2 p-2 md:mx-5 md:space-y-4">
        <h2
          className="text-lg font-light text-foreground/40 underline md:text-xl lg:text-2xl"
          style={{ textUnderlineOffset: "3px" }}
        >
          Detalles
        </h2>
      </div>
    </>
  );
}
