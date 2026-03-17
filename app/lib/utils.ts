import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Convert a Prisma Decimal or unknown value to a number
 * Prisma returns Decimal objects that need explicit conversion
 */
export function toNumber(value: unknown): number {
  if (value === null || value === undefined) {
    return 0;
  }
  if (typeof value === "number") {
    return value;
  }
  if (typeof value === "string") {
    return Number.parseFloat(value);
  }
  // Handle Prisma Decimal objects (they have a toString method)
  if (typeof value === "object" && value !== null && "toString" in value) {
    return Number.parseFloat(String(value));
  }
  return 0;
}

/**
 * Format number as Indonesian Rupiah currency
 * @param value - The numeric value to format (handles Prisma Decimal)
 * @returns Formatted string like "Rp 19.360.000,00"
 */
export function formatRupiah(value: unknown): string {
  const num = toNumber(value);
  if (isNaN(num)) return "Rp 0";

  // Round to maximum 2 decimal places
  const rounded = Math.round(num * 100) / 100;

  // Split into integer and decimal parts
  const parts = rounded.toString().split(".");
  const integerPart = parts[0] ?? "0";
  const decimalPart = parts[1];

  // Add thousand separators to integer part
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  // Combine with decimal part (max 2 digits)
  if (decimalPart) {
    const decimal = decimalPart.padEnd(2, "0").slice(0, 2);
    return `Rp ${formattedInteger},${decimal}`;
  }

  return `Rp ${formattedInteger},00`;
}
/**
 * Get error message from unknown error
 */
export function getErrorMessage(err: unknown): string {
  if (err && typeof err === "object" && "data" in err) {
    const errorData = (err as { data?: { message?: string; error?: string } }).data;
    if (errorData?.message) return errorData.message;
    if (errorData?.error) return errorData.error;
  }
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  return "An unknown error occurred";
}
