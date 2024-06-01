import mongoose from 'mongoose';
import 'dotenv/config';

const MDB_URL = process.env.MONGODB_CONNECTION as string;

export const MDBConnect = async () => {
  try {
    await mongoose.connect(MDB_URL);
    console.log('connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
};
