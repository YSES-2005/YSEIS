const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://mongo:27017/inventory';

const SEED_USERS = [
  {
    name: 'Admin User',
    email: 'admin@ysei.local', // Fixed typo (removed extra 's') to match console logs
    password: 'admin123',
    role: 'admin',
    preferences: {
      emailAlerts: true,
      dueDateReminders: true,
    },
  },
  {
    name: 'John Doe',
    email: 'john.doe@ysei.local',
    password: 'user123',
    role: 'user',
    preferences: {
      emailAlerts: true,
      dueDateReminders: true,
    },
  },
  {
    name: 'Jane Smith',
    email: 'jane.smith@ysei.local',
    password: 'user123',
    role: 'user',
    preferences: {
      emailAlerts: false,
      dueDateReminders: true,
    },
  },
];

const SEED_ITEMS = [
  {
    name: 'MacBook Pro 16"',
    type: 'Laptop',
    quantity: 5,
    location: 'IT Department - Room 101',
    status: 'available',
    avatar:
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca4?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Dell Monitor 27"',
    type: 'Monitor',
    quantity: 10,
    location: 'IT Department - Room 101',
    status: 'available',
    avatar:
      'https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Wireless Mouse',
    type: 'Accessory',
    quantity: 25,
    location: 'IT Department - Room 101',
    status: 'available',
    avatar:
      'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'USB-C Cable',
    type: 'Cable',
    quantity: 50,
    location: 'IT Department - Room 101',
    status: 'available',
    avatar:
      'https://images.unsplash.com/photo-1616440347437-b1c734c7ef99?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'HDMI Cable 6ft',
    type: 'Cable',
    quantity: 30,
    location: 'IT Department - Room 101',
    status: 'available',
    avatar:
      'https://images.unsplash.com/photo-1563770095128-4231b79f8e21?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Projector Epson',
    type: 'Projector',
    quantity: 3,
    location: 'Conference Room A',
    status: 'available',
    avatar:
      'https://images.unsplash.com/photo-1517601278517-45619222be73?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Webcam Logitech C920',
    type: 'Camera',
    quantity: 8,
    location: 'IT Department - Room 101',
    status: 'available',
    avatar:
      'https://images.unsplash.com/photo-1599580435777-ea654cb6c478?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Headset Jabra',
    type: 'Audio',
    quantity: 15,
    location: 'IT Department - Room 101',
    status: 'available',
    avatar:
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Keyboard Mechanical',
    type: 'Keyboard',
    quantity: 12,
    location: 'IT Department - Room 101',
    status: 'available',
    avatar:
      'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'iPad Air',
    type: 'Tablet',
    quantity: 6,
    location: 'Administration Office',
    status: 'available',
    avatar:
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80',
  },
];

const SEED_TRANSACTIONS = [];
const purposes = [
  'Project Work',
  'Meeting Presentation',
  'Remote Work',
  'Training Session',
  'Client Demo',
  'Video Conference',
  'Development Testing',
  'Event Setup',
  'Workshop',
  'Document Review',
];

const approvalStatuses = [
  'pending',
  'approved',
  'released',
  'completed',
  'disapproved',
  'cancelled',
];

const today = new Date();

for (let i = 0; i < 50; i++) {
  const statusIndex = i % 6;
  const approvalStatus = approvalStatuses[statusIndex];

  const daysAgo = Math.floor(Math.random() * 60);
  const daysFromNow = Math.floor(Math.random() * 30) + 1;

  const createdAt = new Date(today);
  createdAt.setDate(createdAt.getDate() - daysAgo);

  const returnDate = new Date(today);
  returnDate.setDate(returnDate.getDate() + daysFromNow);

  SEED_TRANSACTIONS.push({
    quantity: Math.floor(Math.random() * 3) + 1,
    purpose: purposes[Math.floor(Math.random() * purposes.length)],
    urgency: Math.random() > 0.6,
    returnDate: returnDate,
    approvalStatus: approvalStatus,
    returned: approvalStatus === 'completed',
    returnedAt:
      approvalStatus === 'completed'
        ? new Date(
            returnDate.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000
          )
        : null,
    createdAt: createdAt,
  });
}

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    const User = mongoose.model(
      'User',
      new mongoose.Schema(
        {
          name: { type: String, required: true },
          email: { type: String, required: true, unique: true },
          password: { type: String, required: true },
          role: { type: String, required: true, enum: ['admin', 'user'] },
          urgent_borrow_uses: { type: Number, default: 0 },
          preferences: {
            emailAlerts: { type: Boolean, default: true },
            dueDateReminders: { type: Boolean, default: true },
          },
        },
        { timestamps: true }
      )
    );

    const Item = mongoose.model(
      'Item',
      new mongoose.Schema(
        {
          name: { type: String, required: true },
          type: { type: String, required: true },
          avatar: { type: String },
          quantity: { type: Number, required: true, min: 0 },
          location: { type: String, required: true },
          custodian: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
          },
          status: {
            type: String,
            enum: ['available', 'unavailable', 'deleted'],
            default: 'available',
          },
        },
        { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
      )
    );

    await User.deleteMany({});
    await Item.deleteMany({});
    console.log('Cleared existing data');

    for (const user of SEED_USERS) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
    }

    const createdUsers = await User.insertMany(SEED_USERS);
    console.log(`Created ${createdUsers.length} users`);

    const adminUser = createdUsers.find(u => u.role === 'admin');
    if (!adminUser) {
      throw new Error('Admin user not found');
    }

    const itemsWithCustodian = SEED_ITEMS.map(item => ({
      ...item,
      custodian:
        createdUsers[Math.floor(Math.random() * createdUsers.length)]._id,
    }));

    const Transaction = mongoose.model(
      'Transaction',
      new mongoose.Schema(
        {
          item: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Item',
            required: true,
          },
          borrower: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
          },
          quantity: { type: Number, required: true, default: 1, min: 1 },
          purpose: { type: String, required: true },
          urgency: { type: Boolean, required: true },
          returnDate: { type: Date, required: true },
          approvalStatus: {
            type: String,
            enum: [
              'approved',
              'disapproved',
              'pending',
              'released',
              'completed',
              'cancelled',
            ],
            default: 'pending',
            required: true,
          },
          returned: { type: Boolean, default: false },
          returnedAt: { type: Date },
          batchId: { type: String, index: true },
        },
        { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
      )
    );

    await Item.insertMany(itemsWithCustodian);
    console.log(`Created ${SEED_ITEMS.length} items`);

    const createdItems = await Item.find({});
    await Transaction.deleteMany({});

    const transactionsWithRefs = SEED_TRANSACTIONS.map(t => ({
      ...t,
      item: createdItems[Math.floor(Math.random() * createdItems.length)]._id,
      borrower:
        createdUsers[Math.floor(Math.random() * createdUsers.length)]._id,
    }));

    await Transaction.insertMany(transactionsWithRefs);
    console.log(`Created ${SEED_TRANSACTIONS.length} transactions`);

    console.log('\n✅ Seed completed successfully!');
    console.log('\n📋 User Credentials:');
    console.log('  Admin: admin@ysei.local / admin123');
    console.log('  User:  john.doe@ysei.local / user123');
    console.log('  User:  jane.smith@ysei.local / user123');

    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
}

seed();
