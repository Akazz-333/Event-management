import { connectDB } from '../config/db';
import { User as MongoUser } from '../models/User';
import { Event as MongoEvent } from '../models/Event';
import { TicketType as MongoTicketType } from '../models/TicketType';
import { Registration as MongoRegistration } from '../models/Registration';
import mongoose from 'mongoose';

async function clearAllData() {
  await connectDB();
  console.log('🧹 Clearing all data from database for a fresh empty start...');

  await MongoRegistration.deleteMany({});
  await MongoTicketType.deleteMany({});
  await MongoEvent.deleteMany({});
  await MongoUser.deleteMany({});

  // Drop any extra collections if they exist
  if (mongoose.connection.db) {
    const collections = await mongoose.connection.db.listCollections().toArray();
    for (const col of collections) {
      if (!['users', 'events', 'tickettypes', 'registrations'].includes(col.name)) {
        try {
          await mongoose.connection.db.dropCollection(col.name);
          console.log(`Dropped extra collection: ${col.name}`);
        } catch (e) {}
      }
    }
  }

  console.log('✨ Database cleared completely! Ready for new user registrations and event creations. 🎉');
  process.exit(0);
}

clearAllData();
