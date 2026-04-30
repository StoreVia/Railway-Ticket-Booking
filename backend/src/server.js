import express, { } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import process from 'node:process';

import './models/Passenger.js';
import './models/Train.js';
import './models/Station.js';
import './models/Schedule.js';
import './models/Booking.js';
import './models/Seat.js';
import './models/UserSession.js';
import './models/Admin.js';
import './models/Payment.js';
import './models/Cancellation.js';
import './models/Notification.js';

import { connectDB } from './lib/db.js';

import authRoutes from './routes/auth.js';
import stationsRoutes from './routes/stations.js';
import trainsRoutes from './routes/trains.js';
import schedulesRoutes from './routes/schedules.js';
import bookingsRoutes from './routes/bookings.js';
import adminAuthRoutes from './routes/admin-auth.js';
import adminRoutes from './routes/admin.js';
import paymentsRoutes from './routes/payments.js';
import cancellationsRoutes from './routes/cancellations.js';
import notificationsRoutes from './routes/notifications.js';
import profileRoutes from './routes/profile.js';
import qrRoutes from './routes/qr.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;


const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};


app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());


async function startServer() {
  try {
    await connectDB();
    
    
    app.use('/api/auth', authRoutes);
    app.use('/api/admin-auth', adminAuthRoutes);
    app.use('/api/admin', adminRoutes);
    app.use('/api/stations', stationsRoutes);
    app.use('/api/trains', trainsRoutes);
    app.use('/api/schedules', schedulesRoutes);
    app.use('/api/bookings', bookingsRoutes);
    app.use('/api/payments', paymentsRoutes);
    app.use('/api/cancellations', cancellationsRoutes);
    app.use('/api/notifications', notificationsRoutes);
    app.use('/api/profile', profileRoutes);
    app.use('/api/qr', qrRoutes);

    
    app.get('/health', (req, res) => {
      res.json({ message: 'Backend server is running' });
    });

    app.use((err, req, res) => {
      console.error('Error:', err);
      res.status(err.status || 500).json({
        message: err.message || 'Internal server error'
      });
    });

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();