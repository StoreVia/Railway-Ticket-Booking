import mongoose, { Schema, } from 'mongoose';

const userSessionSchema = new Schema(
  {
    passenger_id: { type: Schema.Types.ObjectId, ref: 'Passenger', required: true },
    token: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
    expires_at: { type: Date, required: true }
  },
  { collection: 'user_session' }
);

export default mongoose.model('UserSession', userSessionSchema);
