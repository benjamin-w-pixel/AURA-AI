import type { TrackingEvent, EventType } from '../types/tracking';
import { apiService } from './apiService';

class TrackingService {
  private events: TrackingEvent[] = [];
  private listeners: ((event: TrackingEvent) => void)[] = [];

  constructor() {
    this.refreshEvents();
  }

  async refreshEvents() {
    try {
      this.events = await apiService.getEvents();
      this.notifyListeners(this.events[0]); // Optional: notify of latest
    } catch (e) {
      console.error('Failed to fetch events from backend');
    }
  }

  async track(type: EventType, path: string, metadata?: Record<string, any>) {
    const eventData = {
      type,
      path,
      metadata,
      userId: 'admin_user'
    };

    try {
      const event = await apiService.trackEvent(eventData);
      this.events.unshift(event);
      if (this.events.length > 100) this.events.pop();
      this.notifyListeners(event);
      return event;
    } catch (e) {
      console.error('Failed to track event on backend');
    }
  }

  getEvents() {
    return [...this.events];
  }

  subscribe(listener: (event: TrackingEvent) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners(event: TrackingEvent) {
    if (!event) return;
    this.listeners.forEach(l => l(event));
  }
}

export const trackingService = new TrackingService();
