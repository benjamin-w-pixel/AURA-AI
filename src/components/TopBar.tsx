import React, { useState, useEffect } from 'react';
import { Bell, Search, User, X, AlertTriangle, TrendingUp, Info } from 'lucide-react';
import { apiService } from '../services/apiService';
import styles from './TopBar.module.css';
import clsx from 'clsx';

export const TopBar: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifs, setShowNotifs] = useState(false);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const data = await apiService.getNotifications();
      setNotifications(data);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await apiService.markNotificationAsRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));
    } catch (err) {
      console.error("Failed to mark notification as read", err);
    }
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const products = await apiService.getProducts();
        const filtered = products.filter((p: any) => 
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase())
        );
        setResults(filtered);
      } catch (err) {
        console.error("Search error", err);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'alert': return <AlertTriangle size={18} />;
      case 'recommendation': return <TrendingUp size={18} />;
      default: return <Info size={18} />;
    }
  };

  return (
    <header className={styles.topBar}>
      <div className={styles.searchWrapper}>
        <div className={styles.search}>
          <Search size={18} className={styles.searchIcon} />
          <input 
            type="text" 
            placeholder="Search products or categories..." 
            className={styles.searchInput}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button className={styles.clearBtn} onClick={() => setQuery('')}>
              <X size={16} />
            </button>
          )}
        </div>

        {query.length >= 2 && (
          <div className={styles.searchResults}>
            {isSearching ? (
              <div className={styles.searchStatus}>Searching...</div>
            ) : results.length > 0 ? (
              results.map((item) => (
                <div key={item.id} className={styles.searchItem}>
                  <img src={item.image} alt="" className={styles.searchItemImg} />
                  <div className={styles.searchItemInfo}>
                    <span className={styles.searchItemName}>{item.name}</span>
                    <span className={styles.searchItemCat}>{item.category}</span>
                  </div>
                  <span className={styles.searchItemPrice}>${item.price}</span>
                </div>
              ))
            ) : (
              <div className={styles.searchStatus}>No products found</div>
            )}
          </div>
        )}
      </div>
      
      <div className={styles.actions}>
        <div className={styles.notificationWrapper}>
          <button 
            className={styles.iconButton} 
            onClick={() => setShowNotifs(!showNotifs)}
          >
            <Bell size={20} />
            {unreadCount > 0 && <span className={styles.notificationDot} />}
          </button>

          {showNotifs && (
            <div className={styles.notificationDropdown}>
              <div className={styles.notifHeader}>
                <h3>Notifications</h3>
                {unreadCount > 0 && <span className={styles.notifCount}>{unreadCount} New</span>}
              </div>
              <div className={styles.notifList}>
                {notifications.length > 0 ? (
                  notifications.map((n) => (
                    <div 
                      key={n.id} 
                      className={clsx(styles.notifItem, n.unread && styles.unread)}
                      onClick={() => handleMarkAsRead(n.id)}
                    >
                      <div className={clsx(styles.notifIcon, styles[n.type])}>
                        {getNotifIcon(n.type)}
                      </div>
                      <div className={styles.notifContent}>
                        <span className={styles.notifTitle}>{n.title}</span>
                        <span className={styles.notifMessage}>{n.message}</span>
                        <span className={styles.notifTime}>{n.time}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className={styles.emptyNotifs}>No notifications yet.</div>
                )}
              </div>
              <div className={styles.footer}>
                <button className={styles.viewAll}>View all activity</button>
              </div>
            </div>
          )}
        </div>
        
        <div className={styles.profile}>
          <div className={styles.avatar}>
            <User size={20} />
          </div>
          <div className={styles.profileInfo}>
            <span className={styles.profileName}>Admin</span>
            <span className={styles.profileRole}>Store Owner</span>
          </div>
        </div>
      </div>
    </header>
  );
};
