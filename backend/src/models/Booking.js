import mongoose, { Schema, } from 'mongoose';

const bookingSchema = new Schema(
  {
    passenger_id: { type: Schema.Types.ObjectId, ref: 'Passenger', required: true },
    schedule_id: { type: Schema.Types.ObjectId, ref: 'Schedule', required: true },
    pnr_number: { type: String, required: true, unique: true },
    booking_date: { type: Date, default: Date.now },
    total_fare: { type: Number, required: true },
    status: { type: String, enum: ['Confirmed', 'Cancelled', 'Pending'], default: 'Confirmed' },
    passenger_details: [
      {
        name: { type: String, required: true },
        age: { type: Number, required: true },
        gender: { type: String, required: true }
      }
    ]
  },
  { collection: 'booking' }
);

export default mongoose.model('Booking', bookingSchema);
