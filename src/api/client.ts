import axios, { AxiosRequestConfig } from 'axios';

// Define interface for API error response
interface ApiErrorResponse {
  message: string;
  [key: string]: unknown;
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export async function apiRequest<T>(
  endpoint: string,
  options: AxiosRequestConfig = {}
): Promise<T> {
  try {
    const response = await axios({
      url: `${BASE_URL}${endpoint}`,
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      }
    });

    return response.data as T;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message =
        typeof error.response?.data === 'object' && 'message' in error.response.data
          ? (error.response.data as ApiErrorResponse).message
          : error.message;

      console.error('API Request Error:', message);
      throw new Error(message || 'API request failed');
    }

    console.error('API Request Error:', error instanceof Error ? error.message : String(error));
    throw new Error('API request failed');
  }
}
