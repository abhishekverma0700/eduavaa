/**
 * API Utilities - Centralized error handling, timeouts, and retry logic
 * Ensures all API calls are resilient and provide user feedback
 */

export interface FetchOptions extends RequestInit {
  timeout?: number;
  retries?: number;
  onError?: (error: string) => void;
}

/**
 * API call with timeout, error handling, and optional retry
 * @param url - API endpoint
 * @param options - Fetch options including timeout, retries, and error callback
 * @returns Parsed JSON response or throws error
 */
export async function fetchWithTimeout(
  url: string,
  options: FetchOptions = {}
): Promise<any> {
  const {
    timeout = 10000, // 10 second default timeout
    retries = 0,
    onError = undefined,
    ...fetchOptions
  } = options;

  let lastError: Error | null = null;

  // Retry loop (0 retries = 1 attempt, 1 retry = 2 attempts, etc.)
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(url, {
        ...fetchOptions,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Handle non-200 responses gracefully
      if (!response.ok) {
        const contentType = response.headers.get("content-type");
        let errorMessage = `API Error: ${response.status}`;

        try {
          if (contentType?.includes("application/json")) {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
          }
        } catch {
          // If response isn't JSON, use status text
          errorMessage = response.statusText || errorMessage;
        }

        throw new Error(errorMessage);
      }

      // Parse JSON response
      const data = await response.json();
      return data;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // Check if it's a timeout or network error
      const isTimeout =
        lastError.name === "AbortError" ||
        lastError.message.includes("timeout");
      const isNetworkError =
        lastError.message.includes("Failed to fetch") ||
        lastError.message.includes("NetworkError");

      // Only retry on network/timeout errors, not on API errors
      if (
        attempt < retries &&
        (isNetworkError || isTimeout)
      ) {
        console.warn(
          `⚠️ API call failed (attempt ${attempt + 1}), retrying... (${lastError.message})`
        );
        // Exponential backoff: 100ms, 200ms, 400ms, etc.
        await new Promise((resolve) =>
          setTimeout(resolve, Math.pow(2, attempt) * 100)
        );
        continue;
      }

      // All retries exhausted or API error - break loop
      break;
    }
  }

  // All attempts failed
  if (lastError) {
    const errorMessage = lastError.message || "Network error. Please try again.";
    console.error(`❌ API call failed after retries: ${errorMessage}`);

    if (onError) {
      onError(errorMessage);
    }

    throw lastError;
  }

  throw new Error("Unknown error occurred");
}

/**
 * Safe API call wrapper that catches errors and shows toast notifications
 * @param url - API endpoint
 * @param options - Fetch options
 * @param showToast - Toast notification function
 * @returns Parsed response or empty default
 */
export async function fetchSafe<T = any>(
  url: string,
  options: FetchOptions = {},
  showToast?: (title: string, description: string, variant?: string) => void
): Promise<T | null> {
  try {
    return await fetchWithTimeout(url, options);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Something went wrong. Please try again.";

    console.error("API Error:", message);

    if (showToast) {
      showToast("Error", message, "destructive");
    }

    return null;
  }
}

/**
 * Defensive default data - returns empty/null safe values when API fails
 */
export const SAFE_DEFAULTS = {
  emptyArray: [] as any[],
  emptyString: "",
  falseBoolean: false,
  zeroNumber: 0,
  nullValue: null,
};

/**
 * Safely extract array from response
 */
export function safeArray<T = any>(data: unknown, fallback: T[] = []): T[] {
  if (Array.isArray(data)) return data;
  return fallback;
}

/**
 * Safely extract object from response
 */
export function safeObject<T = any>(
  data: unknown,
  fallback: T = {} as T
): T {
  if (data && typeof data === "object" && !Array.isArray(data)) return data as T;
  return fallback;
}

/**
 * Safely extract string value
 */
export function safeString(
  data: unknown,
  fallback: string = ""
): string {
  if (typeof data === "string") return data;
  return fallback;
}

/**
 * Safely extract number value
 */
export function safeNumber(data: unknown, fallback: number = 0): number {
  if (typeof data === "number" && !isNaN(data)) return data;
  return fallback;
}
