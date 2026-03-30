import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const getZoneColor = (score: number) => {
  return score > 90 ? '#c4a10a' : // Jaune Foncé
         score > 70 ? '#e8bf0d' : // Jaune Parkshare
         score > 50 ? '#f2d663' : // Jaune Moyen
         score > 30 ? '#f9ebae' : // Jaune Clair
                      '#fefce8';  // Jaune Très pâle
};