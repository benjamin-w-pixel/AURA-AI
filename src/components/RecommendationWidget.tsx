import React from 'react';
import type { Recommendation } from '../types/recommendations';
import { useRecommendationTracking } from '../hooks/useRecommendationTracking';
import styles from './RecommendationWidget.module.css';

interface RecommendationWidgetProps {
  recommendation: Recommendation;
}

export const RecommendationWidget: React.FC<RecommendationWidgetProps> = ({ recommendation }) => {
  const { trackRecommendationClick } = useRecommendationTracking();

  return (
    <div className={styles.widget}>
      <header className={styles.header}>
        <h4 className={styles.title}>{recommendation.title}</h4>
        <p className={styles.description}>{recommendation.description}</p>
      </header>
      
      <div className={styles.products}>
        {recommendation.products.map((product) => (
          <div 
            key={product.id} 
            className={styles.productCard}
            onClick={() => trackRecommendationClick(product.id, recommendation.type)}
          >
            <div className={styles.imageWrapper}>
              <img src={product.image} alt={product.name} className={styles.image} />
              <div className={styles.badge}>{recommendation.type}</div>
            </div>
            <div className={styles.info}>
              <span className={styles.productName}>{product.name}</span>
              <span className={styles.productPrice}>${product.price}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
