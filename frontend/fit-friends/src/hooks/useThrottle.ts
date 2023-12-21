import { useRef, WheelEvent} from 'react';

export const useThrottle = (callback: (evt: WheelEvent<HTMLUListElement>) => void, delay: number) => {
  const lastCall = useRef(0);

  const throttledFunction = (evt: WheelEvent<HTMLUListElement>) => {
    const now = Date.now();
    if (now - lastCall.current >= delay) {
      callback(evt);
      lastCall.current = now;
    }
  };

  return throttledFunction;
};
