import { useState, useMemo } from "react";
import Image from "next/image";
import { Check, ChevronsUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { countryOptions } from "@/lib/countries"; // Asegúrate de que countryOptions tenga URLs de imágenes para las banderas

interface Provider {
  logo_path: string;
  provider_name: string;
  display_priority: number;
}

interface ProvidersByCountry {
  flatrate?: Provider[];
  rent?: Provider[];
  buy?: Provider[];
}

interface FormattedResults {
  [key: string]: ProvidersByCountry;
}

interface ProvidersInfoProps {
  providersList: FormattedResults;
}

interface CountryOption {
  code: string;
  name: string;
}

export default function ProvidersInfo({ providersList }: ProvidersInfoProps) {
  const [open, setOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<CountryOption | null>(
    countryOptions && countryOptions.length > 0 ? countryOptions[1] : null,
  );

  const handleCountryChange = (country: CountryOption) => {
    setSelectedCountry(country);
    setOpen(false);
  };

  const providers = useMemo(
    () =>
      selectedCountry && providersList
        ? providersList[selectedCountry.code]
        : null,
    [providersList, selectedCountry],
  );

  if (!countryOptions || countryOptions.length === 0) {
    return (
      <p className="text-red-500">
        Error: No hay opciones de países disponibles.
      </p>
    );
  }

  return (
    <div className="space-y-3 mt-3">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[200px] justify-between"
          >
            {selectedCountry ? (
              <>
                <Image
                  src={`https://flagcdn.com/w20/${selectedCountry.code.toLowerCase()}.png`}
                  width={20}
                  height={15}
                  alt={`${selectedCountry.name} flag`}
                  className="mr-2"
                />
                {selectedCountry.name}
              </>
            ) : (
              "Selecciona un país"
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="scrollbar-thin scrollbar-thumb-rounded scrollbar-track-rounded dark:scrollbar-thumb-backgroung max-h-[300px] w-[200px] overflow-y-auto p-2">
          <div className="space-y-1">
            {countryOptions.map((country) => (
              <Button
                key={country.code}
                variant="ghost"
                className="w-full justify-start text-left"
                onClick={() => handleCountryChange(country)}
              >
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    <Image
                      src={`https://flagcdn.com/w20/${country.code.toLowerCase()}.png`}
                      width={20}
                      height={15}
                      alt={`${country.name} flag`}
                      className="mr-2"
                    />
                    {country.name}
                  </div>
                  <div>
                    {selectedCountry?.code === country.code && (
                      <Check className="h-4 w-4 text-green-600" />
                    )}
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
      {providers ? (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">
            Plataformas en {selectedCountry?.name}:
          </h3>

          {providers.flatrate && providers.flatrate.length > 0 ? (
            <div>
              <h4 className="text-md font-medium">Ver en streaming:</h4>
              <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                {providers.flatrate.map((provider) => (
                  <li
                    key={provider.provider_name}
                    className="flex items-center space-x-2"
                  >
                    <Image
                      src={provider.logo_path}
                      alt={provider.provider_name}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    <span>{provider.provider_name}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p>No hay proveedores para ver en streaming.</p>
          )}

          {providers.rent && providers.rent.length > 0 ? (
            <div>
              <h4 className="text-md font-medium">Alquilar:</h4>
              <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                {providers.rent.map((provider) => (
                  <li
                    key={provider.provider_name}
                    className="flex items-center space-x-2"
                  >
                    <Image
                      src={provider.logo_path}
                      alt={provider.provider_name}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    <span>{provider.provider_name}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p>No hay proveedores para alquilar.</p>
          )}

          {providers.buy && providers.buy.length > 0 ? (
            <div>
              <h4 className="text-md font-medium">Comprar:</h4>
              <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                {providers.buy.map((provider) => (
                  <li
                    key={provider.provider_name}
                    className="flex items-center space-x-2"
                  >
                    <Image
                      src={provider.logo_path}
                      alt={provider.provider_name}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    <span>{provider.provider_name}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p>No hay proveedores para comprar.</p>
          )}
        </div>
      ) : (
        <p className="text-muted-foreground">
          No hay proveedores disponibles para este país.
        </p>
      )}
    </div>
  );
}
