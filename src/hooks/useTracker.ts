import { useEffect } from 'react';
import { trackingService } from '../services/trackingService';
import type { EventType } from '../types/tracking';

export const useTracker = () => {
  const track = (type: EventType, metadata?: Record<string, any>) => {
    trackingService.track(type, window.location.pathname, metadata);
  };

  useEffect(() => {
    // Initial page view
    track('page_view');

    // Simple click listener for demo
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'BUTTON' || target.tagName === 'A') {
        track('click', { text: target.innerText });
      }
    };

    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  return { track };
};
