import 'dotenv/config';
import mongoose, { Schema, Document, Model } from 'mongoose';

mongoose.connect(process.env.MONGO_URI as string).catch((err) => {
  console.error(`Failed to connect MongoDB: ${err}`);
});

// events
mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});

mongoose.connection.on('disconnected', () => {
  console.log('Disconnected from MongoDB');
});

export { mongoose, Schema, Document, Model };
