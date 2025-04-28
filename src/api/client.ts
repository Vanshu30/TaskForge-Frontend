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
    const response = await axios<T>({
      url: `${BASE_URL}${endpoint}`,
      method: 'GET', // default method if none is provided
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      ...options,
    });

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const errorData = error.response?.data as ApiErrorResponse | undefined;
      const message = errorData?.message || error.message || 'API request failed';
      console.error('API Request Error:', message);
      throw new Error(message);
    } else if (error instanceof Error) {
      console.error('API Request Error:', error.message);
      throw new Error(error.message || 'API request failed');
    } else {
      console.error('API Request Error:', String(error));
      throw new Error('API request failed');
    }
  }
}
