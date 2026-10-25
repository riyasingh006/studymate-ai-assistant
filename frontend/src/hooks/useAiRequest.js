import { useCallback, useState } from 'react';

// Manages the lifecycle of a backend request.
//
// State:
//   status: 'idle' | 'loading' | 'success' | 'error'
//   data / error
//
// `run` re-invokes the async function with the given arguments. Because the
// same function is reused for retries, one `run` call works for both the
// initial "Generate" and the "Retry" action.
export function useAiRequest(asyncFn) {
  const [state, setState] = useState({
    status: 'idle',
    data: null,
    error: null,
  });

  const run = useCallback(
    async (...args) => {
      setState({ status: 'loading', data: null, error: null });
      try {
        const data = await asyncFn(...args);
        setState({ status: 'success', data, error: null });
        return data;
      } catch (err) {
        setState({
          status: 'error',
          data: null,
          error: err instanceof Error ? err : new Error('Something went wrong.'),
        });
        return null;
      }
    },
    [asyncFn]
  );

  const reset = useCallback(() => {
    setState({ status: 'idle', data: null, error: null });
  }, []);

  return { ...state, run, reset };
}