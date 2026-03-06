import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Clean existing
  await prisma.event.deleteMany();
  await prisma.product.deleteMany();
  await prisma.store.deleteMany();
  await prisma.user.deleteMany();

  // Create User
  const user = await prisma.user.create({
    data: {
      email: 'admin@aura-ai.com',
      name: 'Admin User',
      role: 'ADMIN',
    }
  });

  // Create Store
  const store = await prisma.store.create({
    data: {
      name: 'Demo E-commerce Store',
      ownerId: user.id
    }
  });

  // Create Products
  const products = [
    { name: 'Ultra Boost Sneakers', price: 120, category: 'Footwear', imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff', storeId: store.id },
    { name: 'Leather Tech Backpack', price: 85, category: 'Accessories', imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62', storeId: store.id },
    { name: 'Wireless Headphones', price: 250, category: 'Electronics', imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e', storeId: store.id },
    { name: 'Minimalist Watch', price: 150, category: 'Accessories', imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30', storeId: store.id },
    { name: 'Smart Home Hub', price: 199, category: 'Electronics', imageUrl: 'https://images.unsplash.com/photo-1558089687-f282ffcbc126', storeId: store.id },
    { name: 'Yoga Mat Pro', price: 45, category: 'Fitness', imageUrl: 'https://images.unsplash.com/photo-1601122501099-b1d7d5d282dd', storeId: store.id },
    { name: 'Ceramic Coffee Mug', price: 24, category: 'Home', imageUrl: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d', storeId: store.id },
    { name: 'Mechanical Keyboard', price: 130, category: 'Electronics', imageUrl: 'https://images.unsplash.com/photo-1595225476474-87563907a212', storeId: store.id }
  ];

  await prisma.product.createMany({
    data: products
  });

  console.log('Database seeded successfully.');
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
