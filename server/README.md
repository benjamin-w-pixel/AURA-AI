# Aura AI Backend (Mock)

This is a mock Express server designed to support the **Aura AI** frontend. It provides simulated real-time endpoints for user behavior tracking, product recommendations, and dynamic pricing.

## 🚀 Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run in Development**:
   ```bash
   npm run dev
   ```
   The backend will run on `http://localhost:5000`.

## 🛰️ API Endpoints

- `GET /api/health`: Check if the engine is active.
- `POST /api/track`: Log user behavior (page views, clicks).
- `GET /api/events`: Retrieve recent behavior logs.
- `GET /api/products`: List available products.
- `GET /api/recommendations`: Get AI-weighted product suggestions.
- `GET /api/pricing/trends`: Get market demand and competitor pricing data.

## 🛠️ Technology
- **Node.js**: Runtime environment.
- **Express**: Web framework.
- **TypeScript**: Type safety and better developer experience.
- **Nodemon**: Auto-restarts on file changes.
