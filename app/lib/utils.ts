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
 * Format number as Indonesian Rupiah currency (abbreviated format)
 * @param value - The numeric value to format (handles Prisma Decimal)
 * @returns Formatted string like "Rp238jt", "Rp1,5M", "Rp2,3T"
 * - ribu (rb) = 1.000
 * - juta (jt) = 1.000.000
 * - miliar (M) = 1.000.000.000
 * - triliun (T) = 1.000.000.000.000
 */
export function formatRupiah(value: unknown): string {
  const num = toNumber(value);
  if (isNaN(num)) return "Rp0";

  // Trilyun (1_000_000_000_000)
  if (num >= 1_000_000_000_000) {
    return `Rp${(num / 1_000_000_000_000).toFixed(1).replace(".", ",")}T`;
  }

  // Miliar (1_000_000_000)
  if (num >= 1_000_000_000) {
    return `Rp${(num / 1_000_000_000).toFixed(1).replace(".", ",")}M`;
  }

  // Juta (1_000_000)
  if (num >= 1_000_000) {
    return `Rp${(num / 1_000_000).toFixed(1).replace(".", ",")}jt`;
  }

  // Ribu (1_000)
  if (num >= 1_000) {
    return `Rp${(num / 1_000).toFixed(1).replace(".", ",")}rb`;
  }

  // Regular format for smaller amounts
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
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
