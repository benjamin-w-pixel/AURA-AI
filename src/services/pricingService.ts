import type { PricingTrend } from '../types/pricing';
import { apiService } from './apiService';

class PricingService {
  private trends: PricingTrend[] = [];

  async getPricingTrends() {
    try {
      this.trends = await apiService.getPricingTrends();
      return [...this.trends];
    } catch (e) {
      console.error('PricingService: Failed to fetch from backend', e);
      return [];
    }
  }

  applySuggestedPrice(productId: string) {
    const trend = this.trends.find(t => t.productId === productId);
    if (trend) {
      trend.currentPrice = trend.suggestedPrice;
    }
  }
}

export const pricingService = new PricingService();
