import React, { useEffect, useState } from 'react';
import { recommendationService } from '../services/recommendationService';
import type { Recommendation } from '../types/recommendations';
import { RecommendationWidget } from '../components/RecommendationWidget';
import { Sparkles, BarChart3, Settings2 } from 'lucide-react';
import styles from './RecommendationsPage.module.css';

export const RecommendationsPage: React.FC = () => {
  const [recs, setRecs] = useState<Recommendation[]>([]);

  useEffect(() => {
    const fetchRecs = async () => {
      const data = await recommendationService.getPersonalizedRecommendations();
      setRecs(data);
    };
    fetchRecs();
  }, []);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>AI Recommendations</h1>
          <p className={styles.subtitle}>Optimize product discovery with personalized algorithms.</p>
        </div>
        <div className={styles.actions}>
          <button className={styles.btnSecondary}>
            <BarChart3 size={18} />
            A/B Test
          </button>
          <button className={styles.btnPrimary}>
            <Settings2 size={18} />
            Configure AI
          </button>
        </div>
      </header>

      <div className={styles.grid}>
        <div className={styles.mainCol}>
          <div className={styles.sectionTitle}>
            <Sparkles size={20} className={styles.sparkleIcon} />
            <h2>Active Recommendations</h2>
          </div>
          <div className={styles.widgetGrid}>
            {recs.map((rec) => (
              <RecommendationWidget key={rec.id} recommendation={rec} />
            ))}
          </div>
        </div>

        <div className={styles.sideCol}>
          <div className={styles.performanceCard}>
            <h3>Algorithm Health</h3>
            <div className={styles.healthMetric}>
              <span>Accuracy</span>
              <div className={styles.progressBar}><div className={styles.progressFill} style={{ width: '92%' }} /></div>
              <span>92%</span>
            </div>
            <div className={styles.healthMetric}>
              <span>Conversion</span>
              <div className={styles.progressBar}><div className={styles.progressFill} style={{ width: '18%' }} /></div>
              <span>18%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
