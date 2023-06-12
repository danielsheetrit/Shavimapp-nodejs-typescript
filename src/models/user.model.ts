import { mongoose, Schema } from '../db/mongoose';
import { IUser, IUserDocument } from '../interfaces/IUser';

const userSchema: Schema<IUser> = new mongoose.Schema({
  username: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
    minLength: [8, 'Password must include at least 8 characters.'],
  },
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  user_type: {
    type: String,
    required: true,
    enum: ['user', 'admin', 'chief'],
    default: 'user',
  },
  created_at: {
    type: Date,
    immutable: true,
    default: () => Date.now(),
  },
});

const User = mongoose.model<IUserDocument>('User', userSchema);

export { User };
