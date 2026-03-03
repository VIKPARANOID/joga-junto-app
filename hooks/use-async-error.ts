import { useCallback, useState } from "react";

interface UseAsyncErrorOptions {
  timeoutMs?: number;
  retryCount?: number;
  retryDelayMs?: number;
}

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  isTimeout: boolean;
}

/**
 * Hook para gerenciar carregamento assíncrono com timeout e retry
 */
export function useAsyncError<T>(
  asyncFn: () => Promise<T>,
  options: UseAsyncErrorOptions = {}
) {
  const { timeoutMs = 10000, retryCount = 3, retryDelayMs = 1000 } = options;

  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: false,
    error: null,
    isTimeout: false,
  });

  const [retryAttempt, setRetryAttempt] = useState(0);

  const execute = useCallback(
    async (skipRetry = false) => {
      setState((prev) => ({ ...prev, loading: true, error: null, isTimeout: false }));

      try {
        // Criar promise de timeout
        const timeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => {
            reject(new Error("Request timeout"));
          }, timeoutMs);
        });

        // Correr função com timeout
        const result = await Promise.race([asyncFn(), timeoutPromise]);

        setState({
          data: result,
          loading: false,
          error: null,
          isTimeout: false,
        });

        setRetryAttempt(0);
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Unknown error");
        const isTimeout = error.message === "Request timeout";

        setState({
          data: null,
          loading: false,
          error,
          isTimeout,
        });

        // Retry automático se não atingiu limite
        if (!skipRetry && retryAttempt < retryCount) {
          setTimeout(() => {
            setRetryAttempt((prev) => prev + 1);
            execute(false);
          }, retryDelayMs);
        }
      }
    },
    [asyncFn, timeoutMs, retryCount, retryDelayMs, retryAttempt]
  );

  const retry = useCallback(() => {
    setRetryAttempt(0);
    execute(true);
  }, [execute]);

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
      isTimeout: false,
    });
    setRetryAttempt(0);
  }, []);

  return {
    ...state,
    execute,
    retry,
    reset,
    retryAttempt,
    canRetry: retryAttempt < retryCount,
  };
}

/**
 * Hook para capturar erros de rede
 */
export function useNetworkError() {
  const [networkError, setNetworkError] = useState<Error | null>(null);

  const isNetworkError = (error: Error): boolean => {
    return (
      error.message.includes("Network") ||
      error.message.includes("Failed to fetch") ||
      error.message.includes("timeout")
    );
  };

  const handleError = useCallback((error: Error) => {
    if (isNetworkError(error)) {
      setNetworkError(error);
    }
  }, []);

  const clearError = useCallback(() => {
    setNetworkError(null);
  }, []);

  return {
    networkError,
    isNetworkError,
    handleError,
    clearError,
  };
}

/**
 * Hook para retry com backoff exponencial
 */
export function useRetryWithBackoff(
  asyncFn: () => Promise<any>,
  options: UseAsyncErrorOptions = {}
) {
  const { retryCount = 3 } = options;
  const [attempt, setAttempt] = useState(0);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);

    let lastError: Error | null = null;

    for (let i = 0; i <= retryCount; i++) {
      try {
        const result = await asyncFn();
        setAttempt(0);
        setLoading(false);
        return result;
      } catch (err) {
        lastError = err instanceof Error ? err : new Error("Unknown error");
        setAttempt(i + 1);

        if (i < retryCount) {
          // Backoff exponencial: 1s, 2s, 4s, 8s...
          const delayMs = Math.pow(2, i) * 1000;
          await new Promise((resolve) => setTimeout(resolve, delayMs));
        }
      }
    }

    setError(lastError);
    setLoading(false);
    throw lastError;
  }, [asyncFn, retryCount]);

  const reset = useCallback(() => {
    setAttempt(0);
    setError(null);
    setLoading(false);
  }, []);

  return {
    execute,
    reset,
    attempt,
    error,
    loading,
    isRetrying: attempt > 0,
  };
}
