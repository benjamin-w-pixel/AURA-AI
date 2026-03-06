import type { Recommendation, Product } from '../types/recommendations';
import { apiService } from './apiService';

class RecommendationService {
  async getPersonalizedRecommendations(): Promise<Recommendation[]> {
    try {
      return await apiService.getRecommendations();
    } catch (e) {
      console.error('RecommendationService: Failed to fetch from backend', e);
      return [];
    }
  }

  async getTrendingProducts(): Promise<Product[]> {
    // Basic fallback for now
    return [];
  }
}

export const recommendationService = new RecommendationService();
