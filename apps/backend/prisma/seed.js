import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@propgroup.com' },
    update: {},
    create: {
      email: 'admin@propgroup.com',
      password: adminPassword,
      name: 'Admin User',
      role: 'ADMIN'
    }
  });

  // Create agent user
  const agentPassword = await bcrypt.hash('agent123', 10);
  const agent = await prisma.user.upsert({
    where: { email: 'agent@propgroup.com' },
    update: {},
    create: {
      email: 'agent@propgroup.com',
      password: agentPassword,
      name: 'John Agent',
      role: 'AGENT'
    }
  });

  // Create sample properties
  const properties = [
    {
      title: 'Modern Downtown Penthouse',
      description: 'Luxurious penthouse with panoramic city views',
      price: 850000,
      location: 'Downtown, Metropolitan City',
      address: '123 Skyline Ave, Downtown',
      type: 'APARTMENT',
      bedrooms: 3,
      bathrooms: 2,
      area: 2200,
      badge: 'Featured',
      features: ['City View', 'Gym', 'Pool', 'Parking', 'Security'],
      userId: agent.id
    },
    {
      title: 'Luxury Family Home',
      description: 'Spacious family home in quiet neighborhood',
      price: 1200000,
      location: 'Suburban Heights',
      address: '456 Oak Street, Suburban Heights',
      type: 'HOUSE',
      bedrooms: 4,
      bathrooms: 3,
      area: 3500,
      badge: 'New',
      features: ['Garden', 'Garage', 'Modern Kitchen', 'Home Office'],
      userId: agent.id
    },
    {
      title: 'Contemporary Condo',
      description: 'Modern condo with river views',
      price: 450000,
      location: 'Riverside District',
      address: '789 River Road, Riverside',
      type: 'CONDO',
      bedrooms: 2,
      bathrooms: 2,
      area: 1400,
      badge: 'Hot Deal',
      features: ['River View', 'Balcony', 'Modern Appliances'],
      userId: agent.id
    },
    {
      title: 'Commercial Office Space',
      description: 'Prime office space in business district',
      price: 2500000,
      location: 'Business District',
      address: '100 Commerce Tower, Business District',
      type: 'COMMERCIAL',
      bedrooms: 0,
      bathrooms: 4,
      area: 8000,
      badge: 'Investment',
      features: ['Prime Location', 'Parking', 'Meeting Rooms', 'Reception Area'],
      userId: agent.id
    },
    {
      title: 'Waterfront Villa',
      description: 'Exclusive waterfront property with private beach',
      price: 3200000,
      location: 'Coastal Area',
      address: '1 Beach Road, Coastal Area',
      type: 'HOUSE',
      bedrooms: 5,
      bathrooms: 4,
      area: 4800,
      badge: 'Luxury',
      features: ['Beach Access', 'Pool', 'Guest House', 'Boat Dock'],
      userId: agent.id
    },
    {
      title: 'Urban Loft',
      description: 'Trendy loft in arts district',
      price: 680000,
      location: 'Arts District',
      address: '321 Creative Way, Arts District',
      type: 'APARTMENT',
      bedrooms: 2,
      bathrooms: 1,
      area: 1800,
      badge: 'Trendy',
      features: ['High Ceilings', 'Open Plan', 'Artist Community'],
      userId: agent.id
    }
  ];

  for (const property of properties) {
    await prisma.property.create({
      data: property
    });
  }

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
