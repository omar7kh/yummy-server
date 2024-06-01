import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  firstName: { type: String },
  lastName: { type: String },
  email: { type: String, unique: true },
  password: { type: String },
  address: {
    street: { type: String },
    city: { type: String },
    country: { type: String },
  },
  createdAt: { type: Date, default: new Date() },
});

const UserModel = mongoose.model('User', userSchema);
export default UserModel;
