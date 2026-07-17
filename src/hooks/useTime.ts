"use client";

import { useEffect, useRef, useCallback, useState } from "react";

export function useTime(onMagicTime: () => void) {
  const callbackRef = useRef(onMagicTime);
  const hasFiredRef = useRef(false);
  const [isMagicTime, setIsMagicTime] = useState(false);

  useEffect(() => {
    callbackRef.current = onMagicTime;
  }, [onMagicTime]);

  useEffect(() => {
    const check = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();

      // 11:11 AM (11:11) or 11:11 PM (23:11)
      const is1111 = (hours === 11 || hours === 23) && minutes === 11;

      if (is1111 && !hasFiredRef.current) {
        hasFiredRef.current = true;
        setIsMagicTime(true);
        callbackRef.current();
      } else if (!is1111) {
        // Reset so it can fire again next 11:11
        hasFiredRef.current = false;
        setIsMagicTime(false);
      }
    };

    check();
    const interval = setInterval(check, 1000);
    return () => clearInterval(interval);
  }, []);

  return { isMagicTime };
}
