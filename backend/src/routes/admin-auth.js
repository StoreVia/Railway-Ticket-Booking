import { Router } from 'express';
import bcrypt from 'bcryptjs';
import Admin from '../models/Admin.js';
import { signToken } from '../lib/jwt.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const admin = await Admin.findOne({ email, is_active: true });

        if (!admin) {
            return res.status(401).json({ message: 'Invalid admin credentials' });
        }

        const isValidPassword = await bcrypt.compare(password, admin.password_hash);

        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid admin credentials' });
        }

        const token = signToken({ adminId: admin._id, email: admin.email, role: admin.role });

        await Admin.findByIdAndUpdate(admin._id, { last_login: new Date() });

        const adminWithoutPassword = admin.toObject();
        delete adminWithoutPassword.password_hash;

        return res.json({
            token,
            admin: adminWithoutPassword
        });
    } catch (error) {
        console.error('Admin login error:', error);
        return res.status(500).json({ message: 'Admin login failed' });
    }
});


router.post('/register', async (req, res) => {
    try {
        const { username, email, password, role = 'admin' } = req.body;
        const adminToken = req.headers['authorization']?.split(' ')[1];

        if (!adminToken) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const existingAdmin = await Admin.findOne({ $or: [{ email }, { username }] });

        if (existingAdmin) {
            return res.status(400).json({ message: 'Admin already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const admin = await Admin.create({
            username,
            email,
            password_hash: hashedPassword,
            role
        });

        const adminWithoutPassword = admin.toObject();
        delete adminWithoutPassword.password_hash;

        return res.json({
            message: 'Admin created successfully',
            admin: adminWithoutPassword
        });
    } catch (error) {
        console.error('Admin registration error:', error);
        return res.status(500).json({ message: 'Admin registration failed' });
    }
});


router.get('/profile', authenticateToken, async (req, res) => {
    try {
        const adminId = (req.user ).adminId || (req.user ).passengerId;

        const admin = await Admin.findById(adminId).select('-password_hash');

        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        return res.json(admin);
    } catch (error) {
        console.error('Get admin profile error:', error);
        return res.status(500).json({ message: 'Failed to fetch admin profile' });
    }
});


router.post('/logout', authenticateToken, async (req, res) => {
    try {
        return res.json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error('Logout error:', error);
        return res.status(500).json({ message: 'Logout failed' });
    }
});

export default router;
