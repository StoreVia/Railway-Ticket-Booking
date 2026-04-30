import { Router } from 'express';
import bcrypt from 'bcryptjs';
import Passenger from '../models/Passenger.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.get('/me', authenticateToken, async (req, res) => {
  try {
    const passengerId = (req.user ).passengerId;

    const user = await Passenger.findById(passengerId).select('-password_hash');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    return res.status(500).json({ message: 'Failed to fetch profile' });
  }
});


router.put('/me', authenticateToken, async (req, res) => {
  try {
    const passengerId = (req.user ).passengerId;
    const { name, phone, date_of_birth, gender } = req.body;

    const user = await Passenger.findByIdAndUpdate(
      passengerId,
      {
        name,
        phone,
        date_of_birth,
        gender
      },
      { new: true }
    ).select('-password_hash');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json({
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return res.status(500).json({ message: 'Failed to update profile' });
  }
});


router.post('/change-password', authenticateToken, async (req, res) => {
  try {
    const passengerId = (req.user ).passengerId;
    const { old_password, new_password } = req.body;

    const user = await Passenger.findById(passengerId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isValidPassword = await bcrypt.compare(old_password, user.password_hash);

    if (!isValidPassword) {
      return res.status(400).json({ message: 'Old password is incorrect' });
    }

    const hashedPassword = await bcrypt.hash(new_password, 10);

    await Passenger.findByIdAndUpdate(passengerId, {
      password_hash: hashedPassword
    });

    return res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    return res.status(500).json({ message: 'Failed to change password' });
  }
});

export default router;
