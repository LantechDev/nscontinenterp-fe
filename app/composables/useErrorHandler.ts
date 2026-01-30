import type { AxiosError } from "axios";

interface ApiErrorResponse {
  message?: string;
  error?: string;
  statusCode?: number;
}

export interface ErrorResult<T = unknown> {
  success: false;
  error: string;
  data?: T;
}

export function useErrorHandler() {
  /**
   * Parse error from try-catch and return a standardized error message
   */
  function parseError(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }

    if (typeof error === "string") {
      return error;
    }

    // Handle Axios errors
    if (isAxiosError(error)) {
      const apiError = error.response?.data as ApiErrorResponse | undefined;
      if (apiError?.message) {
        return apiError.message;
      }
      if (apiError?.error) {
        return apiError.error;
      }
      return `HTTP ${error.response?.status || "Error"}: ${error.message}`;
    }

    // Handle fetch errors
    if (isFetchError(error)) {
      return error.message || "Network error occurred";
    }

    // Handle objects with message property
    if (isObjectWithMessage(error)) {
      return error.message;
    }

    return "An unknown error occurred";
  }

  /**
   * Handle error in try-catch block and log it
   */
  function handleError(error: unknown, context?: string): string {
    const message = parseError(error);
    const logMessage = context ? `[${context}] ${message}` : message;
    console.error(logMessage, error);
    return message;
  }

  /**
   * Create a try-catch wrapper that handles errors automatically
   */
  async function safeFetch<T>(
    fetchFn: () => Promise<T>,
    options?: {
      onError?: (error: string) => void;
      context?: string;
      fallback?: T;
    },
  ): Promise<T | null> {
    try {
      return await fetchFn();
    } catch (error) {
      const message = handleError(error, options?.context);
      options?.onError?.(message);
      return options?.fallback ?? null;
    }
  }

  /**
   * Create a wrapped version of a function that handles errors
   */
  function withErrorHandling<Args extends unknown[], Return>(
    fn: (...args: Args) => Promise<Return>,
    context?: string,
  ): (...args: Args) => Promise<Return | null> {
    return async (...args: Args): Promise<Return | null> => {
      try {
        return await fn(...args);
      } catch (error) {
        handleError(error, context);
        return null;
      }
    };
  }

  return {
    parseError,
    handleError,
    safeFetch,
    withErrorHandling,
  };
}

// Type guards
function isAxiosError(error: unknown): error is AxiosError {
  return (
    typeof error === "object" &&
    error !== null &&
    "isAxiosError" in error &&
    (error as Record<string, unknown>).isAxiosError === true
  );
}

function isFetchError(error: unknown): error is { message: string } {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as Record<string, unknown>).message === "string"
  );
}

function isObjectWithMessage(error: unknown): error is { message: string } {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as Record<string, unknown>).message === "string"
  );
}
