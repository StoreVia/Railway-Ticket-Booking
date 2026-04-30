import { Router } from 'express';
import Train from '../models/Train.js';
import Schedule from '../models/Schedule.js';
import Booking from '../models/Booking.js';
import Cancellation from '../models/Cancellation.js';
import Payment from '../models/Payment.js';
import Seat from '../models/Seat.js';

import Passenger from '../models/Passenger.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.get('/trains', authenticateToken, async (req, res) => {
  try {
    const page = parseInt(req.query.page ) || 1;
    const limit = parseInt(req.query.limit ) || 10;
    const skip = (page - 1) * limit;

    const trains = await Train.find()
      .skip(skip)
      .limit(limit)
      .sort({ created_at: -1 });

    const total = await Train.countDocuments();

    return res.json({
      trains,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get trains error:', error);
    return res.status(500).json({ message: 'Failed to fetch trains' });
  }
});


router.post('/trains', authenticateToken, async (req, res) => {
  try {
    const { train_name, train_number, train_type, total_seats } = req.body;

    const existingTrain = await Train.findOne({ train_number });
    if (existingTrain) {
      return res.status(400).json({ message: 'Train number already exists' });
    }

    const train = await Train.create({
      train_name,
      train_number,
      train_type,
      total_seats
    });

    return res.status(201).json({
      message: 'Train created successfully',
      train
    });
  } catch (error) {
    console.error('Create train error:', error);
    return res.status(500).json({ message: 'Failed to create train' });
  }
});


router.put('/trains/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { train_name, train_number, train_type, total_seats } = req.body;

    const train = await Train.findByIdAndUpdate(
      id,
      { train_name, train_number, train_type, total_seats },
      { new: true }
    );

    if (!train) {
      return res.status(404).json({ message: 'Train not found' });
    }

    return res.json({
      message: 'Train updated successfully',
      train
    });
  } catch (error) {
    console.error('Update train error:', error);
    return res.status(500).json({ message: 'Failed to update train' });
  }
});


router.delete('/trains/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const train = await Train.findByIdAndDelete(id);

    if (!train) {
      return res.status(404).json({ message: 'Train not found' });
    }

    
    await Schedule.deleteMany({ train_id: id });

    return res.json({ message: 'Train deleted successfully' });
  } catch (error) {
    console.error('Delete train error:', error);
    return res.status(500).json({ message: 'Failed to delete train' });
  }
});




router.get('/schedules', authenticateToken, async (req, res) => {
  try {
    const limit = req.query.limit ;

    const query = Schedule.find()
      .populate('train_id')
      .populate('from_station')
      .populate('to_station')
      .sort({ travel_date: -1 });

    let schedules;
    if (limit === 'all') {
      schedules = await query;
    } else {
      const pageLimit = parseInt(limit) || 10;
      const page = parseInt(req.query.page ) || 1;
      const skip = (page - 1) * pageLimit;
      schedules = await query.skip(skip).limit(pageLimit);
    }

    const total = await Schedule.countDocuments();

    return res.json({
      schedules,
      pagination: {
        limit: limit === 'all' ? total : parseInt(limit) || 10,
        total,
      }
    });
  } catch (error) {
    console.error('Get schedules error:', error);
    return res.status(500).json({ message: 'Failed to fetch schedules' });
  }
});


router.post('/schedules', authenticateToken, async (req, res) => {
  try {
    const { train_id, travel_date, from_station, to_station, available_seats, base_fare } = req.body;

    const schedule = await Schedule.create({
      train_id,
      travel_date,
      from_station,
      to_station,
      available_seats,
      base_fare
    });

    return res.status(201).json({
      message: 'Schedule created successfully',
      schedule
    });
  } catch (error) {
    console.error('Create schedule error:', error);
    return res.status(500).json({ message: 'Failed to create schedule' });
  }
});


router.put('/schedules/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { travel_date, available_seats, base_fare } = req.body;

    const schedule = await Schedule.findByIdAndUpdate(
      id,
      { travel_date, available_seats, base_fare },
      { new: true }
    );

    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }

    return res.json({
      message: 'Schedule updated successfully',
      schedule
    });
  } catch (error) {
    console.error('Update schedule error:', error);
    return res.status(500).json({ message: 'Failed to update schedule' });
  }
});


router.delete('/schedules/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const schedule = await Schedule.findByIdAndDelete(id);

    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }

    return res.json({ message: 'Schedule deleted successfully' });
  } catch (error) {
    console.error('Delete schedule error:', error);
    return res.status(500).json({ message: 'Failed to delete schedule' });
  }
});




