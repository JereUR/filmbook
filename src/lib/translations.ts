export function translateJobToSpanish(job: string) {
  switch (job) {
    case "Director":
      return "Director";
    case "Writer":
      return "Guionista";
    case "Producer":
      return "Productor";
    case "Director of Photography":
      return "Director de Fotografía";
    case "Casting":
      return "Casting";
    case "Co-Producer":
      return "Co-Productor";
    case "Original Music Composer":
      return "Compositor de Música Original";
    case "Visual Effects Produce":
      return "Productor de Efectos Visuales";
    default:
      return job;
  }
}

export function translateLanguageToSpanish(language: string): string {
  switch (language.toLowerCase()) {
    case "english":
      return "Inglés";
    case "french":
      return "Francés";
    case "spanish":
      return "Español";
    case "german":
      return "Alemán";
    case "japanese":
      return "Japonés";
    case "chinese":
      return "Chino";
    case "italian":
      return "Italiano";
    case "korean":
      return "Coreano";
    case "russian":
      return "Ruso";
    case "portuguese":
      return "Portugués";
    case "arabic":
      return "Árabe";
    case "dutch":
      return "Neerlandés";
    case "hindi":
      return "Hindi";
    case "turkish":
      return "Turco";
    case "polish":
      return "Polaco";
    case "swedish":
      return "Sueco";
    case "greek":
      return "Griego";
    case "hebrew":
      return "Hebreo";
    case "thai":
      return "Tailandés";
    case "norwegian":
      return "Noruego";
    case "finnish":
      return "Finlandés";
    case "danish":
      return "Danés";
    case "hungarian":
      return "Húngaro";
    case "czech":
      return "Checo";
    case "vietnamese":
      return "Vietnamita";
    case "ukrainian":
      return "Ucraniano";
    case "bengali":
      return "Bengalí";
    case "indonesian":
      return "Indonesio";
    case "romanian":
      return "Rumano";
    case "persian":
      return "Persa";
    case "swahili":
      return "Suajili";
    case "malay":
      return "Malayo";
    case "filipino":
      return "Filipino";
    case "icelandic":
      return "Islandés";
    default:
      return language;
  }
}
