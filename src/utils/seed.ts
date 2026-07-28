import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/user.model.js';
import { Campaign } from '../models/campaign.model.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/fundnova';

export const seedDatabase = async () => {
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(MONGO_URI);
      console.log('Connected to MongoDB for Database Seeding...');
    }

    // 1. Ensure a default Creator user exists
    let creator = await User.findOne({ role: 'creator' });
    if (!creator) {
      creator = await User.create({
        name: 'Sarah Vance',
        email: 'creator@fundnova.com',
        role: 'creator',
        credits: 120,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      });
      console.log('Created default creator user: creator@fundnova.com');
    }

    // 2. Clear existing test campaigns
    await Campaign.deleteMany({});
    console.log('Cleared existing campaigns.');

    // 3. Define 6 dynamic, high-quality campaigns
    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    const fortyFiveDaysFromNow = new Date(now.getTime() + 45 * 24 * 60 * 60 * 1000);

    const dynamicCampaigns = [
      {
        title: 'EcoBreathe — Solar-Powered Urban Air Purifier',
        description: 'EcoBreathe is a zero-emission, solar-powered air filtration tower designed for urban public parks and school zones. Using HEPA-14 filters and ionic technology, it neutralizes PM2.5 pollutants and returns clean oxygen to city environments.',
        goalAmount: 500,
        raisedAmount: 320,
        creator: creator._id,
        creatorName: creator.name,
        creatorEmail: creator.email,
        status: 'approved',
        category: 'Technology',
        coverImage: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800',
        deadline: thirtyDaysFromNow,
        minimumContribution: 5,
      },
      {
        title: 'NexusVR — Haptic Feedback Gloves for Medical Training',
        description: 'NexusVR introduces affordable ultra-precise haptic gloves designed for medical students to simulate complex surgical procedures in virtual reality with realistic tactile pressure feedback.',
        goalAmount: 1200,
        raisedAmount: 850,
        creator: creator._id,
        creatorName: creator.name,
        creatorEmail: creator.email,
        status: 'approved',
        category: 'Technology',
        coverImage: 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&q=80&w=800',
        deadline: fortyFiveDaysFromNow,
        minimumContribution: 10,
      },
      {
        title: 'Echoes of Silence — Independent Sci-Fi Short Film',
        description: 'A cinematic, visually arresting sci-fi short film exploring deep-space isolation and human resilience. Directed by award-winning indie filmmakers, featuring state-of-the-art visual effects and immersive sound design.',
        goalAmount: 300,
        raisedAmount: 210,
        creator: creator._id,
        creatorName: creator.name,
        creatorEmail: creator.email,
        status: 'approved',
        category: 'Creative Arts',
        coverImage: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=800',
        deadline: thirtyDaysFromNow,
        minimumContribution: 5,
      },
      {
        title: 'CareMobile — Solar Telehealth Kits for Remote Villages',
        description: 'Portable, ruggedized medical diagnostic kits equipped with satellite connectivity, digital stethoscopes, and AI diagnostic software to empower community healthcare workers in off-grid rural regions.',
        goalAmount: 800,
        raisedAmount: 450,
        creator: creator._id,
        creatorName: creator.name,
        creatorEmail: creator.email,
        status: 'approved',
        category: 'Health & Medical',
        coverImage: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800',
        deadline: fortyFiveDaysFromNow,
        minimumContribution: 10,
      },
      {
        title: 'CleanOcean — Autonomous Plastics Collector Drone',
        description: 'An autonomous, zero-emission watercraft designed to skim microplastics and floating debris from river estuaries before they enter ocean marine habitats.',
        goalAmount: 1500,
        raisedAmount: 980,
        creator: creator._id,
        creatorName: creator.name,
        creatorEmail: creator.email,
        status: 'approved',
        category: 'Community & Environment',
        coverImage: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&q=80&w=800',
        deadline: fortyFiveDaysFromNow,
        minimumContribution: 10,
      },
      {
        title: 'CodeStart — Hands-On STEM Robotics Kits for Schools',
        description: 'CodeStart is an open-source, affordable robotics kit that teaches children the fundamentals of programming, electronics, and mechanical engineering through fun interactive building modules.',
        goalAmount: 400,
        raisedAmount: 290,
        creator: creator._id,
        creatorName: creator.name,
        creatorEmail: creator.email,
        status: 'approved',
        category: 'Education',
        coverImage: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=800',
        deadline: thirtyDaysFromNow,
        minimumContribution: 5,
      },
    ];

    const seeded = await Campaign.insertMany(dynamicCampaigns);
    console.log(`Successfully seeded ${seeded.length} dynamic campaigns into MongoDB!`);
    return seeded;
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
};

if (process.argv[1]?.endsWith('seed.ts') || process.argv[1]?.endsWith('seed.js')) {
  seedDatabase().then(() => {
    console.log('Seeding process complete.');
    process.exit(0);
  }).catch((err) => {
    console.error('Seeding process failed:', err);
    process.exit(1);
  });
}
