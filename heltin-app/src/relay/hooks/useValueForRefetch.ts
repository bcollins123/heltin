/**
 *
 * relay/useValueForRefetch
 *
 */

import { useEffect, useRef } from 'react';
import { RelayRefetchProp } from 'react-relay';
import { useDeepMemoOnValue, useSafeState } from '@domonda/react-plumb';

/** Paginates relay when the `value` changes. */
export function useValueForRefetch<T>(value: T, relay: RelayRefetchProp): [boolean, Error | null] {
  const memoValue = useDeepMemoOnValue(value);
  const [{ loading, error }, setState] = useSafeState<{ loading: boolean; error: Error | null }>({
    loading: false,
    error: null,
  });

  // we ignore refetching on init because that is handled by the `QueryRenderer`
  const initRef = useRef(true);
  useEffect(() => {
    if (initRef.current) {
      initRef.current = false;
      return;
    }

    setState({ loading: true, error: null });

    const disposable = relay.refetch(memoValue, undefined, (err) =>
      setState({ loading: false, error: err || null }),
    );

    return () => {
      if (disposable) {
        disposable.dispose();
      }
    };
  }, [memoValue]);

  return [loading, error];
}
