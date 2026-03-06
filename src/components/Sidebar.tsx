import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  ShoppingBag, 
  Mail, 
  TrendingUp, 
  Settings,
  Zap
} from 'lucide-react';
import { apiService } from '../services/apiService';
import styles from './Sidebar.module.css';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', id: 'dashboard' },
  { icon: Users, label: 'Behavior Tracking', id: 'tracking' },
  { icon: ShoppingBag, label: 'Recommendations', id: 'recommendations' },
  { icon: Mail, label: 'Email Campaigns', id: 'emails' },
  { icon: TrendingUp, label: 'Dynamic Pricing', id: 'pricing' },
  { icon: Settings, label: 'Settings', id: 'settings' },
];

interface SidebarProps {
  onNavigate: (id: string) => void;
  activePage: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ onNavigate, activePage }) => {
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        await apiService.getHealth();
        setIsOnline(true);
      } catch (e) {
        setIsOnline(false);
      }
    };
    checkHealth();
    const interval = setInterval(checkHealth, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <Zap className={styles.logoIcon} />
        <span>Aura AI</span>
      </div>
      
      <nav className={styles.nav}>
        {navItems.map((item) => (
          <button 
            key={item.id} 
            className={`${styles.navItem} ${activePage === item.id ? styles.navItemActive : ''}`}
            onClick={() => onNavigate(item.id)}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
      
      <div className={styles.footer}>
        <div className={styles.status}>
          <div className={styles.statusDot} style={{ backgroundColor: isOnline ? 'var(--success)' : 'var(--error)' }} />
          <span>{isOnline ? 'Engine Active' : 'Engine Offline'}</span>
        </div>
      </div>
    </aside>
  );
};
