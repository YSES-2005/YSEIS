const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const MONGO_URI = process.env.MONGO_URI || 'mongodb://mongo:27017/inventory';
const SEED_USERS = [
  {
    name: 'Admin User',
    email: 'admin@yseis.local',
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
  },
  {
    name: 'Dell Monitor 27"',
    type: 'Monitor',
    quantity: 10,
    location: 'IT Department - Room 101',
    status: 'available',
  },
  {
    name: 'Wireless Mouse',
    type: 'Accessory',
    quantity: 25,
    location: 'IT Department - Room 101',
    status: 'available',
  },
  {
    name: 'USB-C Cable',
    type: 'Cable',
    quantity: 50,
    location: 'IT Department - Room 101',
    status: 'available',
  },
  {
    name: 'HDMI Cable 6ft',
    type: 'Cable',
    quantity: 30,
    location: 'IT Department - Room 101',
    status: 'available',
  },
  {
    name: 'Projector Epson',
    type: 'Projector',
    quantity: 3,
    location: 'Conference Room A',
    status: 'available',
  },
  {
    name: 'Webcam Logitech C920',
    type: 'Camera',
    quantity: 8,
    location: 'IT Department - Room 101',
    status: 'available',
  },
  {
    name: 'Headset Jabra',
    type: 'Audio',
    quantity: 15,
    location: 'IT Department - Room 101',
    status: 'available',
  },
  {
    name: 'Keyboard Mechanical',
    type: 'Keyboard',
    quantity: 12,
    location: 'IT Department - Room 101',
    status: 'available',
  },
  {
    name: 'iPad Air',
    type: 'Tablet',
    quantity: 6,
    location: 'Administration Office',
    status: 'available',
  },
];
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
      custodian: adminUser._id,
    }));
    await Item.insertMany(itemsWithCustodian);
    console.log(`Created ${SEED_ITEMS.length} items`);
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
