import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import type { TrackingEvent } from '../types/tracking';
import { Search, Filter, Download } from 'lucide-react';
import styles from './BehaviorTracking.module.css';

export const BehaviorTrackingPage: React.FC = () => {
  const [events, setEvents] = useState<TrackingEvent[]>([]);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchEvents = async () => {
      const data = await apiService.getEvents();
      setEvents(data);
    };
    fetchEvents();
    const interval = setInterval(fetchEvents, 5000);
    return () => clearInterval(interval);
  }, []);

  const filteredEvents = events.filter(e => {
    const matchesQuery = (e.userId?.toLowerCase() || '').includes(query.toLowerCase()) || 
                        (e.path?.toLowerCase() || '').includes(query.toLowerCase());
    const matchesFilter = filter === 'all' || e.type === filter;
    return matchesQuery && matchesFilter;
  });

  const handleExportLogs = () => {
    apiService.downloadBehaviorReport();
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Behavior Tracking</h1>
          <p className={styles.subtitle}>Deep dive into user interactions and journey mapping.</p>
        </div>
        <button className={styles.btnPrimary} onClick={handleExportLogs}>
           <Download size={18} />
           Export Logs
        </button>
      </header>

      <div className={styles.controls}>
        <div className={styles.search}>
          <Search size={18} className={styles.searchIcon} />
          <input 
            type="text" 
            placeholder="Search by User ID or Path..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className={styles.filters}>
          <Filter size={18} />
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Events</option>
            <option value="page_view">Page Views</option>
            <option value="click">Clicks</option>
            <option value="hover">Hovers</option>
          </select>
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>User ID</th>
              <th>Event Type</th>
              <th>Path</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredEvents.map((event) => (
              <tr key={event.id}>
                <td>{new Date(event.timestamp).toLocaleTimeString()}</td>
                <td><code className={styles.userCode}>{event.userId}</code></td>
                <td>
                  <span className={`${styles.typeBadge} ${styles[event.type]}`}>
                    {event.type.replace('_', ' ')}
                  </span>
                </td>
                <td>{event.path}</td>
                <td>
                  <button className={styles.viewBtn}>Analyze</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
