import mongoose, { Schema, } from 'mongoose';

const trainSchema = new Schema(
  {
    train_number: { type: String, required: true, unique: true },
    train_name: { type: String, required: true },
    total_seats: { type: Number, required: true },
    train_type: {
      type: String,
      enum: ['Express', 'Superfast', 'Passenger', 'Rajdhani'],
      required: true
    }
  },
  { collection: 'train' }
);

export default mongoose.model('Train', trainSchema);
