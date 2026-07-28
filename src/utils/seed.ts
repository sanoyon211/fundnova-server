import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { User } from '../models/user.model';
import { Campaign } from '../models/campaign.model';
import { Contribution } from '../models/contribution.model';
import { Notification } from '../models/notification.model';

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/fundnova';

export const seedDatabase = async () => {
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(MONGO_URI);
      console.log('Connected to MongoDB for Database Seeding...');
    }

    // 1. Clear existing database collections
    await User.deleteMany({});
    await Campaign.deleteMany({});
    await Contribution.deleteMany({});
    await Notification.deleteMany({});
    console.log('Cleared existing collections (Users, Campaigns, Contributions, Notifications).');

    // 2. Hash default passwords
    const adminPasswordHash = await bcrypt.hash('AdminSecret123!', 10);
    const defaultPasswordHash = await bcrypt.hash('Password123!', 10);

    // 3. Create Default Platform Users
    const admin = await User.create({
      name: 'Master Administrator',
      email: 'admin@fundnova.com',
      password: adminPasswordHash,
      role: 'admin',
      credits: 1000,
      creditBalance: 1000,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    });

    const creator = await User.create({
      name: 'Sarah Vance (Innovator)',
      email: 'creator@fundnova.com',
      password: defaultPasswordHash,
      role: 'creator',
      credits: 200,
      creditBalance: 200,
      raisedCredits: 1420,
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200',
      photoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200',
    });

    const supporter = await User.create({
      name: 'Marcus Vance (Supporter)',
      email: 'supporter@fundnova.com',
      password: defaultPasswordHash,
      role: 'supporter',
      credits: 350,
      creditBalance: 350,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
      photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    });

    console.log('Seeded 3 Platform Users (Admin, Creator, Supporter).');

    // 4. Create Dynamic Approved & Pending Campaigns
    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    const fortyFiveDaysFromNow = new Date(now.getTime() + 45 * 24 * 60 * 60 * 1000);

    const campaignsData = [
      {
        title: 'EcoBreathe — Solar-Powered Urban Air Purifier',
        description: 'EcoBreathe is a zero-emission, solar-powered air filtration tower designed for urban public parks and school zones.',
        story: 'EcoBreathe is a zero-emission, solar-powered air filtration tower designed for urban public parks and school zones.',
        goalAmount: 500,
        fundingGoal: 500,
        raisedAmount: 320,
        amountRaised: 320,
        creator: creator._id,
        creatorName: creator.name,
        creatorEmail: creator.email,
        status: 'approved',
        category: 'Technology',
        coverImage: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800',
        imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800',
        deadline: thirtyDaysFromNow,
        minimumContribution: 5,
        rewardInfo: 'Early Bird Supporter Badge + Live AQI Dashboard Access',
      },
      {
        title: 'NexusVR — Haptic Feedback Gloves for Medical Training',
        description: 'NexusVR introduces affordable ultra-precise haptic gloves designed for medical students to simulate complex surgical procedures in VR.',
        story: 'NexusVR introduces affordable ultra-precise haptic gloves designed for medical students to simulate complex surgical procedures in VR.',
        goalAmount: 1200,
        fundingGoal: 1200,
        raisedAmount: 850,
        amountRaised: 850,
        creator: creator._id,
        creatorName: creator.name,
        creatorEmail: creator.email,
        status: 'approved',
        category: 'Technology',
        coverImage: 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&q=80&w=800',
        imageUrl: 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&q=80&w=800',
        deadline: fortyFiveDaysFromNow,
        minimumContribution: 10,
        rewardInfo: 'NexusVR Beta Tester License + Engraved Case',
      },
      {
        title: 'Echoes of Silence — Independent Sci-Fi Short Film',
        description: 'A cinematic, visually arresting sci-fi short film exploring deep-space isolation and human resilience.',
        story: 'A cinematic, visually arresting sci-fi short film exploring deep-space isolation and human resilience.',
        goalAmount: 300,
        fundingGoal: 300,
        raisedAmount: 210,
        amountRaised: 210,
        creator: creator._id,
        creatorName: creator.name,
        creatorEmail: creator.email,
        status: 'approved',
        category: 'Creative Arts',
        coverImage: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=800',
        imageUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=800',
        deadline: thirtyDaysFromNow,
        minimumContribution: 5,
        rewardInfo: 'Producer Credit in End Titles + 4K Digital Stream',
      },
      {
        title: 'CareMobile — Solar Telehealth Kits for Remote Villages',
        description: 'Portable, ruggedized medical diagnostic kits equipped with satellite connectivity and digital stethoscopes.',
        story: 'Portable, ruggedized medical diagnostic kits equipped with satellite connectivity and digital stethoscopes.',
        goalAmount: 800,
        fundingGoal: 800,
        raisedAmount: 450,
        amountRaised: 450,
        creator: creator._id,
        creatorName: creator.name,
        creatorEmail: creator.email,
        status: 'approved',
        category: 'Health & Medical',
        coverImage: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800',
        imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800',
        deadline: fortyFiveDaysFromNow,
        minimumContribution: 10,
        rewardInfo: 'Sponsor a Telehealth Kit + Quarterly Impact Report',
      },
      {
        title: 'CleanOcean — Autonomous Plastics Collector Drone',
        description: 'An autonomous, zero-emission watercraft designed to skim microplastics and floating debris from river estuaries.',
        story: 'An autonomous, zero-emission watercraft designed to skim microplastics and floating debris from river estuaries.',
        goalAmount: 1500,
        fundingGoal: 1500,
        raisedAmount: 980,
        amountRaised: 980,
        creator: creator._id,
        creatorName: creator.name,
        creatorEmail: creator.email,
        status: 'approved',
        category: 'Community & Environment',
        coverImage: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&q=80&w=800',
        imageUrl: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&q=80&w=800',
        deadline: fortyFiveDaysFromNow,
        minimumContribution: 10,
        rewardInfo: 'Name Engraved on Drone Hull + GPS Tracking Access',
      },
      {
        title: 'CleanWater AI: Autonomous Well Sensor Network Proposal',
        description: 'Deploying low-cost IoT water quality sensors across remote rural wells to monitor contamination real-time.',
        story: 'Deploying low-cost IoT water quality sensors across remote rural wells to monitor contamination real-time.',
        goalAmount: 1000,
        fundingGoal: 1000,
        raisedAmount: 0,
        amountRaised: 0,
        creator: creator._id,
        creatorName: creator.name,
        creatorEmail: creator.email,
        status: 'pending',
        category: 'Technology',
        coverImage: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&q=80&w=800',
        imageUrl: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&q=80&w=800',
        deadline: thirtyDaysFromNow,
        minimumContribution: 15,
        rewardInfo: 'Live dashboard access key + supporter plaque',
      },
    ];

    const seededCampaigns = await Campaign.insertMany(campaignsData);
    console.log(`Seeded ${seededCampaigns.length} Campaigns.`);

    // 5. Create Sample Contribution
    await Contribution.create({
      campaignId: seededCampaigns[0]._id,
      campaign: seededCampaigns[0]._id,
      campaignTitle: seededCampaigns[0].title,
      supporterId: supporter._id,
      supporterName: supporter.name,
      supporterEmail: supporter.email,
      creatorId: creator._id,
      creatorName: creator.name,
      creatorEmail: creator.email,
      contributionAmount: 50,
      amount: 50,
      status: 'approved',
      rewardClaimed: seededCampaigns[0].rewardInfo,
    });

    // 6. Create Sample Notifications
    await Notification.create([
      {
        toEmail: supporter.email,
        recipientEmail: supporter.email,
        userId: supporter._id,
        userEmail: supporter.email,
        message: 'Your contribution of 50 credits to EcoBreathe was approved!',
        title: 'Pledge Approved!',
        type: 'approval',
        isRead: false,
        read: false,
        actionRoute: '/dashboard/supporter/contributions',
        actionUrl: '/dashboard/supporter/contributions',
      },
      {
        toEmail: creator.email,
        recipientEmail: creator.email,
        userId: creator._id,
        userEmail: creator.email,
        message: 'New contribution of 50 credits received for EcoBreathe!',
        title: 'New Pledge Received',
        type: 'pledge',
        isRead: false,
        read: false,
        actionRoute: '/dashboard/creator',
        actionUrl: '/dashboard/creator',
      },
    ]);

    console.log('Seeding completed successfully!');
    return true;
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
};

if (process.argv[1]?.endsWith('seed.ts') || process.argv[1]?.endsWith('seed.js')) {
  seedDatabase().then(() => {
    process.exit(0);
  }).catch(() => {
    process.exit(1);
  });
}
