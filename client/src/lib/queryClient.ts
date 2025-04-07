import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

// Enhanced error handling for API responses
async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    // Try to get a structured error message from JSON first
    let errorMessage: string;
    try {
      const errorData = await res.json();
      errorMessage = errorData.message || errorData.error || JSON.stringify(errorData);
    } catch (e) {
      // Fallback to plain text if not JSON
      errorMessage = (await res.text()) || res.statusText;
    }
    
    // Throw enriched error with status code and message
    const error = new Error(`${res.status}: ${errorMessage}`);
    (error as any).status = res.status;
    (error as any).data = { message: errorMessage };
    throw error;
  }
}

// Enhanced API request function with improved error handling
export async function apiRequest<T = any>(
  url: string,
  options?: RequestInit,
): Promise<T> {
  try {
    const res = await fetch(url, {
      ...options,
      credentials: "include",
    });

    await throwIfResNotOk(res);
    return await res.json();
  } catch (error) {
    // Log error for debugging
    console.error(`API Request Error (${options?.method || 'GET'} ${url}):`, error);
    throw error;
  }
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    try {
      const res = await fetch(queryKey[0] as string, {
        credentials: "include",
      });

      if (unauthorizedBehavior === "returnNull" && res.status === 401) {
        return null;
      }

      await throwIfResNotOk(res);
      return await res.json();
    } catch (error) {
      console.error(`Query Error (${queryKey[0]}):`, error);
      throw error;
    }
  };

// Configure Query Client with enhanced error handling
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: 60000, // Set to 1 minute instead of Infinity for better reactivity
      retry: 1, // Allow 1 retry for transient network errors
    },
    mutations: {
      retry: 1, // Allow 1 retry for mutations
      onError: (error: any) => {
        // Log all mutation errors
        console.error("Mutation error:", error);
      },
    },
  },
});