router.get('/bookings', authenticateToken, async (req, res) => {
  try {
    const page = parseInt(req.query.page ) || 1;
    const limit = parseInt(req.query.limit ) || 10;
    const skip = (page - 1) * limit;
    const status = req.query.status ;

    const filter = {};
    if (status) {
      filter.status = status;
    }

    const bookings = await Booking.find(filter)
      .populate('passenger_id')
      .populate({
        path: 'schedule_id',
        populate: [
          { path: 'train_id' },
          { path: 'from_station' },
          { path: 'to_station' }
        ]
      })
      .skip(skip)
      .limit(limit)
      .sort({ booking_date: -1 });

    const total = await Booking.countDocuments(filter);

    return res.json({
      bookings,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get bookings error:', error);
    return res.status(500).json({ message: 'Failed to fetch bookings' });
  }
});


router.get('/bookings/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id)
      .populate('passenger_id')
      .populate({
        path: 'schedule_id',
        populate: [
          { path: 'train_id' },
          { path: 'from_station' },
          { path: 'to_station' }
        ]
      });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    return res.json(booking);
  } catch (error) {
    console.error('Get booking error:', error);
    return res.status(500).json({ message: 'Failed to fetch booking' });
  }
});

router.post('/bookings/:id/cancel', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { cancellation_reason } = req.body;

    if (!cancellation_reason || !String(cancellation_reason).trim()) {
      return res.status(400).json({ message: 'Cancellation reason is required' });
    }

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.status === 'Cancelled') {
      return res.status(400).json({ message: 'Booking is already cancelled' });
    }

    const schedule = await Schedule.findById(booking.schedule_id);
    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }

    const travelDate = new Date(schedule.travel_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    travelDate.setHours(0, 0, 0, 0);

    if (travelDate < today) {
      return res.status(400).json({ message: 'Cannot cancel past bookings' });
    }

    const daysUntilTravel = Math.ceil((travelDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    let refundPercentage = 100;
    if (daysUntilTravel <= 1) refundPercentage = 0;
    else if (daysUntilTravel <= 7) refundPercentage = 50;
    else refundPercentage = 90;

    const cancellationCharges = booking.total_fare * (1 - refundPercentage / 100);
    const refundAmount = booking.total_fare - cancellationCharges;

    const cancellation = await Cancellation.create({
      booking_id: booking._id,
      passenger_id: booking.passenger_id,
      cancellation_reason: String(cancellation_reason).trim(),
      refund_amount: refundAmount,
      cancellation_charges: cancellationCharges,
      refund_status: 'processed'
    });

    await Booking.findByIdAndUpdate(booking._id, { status: 'Cancelled' });

    const seats = await Seat.find({ booking_id: booking._id });
    const seatCount = seats.length;

    await Schedule.findByIdAndUpdate(
      booking.schedule_id,
      { $inc: { available_seats: seatCount } }
    );

    await Seat.deleteMany({ booking_id: booking._id });

    await Payment.updateMany(
      { booking_id: booking._id },
      {
        status: 'refunded',
        refund_amount: refundAmount,
        refund_date: new Date()
      }
    );

    return res.json({
      message: 'Booking cancelled successfully',
      cancellation_id: cancellation._id,
      refund_amount: refundAmount,
      cancellation_charges: cancellationCharges,
      refund_status: 'processed'
    });
  } catch (error) {
    console.error('Admin cancel booking error:', error);
    return res.status(500).json({ message: 'Failed to cancel booking' });
  }
});

router.get('/stats/dashboard', authenticateToken, async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments();
    const totalPassengers = await Passenger.countDocuments();
    const totalTrains = await Train.countDocuments();
    const totalSchedules = await Schedule.countDocuments();
    
    const completedBookings = await Booking.countDocuments({ status: 'Confirmed' });
    const cancelledBookings = await Booking.countDocuments({ status: 'Cancelled' });
    
    const revenueData = await Booking.aggregate([
      { $group: { _id: null, totalRevenue: { $sum: '$total_fare' } } }
    ]);
    const totalRevenue = revenueData[0]?.totalRevenue || 0;

    return res.json({
      totalBookings,
      totalPassengers,
      totalTrains,
      totalSchedules,
      completedBookings,
      cancelledBookings,
      totalRevenue
    });
  } catch (error) {
    console.error('Get stats error:', error);
    return res.status(500).json({ message: 'Failed to fetch statistics' });
  }
});


router.get('/stats/bookings', authenticateToken, async (req, res) => {
  try {
    const bookingsByStatus = await Booking.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const bookingsByDate = await Booking.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$booking_date' } },
          count: { $sum: 1 },
          revenue: { $sum: '$total_fare' }
        }
      },
      { $sort: { _id: -1 } },
      { $limit: 30 }
    ]);

    return res.json({
      byStatus: bookingsByStatus,
      byDate: bookingsByDate
    });
  } catch (error) {
    console.error('Get booking analytics error:', error);
    return res.status(500).json({ message: 'Failed to fetch analytics' });
  }
});

export default router;
