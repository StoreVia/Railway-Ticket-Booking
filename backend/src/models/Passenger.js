import mongoose, { Schema, } from 'mongoose';

const passengerSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String, required: true },
    date_of_birth: { type: Date, required: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
    password_hash: { type: String, required: true },
    created_at: { type: Date, default: Date.now }
  },
  { collection: 'passenger' }
);

export default mongoose.model('Passenger', passengerSchema);
