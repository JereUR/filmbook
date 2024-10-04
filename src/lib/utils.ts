import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDate, formatDistanceToNowStrict } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRelativeDate(from: Date) {
  const currentDate = new Date();

  if (currentDate.getTime() - from.getTime() < 24 * 60 * 60 * 1000) {
    return formatDistanceToNowStrict(from, { addSuffix: true });
  } else {
    if (currentDate.getFullYear() === from.getFullYear()) {
      return formatDate(from, "MMM d");
    } else {
      return formatDate(from, "MMMM d, yyy");
    }
  }
}

export function formatNumber(n: number): string {
  return Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(n);
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

export function getYear(input: string): string {
  const year = input.substring(0, 4);

  return year;
}

export function ratingColor(rating: number) {
  if (rating < 4.0) {
    return "text-red-600";
  } else if (rating < 6.0) {
    return "text-yellow-600";
  } else if (rating < 9.0) {
    return "text-green-600";
  } else {
    return "text-primary";
  }
}

export function ratingColorFilmbook(rating: number) {
  if (rating < 2.5) {
    return "text-red-600";
  } else if (rating < 4.5) {
    return "text-yellow-600";
  } else if (rating < 7.0) {
    return "text-green-600";
  } else {
    return "text-primary";
  }
}

export function DateFormat(dateISO: string) {
  const date = new Date(dateISO);

  const day = date.getUTCDate();
  const months = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];
  const month = months[date.getUTCMonth()];
  const year = date.getUTCFullYear();

  return `${day} de ${month} de ${year}`;
}
