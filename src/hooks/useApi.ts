import { apiRequest } from '@/api';
import { useCallback, useEffect, useRef, useState } from 'react';

interface UseApiResult<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
  refetch: () => Promise<void>;
}

// Custom hook to create a stable reference for objects
function useDeepCompareMemoize<T>(value: T): T {
  const ref = useRef<T>(value);
  
  // Only update the ref if the value has changed in a meaningful way
  useEffect(() => {
    if (!deepEqual(value, ref.current)) {
      ref.current = value;
    }
  }, [value]);
  
  return ref.current;
}

// Simple deep equality function
function deepEqual(obj1: unknown, obj2: unknown): boolean {
  if (obj1 === obj2) return true;
  
  if (
    typeof obj1 !== 'object' || 
    typeof obj2 !== 'object' || 
    obj1 === null || 
    obj2 === null
  ) {
    return false;
  }
  
  // Type assertion after checking that both are objects
  const obj1AsRecord = obj1 as Record<string, unknown>;
  const obj2AsRecord = obj2 as Record<string, unknown>;
  
  const keys1 = Object.keys(obj1AsRecord);
  const keys2 = Object.keys(obj2AsRecord);
  
  if (keys1.length !== keys2.length) return false;
  
  for (const key of keys1) {
    if (!keys2.includes(key)) return false;
    if (!deepEqual(obj1AsRecord[key], obj2AsRecord[key])) return false;
  }
  
  return true;
}

export function useApi<T = unknown>(endpoint: string, options = {}): UseApiResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Create a stable reference for the options object
  const stableOptions = useDeepCompareMemoize(options);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiRequest<T>(endpoint, stableOptions);
      setData(response);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  }, [endpoint, stableOptions]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, error, loading, refetch: fetchData };
}
