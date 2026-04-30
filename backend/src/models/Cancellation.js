import mongoose, { Schema, } from 'mongoose';

const cancellationSchema = new Schema(
  {
    booking_id: { type: Schema.Types.ObjectId, ref: 'Booking', required: true, unique: true },
    passenger_id: { type: Schema.Types.ObjectId, ref: 'Passenger', required: true },
    cancellation_reason: { type: String, required: true },
    refund_amount: { type: Number, required: true },
    refund_status: { 
      type: String, 
      enum: ['pending', 'processed', 'rejected'],
      default: 'pending'
    },
    cancellation_date: { type: Date, default: Date.now },
    refund_date: { type: Date },
    cancellation_charges: { type: Number, default: 0 }
  },
  { collection: 'cancellation' }
);

export default mongoose.model('Cancellation', cancellationSchema);
