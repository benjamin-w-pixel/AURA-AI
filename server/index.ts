import express, { type Request, type Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { Parser } from 'json2csv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

const allowedOrigin = process.env.ALLOWED_ORIGIN || '*';
app.use(cors({
  origin: allowedOrigin,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());

// Professional Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Mock Data
let events: any[] = [];

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

// Security Middleware
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = (authHeader && authHeader.split(' ')[1]) || req.query.token;

  if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token.' });
    req.user = user;
    next();
  });
};

// Auth Routes
app.post('/api/auth/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // For this demo, we'll check against env/mock
  if (email === 'admin@aura-ai.com' && password === 'password123') {
    const token = jwt.sign({ email, role: 'ADMIN' }, JWT_SECRET, { expiresIn: '8h' });
    return res.json({ token, user: { email, name: 'Admin User', role: 'ADMIN' } });
  }

  res.status(401).json({ error: 'Invalid credentials' });
});

// Routes
app.get('/', (req: Request, res: Response) => {
  res.send(`
    <body style="background: #0a0a0c; color: #fff; font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0;">
      <div style="text-align: center; border: 1px solid #333; padding: 2rem; border-radius: 1rem; background: #141417;">
        <h1 style="color: #6366f1;">Aura AI API</h1>
        <p style="color: #a1a1aa;">The engine is active and ready (v1.0.0-TS).</p>
        <hr style="border: 0; border-top: 1px solid #333; margin: 1.5rem 0;">
        <p style="font-size: 0.875rem;">Try <a href="/api/health" style="color: #ec4899; text-decoration: none;">/api/health</a> or <a href="/api/products" style="color: #ec4899; text-decoration: none;">/api/products</a></p>
      </div>
    </body>
  `);
});

// Routes
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'Engine Active', timestamp: Date.now() });
});

// Tracking Events
app.post('/api/track', (req: Request, res: Response) => {
  const event = {
    ...req.body,
    id: Math.random().toString(36).substring(2, 11),
    timestamp: Date.now()
  };
  events.unshift(event);
  if (events.length > 100) events.pop();
  res.status(201).json(event);
});

app.get('/api/events', (req: Request, res: Response) => {
  res.json(events);
});

// CSV Reports Export
app.get('/api/reports/behavior/export', authenticateToken, (req: Request, res: Response) => {
  try {
    const fields = ['id', 'type', 'path', 'timestamp', 'userId'];
    const opts = { fields };
    const parser = new Parser(opts);
    const csv = parser.parse(events);

    res.header('Content-Type', 'text/csv');
    res.attachment(`behavior-report-${Date.now()}.csv`);
    res.send(csv);
  } catch (err) {
    console.error('CSV Export Error:', err);
    res.status(500).json({ error: 'Failed to generate CSV report' });
  }
});

// Products
app.get('/api/products', async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany();
    // Map to match frontend expectations (imageUrl -> image) if needed, though they look similar
    const mappedProducts = products.map(p => ({
      ...p,
      image: p.imageUrl
    }));
    res.json(mappedProducts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});
// Recommendations
app.get('/api/recommendations', authenticateToken, async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany();
    const mappedProducts = products.map(p => ({ ...p, image: p.imageUrl }));

    res.json([
      {
        id: 'rec_1',
        title: 'For Your Style',
        description: 'Based on your recent views.',
        products: [mappedProducts[0], mappedProducts[3], mappedProducts[7]],
        type: 'personalized'
      },
      {
        id: 'rec_2',
        title: 'Frequently Bought Together',
        description: 'Customers who viewed these also purchased...',
        products: [mappedProducts[1], mappedProducts[2], mappedProducts[6]],
        type: 'related'
      },
      {
        id: 'rec_3',
        title: 'Trending Electronics',
        description: 'High demand in this category over the last 24h.',
        products: [mappedProducts[4], mappedProducts[7], mappedProducts[2]],
        type: 'trending'
      }
    ]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch recommendations' });
  }
});

// Pricing
app.get('/api/pricing/trends', authenticateToken, (req: Request, res: Response) => {
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
app.get('/api/marketing/templates', (req: Request, res: Response) => {
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

app.get('/api/marketing/carts', (req: Request, res: Response) => {
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

// Notifications
let notifications = [
  { 
    id: 'notif_1', 
    title: 'High Demand Alert', 
    message: 'Ultra Boost Sneakers are seeing 40% more traffic than usual.', 
    time: '5m ago', 
    unread: true,
    type: 'alert'
  },
  { 
    id: 'notif_2', 
    title: 'Price Opportunity', 
    message: 'AI suggests increasing the price of Wireless Headphones by 5%.', 
    time: '1h ago', 
    unread: true,
    type: 'recommendation'
  },
  { 
    id: 'notif_3', 
    title: 'Cart Abandoned', 
    message: 'User user_842 abandoned a cart worth $215.', 
    time: '2h ago', 
    unread: false,
    type: 'info'
  }
];

app.get('/api/notifications', (req: Request, res: Response) => {
  res.json(notifications);
});

app.post('/api/notifications/read', (req: Request, res: Response) => {
  const { id } = req.body;
  notifications = notifications.map(n => n.id === id ? { ...n, unread: false } : n);
  res.status(200).json({ success: true });
});

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', uptime: process.uptime() });
});

app.listen(PORT as number, '0.0.0.0', () => {
  console.log(`Aura AI Backend running on http://0.0.0.0:${PORT}`);
});
