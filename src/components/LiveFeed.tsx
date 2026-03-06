import React, { useEffect, useState } from 'react';
import { trackingService } from '../services/trackingService';
import type { TrackingEvent } from '../types/tracking';
import styles from './LiveFeed.module.css';

export const LiveFeed: React.FC = () => {
  const [events, setEvents] = useState<TrackingEvent[]>([]);

  useEffect(() => {
    // Initial events
    setEvents(trackingService.getEvents());

    // Subscribe to new events
    const unsubscribe = trackingService.subscribe((newEvent) => {
      setEvents((prev) => [newEvent, ...prev].slice(0, 10));
    });

    return () => unsubscribe();
  }, []);

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'page_view': return '👁️';
      case 'click': return '🖱️';
      case 'add_to_cart': return '🛒';
      case 'purchase': return '💰';
      default: return '⚡';
    }
  };

  return (
    <div className={styles.feed}>
      {events.length === 0 ? (
        <div className={styles.empty}>
          <p>Waiting for behavior data...</p>
        </div>
      ) : (
        events.map((event) => (
          <div key={event.id} className={styles.item}>
            <div className={styles.icon}>{getEventIcon(event.type)}</div>
            <div className={styles.content}>
              <p className={styles.text}>
                <strong>{event.userId}</strong> {event.type.replace('_', ' ')} on <em>{event.path}</em>
              </p>
              <span className={styles.time}>{new Date(event.timestamp).toLocaleTimeString()}</span>
            </div>
          </div>
        ))
      )}
    </div>
  );
};
