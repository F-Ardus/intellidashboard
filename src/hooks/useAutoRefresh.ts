import { useEffect, useRef, useState } from 'react';

const INTERVAL_SECONDS = 30;

export function useAutoRefresh(onRefresh: () => void) {
  const [secondsLeft, setSecondsLeft] = useState(INTERVAL_SECONDS);
  const callbackRef = useRef(onRefresh);

  // Always keep the ref current without restarting the interval
  useEffect(() => {
    callbackRef.current = onRefresh;
  });

  useEffect(() => {
    const tick = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          callbackRef.current();
          return INTERVAL_SECONDS;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(tick);
  }, []);

  return { secondsLeft };
}
