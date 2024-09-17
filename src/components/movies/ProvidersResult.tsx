import Image from "next/image";

import { ProvidersByCountry } from "./ProvidersInfo";

interface ProvidersResultProps {
  providers: ProvidersByCountry | null;
}

export default function ProvidersResult({ providers }: ProvidersResultProps) {
  return (
    <>
      {providers ? (
        <div className="space-y-4">
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
    </>
  );
}
