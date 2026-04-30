import mongoose, { Schema, } from 'mongoose';

const seatSchema = new Schema(
  {
    booking_id: { type: Schema.Types.ObjectId, ref: 'Booking', required: true },
    seat_number: { type: String, required: true },
    seat_class: {
      type: String,
      enum: ['General', 'Sleeper', 'AC1', 'AC2', 'AC3'],
      required: true
    },
    berth_type: {
      type: String,
      enum: ['Lower', 'Middle', 'Upper', 'Side'],
      required: true
    },
    fare: { type: Number, required: true }
  },
  { collection: 'seat' }
);

export default mongoose.model('Seat', seatSchema);
