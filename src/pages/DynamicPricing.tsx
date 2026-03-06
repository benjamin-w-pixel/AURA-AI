import React, { useState, useEffect } from 'react';
import { pricingService } from '../services/pricingService';
import type { PricingTrend } from '../types/pricing';
import { TrendingUp, TrendingDown, Users, Globe, CheckCircle2, AlertCircle } from 'lucide-react';
import styles from './DynamicPricing.module.css';

export const DynamicPricingPage: React.FC = () => {
  const [trends, setTrends] = useState<PricingTrend[]>([]);

  useEffect(() => {
    const fetchTrends = async () => {
      const data = await pricingService.getPricingTrends();
      setTrends(data);
    };
    fetchTrends();
  }, []);

  const handleApplyPrice = async (productId: string) => {
    pricingService.applySuggestedPrice(productId);
    const data = await pricingService.getPricingTrends();
    setTrends(data);
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Dynamic Pricing</h1>
          <p className={styles.subtitle}>AI-driven price optimization based on market demand and competitor data.</p>
        </div>
        <div className={styles.headerActions}>
           <div className={styles.statusBadge}>
             <span className={styles.pulse}></span>
             ML Model: Active
           </div>
        </div>
      </header>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ color: 'var(--accent-primary)' }}><Globe size={24} /></div>
          <div className={styles.statInfo}>
             <span className={styles.statLabel}>Market Coverage</span>
             <span className={styles.statValue}>12 Competitors</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ color: 'var(--success)' }}><TrendingUp size={24} /></div>
          <div className={styles.statInfo}>
             <span className={styles.statLabel}>Avg. Margin Lift</span>
             <span className={styles.statValue}>+4.2%</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ color: 'var(--accent-vibrant)' }}><Users size={24} /></div>
          <div className={styles.statInfo}>
             <span className={styles.statLabel}>Demand Factor</span>
             <span className={styles.statValue}>High (8.4/10)</span>
          </div>
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Product</th>
              <th>Current Price</th>
              <th>Demand</th>
              <th>Competitors</th>
              <th>AI Suggested</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {trends.map((trend) => (
              <tr key={trend.productId}>
                <td>
                  <div className={styles.productCell}>
                    <strong>{trend.productName}</strong>
                    <span>ID: {trend.productId}</span>
                  </div>
                </td>
                <td>${trend.currentPrice}</td>
                <td>
                  <span className={`${styles.demandBadge} ${styles[trend.demandLevel]}`}>
                    {trend.demandLevel}
                  </span>
                </td>
                <td>
                  <div className={styles.competitorList}>
                    {trend.competitors.map((comp, idx) => (
                      <div key={idx} className={styles.competitorItem} title={`Checked ${new Date(comp.lastChecked).toLocaleTimeString()}`}>
                        <span>{comp.competitorName}</span>
                        <strong>${comp.price}</strong>
                      </div>
                    ))}
                  </div>
                </td>
                <td>
                   <div className={styles.suggestionCell}>
                      <span className={trend.suggestedPrice > trend.currentPrice ? styles.priceUp : styles.priceDown}>
                        ${trend.suggestedPrice}
                        {trend.suggestedPrice > trend.currentPrice ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                      </span>
                   </div>
                </td>
                <td>
                   <button 
                     className={styles.applyBtn} 
                     disabled={trend.currentPrice === trend.suggestedPrice}
                     onClick={() => handleApplyPrice(trend.productId)}
                   >
                     {trend.currentPrice === trend.suggestedPrice ? (
                        <>
                          <CheckCircle2 size={16} />
                          Applied
                        </>
                     ) : (
                        <>
                          <AlertCircle size={16} />
                          Apply New
                        </>
                     )}
                   </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
