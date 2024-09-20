export default function translateJobToSpanish(job: string) {
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
      return "Desconocido";
  }
}
