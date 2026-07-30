import mongoose from 'mongoose';
import '@/models/User';
import '@/models/Club';
import '@/models/Event';
import '@/models/Membership';
import '@/models/Registration';
import '@/models/Announcement';
import '@/models/Task';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bec-club-hub';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
