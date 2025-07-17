import express from 'express';
import { body, query } from 'express-validator';
import {
  createBooking,
  getBookings,
  updateBookingStatus,
  getAvailableSlots
} from '../controllers/bookingController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Create booking
router.post('/', auth, [
  body('serviceId').isMongoId().withMessage('Invalid service ID'),
  body('date').isISO8601().withMessage('Invalid date format'),
  body('startTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Invalid time format')
], createBooking);

// Get bookings
router.get('/', auth, getBookings);

// Update booking status
router.patch('/:bookingId/status', auth, [
  body('status').isIn(['pending', 'confirmed', 'cancelled', 'completed', 'no-show']).withMessage('Invalid status')
], updateBookingStatus);

// Get available slots
router.get('/available-slots', [
  query('serviceId').isMongoId().withMessage('Invalid service ID'),
  query('date').isISO8601().withMessage('Invalid date format')
], getAvailableSlots);

export default router;
