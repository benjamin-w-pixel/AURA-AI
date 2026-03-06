import React from 'react';
import { 
  Shield, 
  Database, 
  Webhook, 
  Cpu
} from 'lucide-react';
import styles from './Settings.module.css';

export const SettingsPage: React.FC = () => {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Engine Settings</h1>
          <p className={styles.subtitle}>Configure AI parameters and system integrations.</p>
        </div>
      </header>

      <div className={styles.grid}>
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <Cpu className={styles.icon} size={20} />
            <h3>AI Configuration</h3>
          </div>
          <div className={styles.formGroup}>
            <label>Recommendation Alpha</label>
            <input type="range" min="0" max="1" step="0.1" defaultValue="0.7" />
            <div className={styles.rangeLabels}>
              <span>Conservative</span>
              <span>Exploratory</span>
            </div>
          </div>
          <div className={styles.formGroup}>
             <label>Model Retraining Frequency</label>
             <select defaultValue="daily">
               <option value="hourly">Every Hour</option>
               <option value="daily">Daily</option>
               <option value="weekly">Weekly</option>
             </select>
          </div>
        </section>

        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <Shield className={styles.icon} size={20} />
            <h3>Privacy & Security</h3>
          </div>
          <div className={styles.toggleGroup}>
            <div className={styles.toggleInfo}>
              <strong>Anonymize User Data</strong>
              <p>Remove PII before training models.</p>
            </div>
            <input type="checkbox" defaultChecked />
          </div>
          <div className={styles.toggleGroup}>
            <div className={styles.toggleInfo}>
              <strong>GDPR Compliance Mode</strong>
              <p>Strict data retention policies.</p>
            </div>
            <input type="checkbox" defaultChecked />
          </div>
        </section>

        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <Webhook className={styles.icon} size={20} />
            <h3>Integrations</h3>
          </div>
          <div className={styles.integrationItem}>
            <span>Shopify Store</span>
            <span className={styles.statusConnected}>Connected</span>
          </div>
          <div className={styles.integrationItem}>
            <span>Klaviyo</span>
            <span className={styles.statusDisconnected}>Disconnected</span>
          </div>
          <button className={styles.btnSecondary}>Add Integration</button>
        </section>

        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <Database className={styles.icon} size={20} />
            <h3>System Status</h3>
          </div>
          <div className={styles.statusGrid}>
             <div className={styles.statusItem}>
               <span className={styles.label}>Latency</span>
               <span className={styles.value}>42ms</span>
             </div>
             <div className={styles.statusItem}>
               <span className={styles.label}>Uptime</span>
               <span className={styles.value}>99.98%</span>
             </div>
          </div>
        </section>
      </div>
    </div>
  );
};
