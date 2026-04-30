import mongoose, { Schema, } from 'mongoose';

const stationSchema = new Schema(
  {
    station_code: { type: String, required: true, unique: true },
    station_name: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true }
  },
  { collection: 'station' }
);

export default mongoose.model('Station', stationSchema);
