import mongoose, { Schema, } from 'mongoose';

const scheduleSchema = new Schema(
  {
    train_id: { type: Schema.Types.ObjectId, ref: 'Train', required: true },
    travel_date: { type: Date, required: true },
    from_station: { type: Schema.Types.ObjectId, ref: 'Station', required: true },
    to_station: { type: Schema.Types.ObjectId, ref: 'Station', required: true },
    available_seats: { type: Number, required: true },
    base_fare: { type: Number, required: true }
  },
  { collection: 'schedule' }
);

export default mongoose.model('Schedule', scheduleSchema);
