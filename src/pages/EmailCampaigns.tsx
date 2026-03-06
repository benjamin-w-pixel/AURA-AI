import React, { useState, useEffect } from 'react';
import { marketingService } from '../services/marketingService';
import type { AbandonedCart, EmailTemplate } from '../types/marketing';
import { Mail, ShoppingCart, Send, Edit, TrendingUp } from 'lucide-react';
import styles from './EmailCampaigns.module.css';

export const EmailCampaignsPage: React.FC = () => {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [carts, setCarts] = useState<AbandonedCart[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const tmpls = await marketingService.getTemplates();
      const abandonedCarts = await marketingService.getAbandonedCarts();
      setTemplates(tmpls);
      setCarts(abandonedCarts);
    };
    fetchData();
  }, []);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Email Personalization</h1>
          <p className={styles.subtitle}>Automated recovery for abandoned carts and targeted campaigns.</p>
        </div>
        <button className={styles.btnPrimary}>
          <Mail size={18} />
          New Template
        </button>
      </header>

      <div className={styles.statsRow}>
        <div className={styles.miniStat}>
          <TrendingUp size={20} className={styles.statIcon} />
          <div className={styles.statInfo}>
            <span className={styles.statValue}>24.5%</span>
            <span className={styles.statLabel}>Recovery Rate</span>
          </div>
        </div>
        <div className={styles.miniStat}>
          <Mail size={20} className={styles.statIcon} />
          <div className={styles.statInfo}>
            <span className={styles.statValue}>1,204</span>
            <span className={styles.statLabel}>Emails Sent</span>
          </div>
        </div>
        <div className={styles.miniStat}>
          <ShoppingCart size={20} className={styles.statIcon} />
          <div className={styles.statInfo}>
            <span className={styles.statValue}>$8,420</span>
            <span className={styles.statLabel}>Recovered Revenue</span>
          </div>
        </div>
      </div>

      <div className={styles.grid}>
        <section className={styles.templatesSection}>
          <div className={styles.sectionHeader}>
            <h3>Ready Templates</h3>
          </div>
          <div className={styles.templateList}>
            {templates.map((tmpl) => (
              <div 
                key={tmpl.id} 
                className={`${styles.templateCard} ${selectedTemplate?.id === tmpl.id ? styles.active : ''}`}
                onClick={() => setSelectedTemplate(tmpl)}
              >
                <div className={styles.templateIcon}>
                  <Mail size={20} />
                </div>
                <div className={styles.templateInfo}>
                  <h4>{tmpl.name}</h4>
                  <p>{tmpl.subject}</p>
                </div>
                <button className={styles.iconBtn}><Edit size={16} /></button>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.cartsSection}>
          <div className={styles.sectionHeader}>
            <h3>Abandoned Carts</h3>
          </div>
          <div className={styles.cartList}>
            {carts.map((cart) => (
              <div key={cart.id} className={styles.cartItem}>
                <div className={styles.cartHeader}>
                  <div className={styles.userInfo}>
                    <strong>{cart.userId}</strong>
                    <span>{new Date(cart.abandonedAt).toLocaleTimeString()}</span>
                  </div>
                  <div className={`${styles.statusBadge} ${styles[cart.status]}`}>
                    {cart.status.replace('_', ' ')}
                  </div>
                </div>
                <div className={styles.cartProducts}>
                  {cart.items.map((item, idx) => (
                    <img key={idx} src={item.image} alt={item.name} className={styles.miniProductImg} title={item.name} />
                  ))}
                  <span className={styles.cartValue}>Total: ${cart.totalValue}</span>
                </div>
                <div className={styles.cartActions}>
                  <button className={styles.btnSecondary} disabled={cart.status === 'email_sent'}>
                    <Send size={14} />
                    {cart.status === 'email_sent' ? 'Sent' : 'Send Recovery'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {selectedTemplate && (
        <section className={styles.previewSection}>
          <div className={styles.sectionHeader}>
            <h3>Template Preview</h3>
          </div>
          <div className={styles.previewCard}>
            <div className={styles.previewSubject}>
              <strong>Subject:</strong> {selectedTemplate.subject}
            </div>
            <div className={styles.previewBody}>
              {selectedTemplate.body}
            </div>
            <div className={styles.previewFooter}>
              [Dynamic Products from Cart will appear here]
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
