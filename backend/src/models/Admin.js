import mongoose, { Schema, } from 'mongoose';

const adminSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password_hash: { type: String, required: true },
    role: { type: String, enum: ['super_admin', 'admin', 'manager'], default: 'admin' },
    created_at: { type: Date, default: Date.now },
    last_login: { type: Date },
    is_active: { type: Boolean, default: true }
  },
  { collection: 'admin' }
);

export default mongoose.model('Admin', adminSchema);