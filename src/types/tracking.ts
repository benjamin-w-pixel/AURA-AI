export type EventType = 'page_view' | 'click' | 'add_to_cart' | 'purchase' | 'hover';

export interface TrackingEvent {
  id: string;
  type: EventType;
  path: string;
  timestamp: number;
  metadata?: Record<string, any>;
  userId?: string;
}

export interface UserSession {
  id: string;
  startTime: number;
  events: TrackingEvent[];
}
