import { trackingService } from '../services/trackingService';

export const useRecommendationTracking = () => {
  const trackRecommendationClick = (productId: string, recommendationType: string) => {
    trackingService.track('click', window.location.pathname, {
      productId,
      recommendationType,
      context: 'recommendation_widget'
    });
  };

  const trackRecommendationImpression = (recommendationId: string) => {
    trackingService.track('hover', window.location.pathname, {
      recommendationId,
      context: 'recommendation_view'
    });
  };

  return { trackRecommendationClick, trackRecommendationImpression };
};
