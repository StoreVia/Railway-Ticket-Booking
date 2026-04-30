import mongoose, { Schema, } from 'mongoose';

const notificationSchema = new Schema(
  {
    passenger_id: { type: Schema.Types.ObjectId, ref: 'Passenger', required: true },
    booking_id: { type: Schema.Types.ObjectId, ref: 'Booking' },
    type: { 
      type: String,
      enum: ['booking_confirmed', 'booking_cancelled', 'payment_success', 'travel_reminder', 'system_alert'],
      required: true
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    is_read: { type: Boolean, default: false },
    email_sent: { type: Boolean, default: false },
    sms_sent: { type: Boolean, default: false },
    created_at: { type: Date, default: Date.now },
    sent_at: { type: Date }
  },
  { collection: 'notification' }
);

export default mongoose.model('Notification', notificationSchema);
