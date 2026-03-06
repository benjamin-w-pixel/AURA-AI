import React, { useState, useEffect } from 'react';
import { 
  Users, 
  ShoppingBag, 
  ArrowUpRight, 
  ArrowDownRight,
  TrendingUp,
  Activity
} from 'lucide-react';
import { useTracker } from '../hooks/useTracker';
import { apiService } from '../services/apiService';
import { LiveFeed } from '../components/LiveFeed';
import styles from './DashboardHome.module.css';

export const DashboardHome: React.FC = () => {
  useTracker();
  const [eventCount, setEventCount] = useState(0);

  useEffect(() => {
    const fetchCount = async () => {
      const events = await apiService.getEvents();
      setEventCount(events.length);
    };
    fetchCount();
  }, []);

  const stats = [
    { 
      label: 'Live Active Events', 
      value: eventCount.toString(), 
      change: '+12.5%', 
      trend: 'up', 
      icon: Users,
      color: '#6366f1'
    },
    { 
      label: 'Recommendation Clicks', 
      value: '8,432', 
      change: '+18.2%', 
      trend: 'up', 
      icon: Activity,
      color: '#8b5cf6'
    },
    { 
      label: 'Conversion Rate', 
      value: '3.42%', 
      change: '-0.4%', 
      trend: 'down', 
      icon: ShoppingBag,
      color: '#ec4899'
    },
    { 
      label: 'Revenue Uplift', 
      value: '$12,400', 
      change: '+24.1%', 
      trend: 'up', 
      icon: TrendingUp,
      color: '#10b981'
    },
  ];

  const handleDownloadReport = () => {
    const csvContent = "Category,Current Value,Growth\n" + 
      stats.map(s => `${s.label},${s.value.replace(',', '')},${s.change}`).join("\n");
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `aura_ai_analytics_${new Date().toISOString().split('T')[0]}.csv`);
    link.click();
  };

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Engine Overview</h1>
          <p className={styles.subtitle}>Real-time performance of your AI personalization.</p>
        </div>
        <button className={styles.btnPrimary} onClick={handleDownloadReport}>Download Report</button>
      </header>
      
      <div className={styles.statsGrid}>
        {stats.map((stat, idx) => (
          <div key={idx} className={styles.statCard}>
            <div className={styles.statHeader}>
              <div 
                className={styles.statIcon} 
                style={{ backgroundColor: `${stat.color}20`, color: stat.color }}
              >
                <stat.icon size={22} />
              </div>
              <div className={`${styles.badge} ${styles[stat.trend]}`}>
                {stat.trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {stat.change}
              </div>
            </div>
            <div className={styles.statContent}>
              <span className={styles.statLabel}>{stat.label}</span>
              <span className={styles.statValue}>{stat.value}</span>
            </div>
          </div>
        ))}
      </div>
      
      <div className={styles.mainGrid}>
        <div className={styles.chartSection}>
          <div className={styles.sectionHeader}>
            <h3>Behavior Trends</h3>
            <div className={styles.tabs}>
              <button className={styles.tabActive}>Views</button>
              <button className={styles.tab}>Clicks</button>
              <button className={styles.tab}>Sales</button>
            </div>
          </div>
          <div className={styles.chartPlaceholder}>
            <div className={styles.mockChart}>
              {[40, 70, 45, 90, 65, 80, 55, 95, 75, 85, 60, 100].map((h, i) => (
                <div 
                  key={i} 
                  className={styles.chartBar} 
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </div>
        </div>
        
        <div className={styles.recentActivity}>
          <div className={styles.sectionHeader}>
            <h3>Live Behavior Feed</h3>
          </div>
          <LiveFeed />
        </div>
      </div>
    </div>
  );
};
