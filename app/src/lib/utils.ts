import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const getZoneColor = (score: number) => {
  return score > 90 ? '#c4a10a' :
         score > 70 ? '#e8bf0d' :
         score > 50 ? '#f2d663' :
         score > 30 ? '#f9ebae' : 
                      '#fefce8'; 
};