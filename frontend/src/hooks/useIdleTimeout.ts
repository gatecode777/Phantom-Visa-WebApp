import { useEffect, useRef } from "react";

interface UseIdleTimeoutOptions {
  timeoutMinutes: number;
  onTimeout: () => void;
  enabled?: boolean;
}

/**
 * Hook to monitor user interaction and automatically trigger logout on genuine inactivity
 */
export function useIdleTimeout({
  timeoutMinutes,
  onTimeout,
  enabled = true
}: UseIdleTimeoutOptions) {
  const onTimeoutRef = useRef(onTimeout);
  onTimeoutRef.current = onTimeout;

  const timerRef = useRef<any>(null);
  const lastActivityRef = useRef<number>(Date.now());

  // Validate timeout minutes: default to 15 if invalid or missing
  const parsedMin = Number(timeoutMinutes);
  const safeMinutes = !isNaN(parsedMin) && parsedMin > 0 ? parsedMin : 15;
  const timeoutMs = safeMinutes * 60 * 1000;

  useEffect(() => {
    if (!enabled || safeMinutes <= 0) {
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }

    lastActivityRef.current = Date.now();

    const scheduleCheck = () => {
      if (timerRef.current) clearTimeout(timerRef.current);

      timerRef.current = setTimeout(() => {
        const idleDuration = Date.now() - lastActivityRef.current;
        if (idleDuration >= timeoutMs) {
          console.warn(`User idle for ${safeMinutes} minutes. Initiating automatic session logout.`);
          onTimeoutRef.current();
        } else {
          // Re-schedule for the remaining idle duration
          scheduleCheck();
        }
      }, timeoutMs);
    };

    const handleUserActivity = () => {
      lastActivityRef.current = Date.now();
    };

    // User interaction events
    const activityEvents = [
      "mousemove",
      "mousedown",
      "keydown",
      "touchstart",
      "scroll",
      "click"
    ];

    activityEvents.forEach((evt) => {
      window.addEventListener(evt, handleUserActivity, { passive: true });
    });

    scheduleCheck();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      activityEvents.forEach((evt) => {
        window.removeEventListener(evt, handleUserActivity);
      });
    };
  }, [timeoutMs, enabled, safeMinutes]);
}
