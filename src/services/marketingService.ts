import type { AbandonedCart, EmailTemplate } from '../types/marketing';

const API_URL = 'http://127.0.0.1:5000/api';

class MarketingService {
  async getTemplates(): Promise<EmailTemplate[]> {
    try {
      const res = await fetch(`${API_URL}/marketing/templates`);
      return await res.json();
    } catch (e) {
      console.error('MarketingService: Failed to fetch templates', e);
      return [];
    }
  }

  async getAbandonedCarts(): Promise<AbandonedCart[]> {
    try {
      const res = await fetch(`${API_URL}/marketing/carts`);
      return await res.json();
    } catch (e) {
      console.error('MarketingService: Failed to fetch carts', e);
      return [];
    }
  }

  async sendRecoveryEmail(cartId: string, _templateId: string) {
    console.log(`MarketingService: Sending recovery email for cart ${cartId}`);
    // In a real app, this would be a POST request to update status
    return true;
  }
}

export const marketingService = new MarketingService();
