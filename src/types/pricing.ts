export interface CompetitorPrice {
  competitorName: string;
  price: number;
  lastChecked: number;
}

export interface PricingTrend {
  productId: string;
  productName: string;
  currentPrice: number;
  suggestedPrice: number;
  competitors: CompetitorPrice[];
  demandLevel: 'low' | 'medium' | 'high';
}
