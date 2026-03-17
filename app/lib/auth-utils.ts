import type { AuthResponse } from "../types/auth";

type ErrorResponse = {
  message?: string;
  error?: string;
};

export function getErrorMessage(error: unknown): string {
  if (error && typeof error === "object" && "data" in error) {
    const errorData = (error as { data?: ErrorResponse }).data;
    if (errorData?.message) return errorData.message;
    if (errorData?.error) return errorData.error;
  }
  if (error instanceof Error) return error.message;
  return "An error occurred";
}

export function handleApiError<T = unknown>(error: unknown): AuthResponse<T> {
  return { success: false, error: getErrorMessage(error) };
}
