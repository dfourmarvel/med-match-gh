import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrencyRange(range: [number, number]) {
  return `GHS ${range[0].toLocaleString()} - ${range[1].toLocaleString()}`;
}

export function clamp(value: number, min = 0, max = 100) {
  return Math.min(Math.max(value, min), max);
}

export function slugify(input: string) {
  return input.toLowerCase().replace(/&/g, "and").replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
}
