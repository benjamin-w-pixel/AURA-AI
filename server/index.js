const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Mock Data
let events = [];

function generateInitialData() {
  const actions = ['page_view', 'click', 'add_to_cart', 'purchase', 'hover'];
  const paths = ['/home', '/products', '/cart', '/checkout', '/products/1', '/products/3', '/products/8'];
  for (let i = 0; i < 45; i++) {
    events.push({
      id: Math.random().toString(36).substring(2, 11),
      type: actions[Math.floor(Math.random() * actions.length)],
      path: paths[Math.floor(Math.random() * paths.length)],
      timestamp: Date.now() - Math.floor(Math.random() * 86400000), // Past 24 hours
      userId: `user_${Math.floor(Math.random() * 1000)}`
    });
  }
}
generateInitialData();

let products = [
  { id: '1', name: 'Ultra Boost Sneakers', price: 120, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff', category: 'Footwear' },
  { id: '2', name: 'Leather Tech Backpack', price: 85, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62', category: 'Accessories' },
  { id: '3', name: 'Wireless Headphones', price: 250, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e', category: 'Electronics' },
  { id: '4', name: 'Minimalist Watch', price: 150, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30', category: 'Accessories' },
  { id: '5', name: 'Smart Home Hub', price: 199, image: 'https://images.unsplash.com/photo-1558089687-f282ffcbc126', category: 'Electronics' },
  { id: '6', name: 'Yoga Mat Pro', price: 45, image: 'https://images.unsplash.com/photo-1601122501099-b1d7d5d282dd', category: 'Fitness' },
  { id: '7', name: 'Ceramic Coffee Mug', price: 24, image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d', category: 'Home' },
  { id: '8', name: 'Mechanical Keyboard', price: 130, image: 'https://images.unsplash.com/photo-1595225476474-87563907a212', category: 'Electronics' },
  { id: '9', name: 'Classic Sunglasses', price: 65, image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083', category: 'Accessories' },
  { id: '10', name: 'Running Jacket', price: 95, image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7', category: 'Apparel' }
];

// Routes
app.get('/', (req, res) => {
  res.send(`
    <body style="background: #0a0a0c; color: #fff; font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0;">
      <div style="text-align: center; border: 1px solid #333; padding: 2rem; border-radius: 1rem; background: #141417;">
        <h1 style="color: #6366f1;">Aura AI API</h1>
        <p style="color: #a1a1aa;">The engine is active and ready.</p>
        <hr style="border: 0; border-top: 1px solid #333; margin: 1.5rem 0;">
        <p style="font-size: 0.875rem;">Try <a href="/api/health" style="color: #ec4899; text-decoration: none;">/api/health</a> or <a href="/api/products" style="color: #ec4899; text-decoration: none;">/api/products</a></p>
      </div>
    </body>
  `);
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'Engine Active', timestamp: Date.now() });
});

app.post('/api/track', (req, res) => {
  const event = {
    ...req.body,
    id: Math.random().toString(36).substring(2, 11),
    timestamp: Date.now()
  };
  events.unshift(event);
  if (events.length > 100) events.pop();
  res.status(201).json(event);
});

app.get('/api/events', (req, res) => {
  res.json(events);
});

app.get('/api/products', (req, res) => {
  res.json(products);
});

app.get('/api/recommendations', (req, res) => {
  res.json([
    {
      id: 'rec_1',
      title: 'For Your Style',
      description: 'Based on your recent views.',
      products: [products[0], products[3], products[8]],
      type: 'personalized'
    },
    {
      id: 'rec_2',
      title: 'Frequently Bought Together',
      description: 'Customers who viewed these also purchased...',
      products: [products[1], products[2], products[7]],
      type: 'related'
    },
    {
      id: 'rec_3',
      title: 'Trending Electronics',
      description: 'High demand in this category over the last 24h.',
      products: [products[4], products[7], products[2]],
      type: 'trending'
    }
  ]);
});

app.get('/api/pricing/trends', (req, res) => {
  res.json([
    {
      productId: '1',
      productName: 'Ultra Boost Sneakers',
      currentPrice: 120,
      suggestedPrice: 115,
      demandLevel: 'high',
      competitors: [
        { competitorName: 'FootLocker', price: 118, lastChecked: Date.now() - 3600000 },
        { competitorName: 'ShoePalace', price: 114, lastChecked: Date.now() - 7200000 }
      ]
    },
    {
      productId: '3',
      productName: 'Wireless Headphones',
      currentPrice: 250,
      suggestedPrice: 265,
      demandLevel: 'high',
      competitors: [
        { competitorName: 'BestBuy', price: 270, lastChecked: Date.now() - 1800000 },
        { competitorName: 'Walmart', price: 268, lastChecked: Date.now() - 5400000 }
      ]
    },
    {
      productId: '8',
      productName: 'Mechanical Keyboard',
      currentPrice: 130,
      suggestedPrice: 125,
      demandLevel: 'medium',
      competitors: [
        { competitorName: 'Microcenter', price: 128, lastChecked: Date.now() - 1800000 },
        { competitorName: 'Amazon', price: 124, lastChecked: Date.now() - 8400000 }
      ]
    },
    {
      productId: '6',
      productName: 'Yoga Mat Pro',
      currentPrice: 45,
      suggestedPrice: 49,
      demandLevel: 'high',
      competitors: [
        { competitorName: 'Lululemon', price: 55, lastChecked: Date.now() - 1800000 },
        { competitorName: 'Target', price: 42, lastChecked: Date.now() - 5400000 }
      ]
    }
  ]);
});

// Marketing
app.get('/api/marketing/templates', (req, res) => {
  res.json([
    {
      id: 'tmpl_1',
      name: 'Standard Recovery',
      subject: 'Forgot something? We saved your cart!',
      body: 'Hi {{name}}, we noticed you left some items in your cart. Grab them now before they are gone!',
      lastEdited: Date.now() - 86400000
    },
    {
      id: 'tmpl_2',
      name: '10% Discount Offer',
      subject: 'A special gift for you!',
      body: 'Come back and finish your order to get 10% OFF. Use code: COMEBACK10',
      lastEdited: Date.now() - 172800000
    }
  ]);
});

app.get('/api/marketing/carts', (req, res) => {
  res.json([
    {
      id: 'cart_1',
      userId: 'user_842',
      items: [
        { productId: '1', name: 'Ultra Boost Sneakers', price: 120, quantity: 1, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff' },
        { productId: '10', name: 'Running Jacket', price: 95, quantity: 1, image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7' }
      ],
      totalValue: 215,
      abandonedAt: Date.now() - 3600000,
      status: 'abandoned'
    },
    {
      id: 'cart_2',
      userId: 'user_129',
      items: [
        { productId: '3', name: 'Wireless Headphones', price: 250, quantity: 1, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e' },
        { productId: '4', name: 'Minimalist Watch', price: 150, quantity: 1, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30' }
      ],
      totalValue: 400,
      abandonedAt: Date.now() - 7200000,
      status: 'email_sent'
    },
    {
      id: 'cart_3',
      userId: 'user_414',
      items: [
        { productId: '6', name: 'Yoga Mat Pro', price: 45, quantity: 2, image: 'https://images.unsplash.com/photo-1601122501099-b1d7d5d282dd' }
      ],
      totalValue: 90,
      abandonedAt: Date.now() - 14400000,
      status: 'abandoned'
    }
  ]);
});

app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`Aura AI Backend running on http://127.0.0.1:${PORT}`);
});
