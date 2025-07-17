import Booking from '../models/Booking.js';
import Service from '../models/Service.js';
import User from '../models/User.js';
import { validationResult } from 'express-validator';

export const createBooking = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { serviceId, date, startTime, customerNotes } = req.body;

    const service = await Service.findById(serviceId).populate('provider');
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    const [startHour, startMinute] = startTime.split(':').map(Number);
    const endDate = new Date();
    endDate.setHours(startHour, startMinute + service.duration);
    const endTime = endDate.toTimeString().slice(0, 5);

    const conflictingBooking = await Booking.findOne({
      service: serviceId,
      date: new Date(date),
      $or: [
        { startTime: { $lt: endTime }, endTime: { $gt: startTime } }
      ],
      status: { $in: ['pending', 'confirmed'] }
    });

    if (conflictingBooking) {
      return res.status(400).json({ message: 'Time slot not available' });
    }

    const booking = new Booking({
      service: serviceId,
      customer: req.user.userId,
      provider: service.provider._id,
      date: new Date(date),
      startTime,
      endTime,
      customerNotes,
      totalPrice: service.price
    });

    await booking.save();
    await booking.populate(['service', 'customer', 'provider']);

    res.status(201).json({
      message: 'Booking created successfully',
      booking
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getBookings = async (req, res) => {
  try {
    const { status, date, page = 1, limit = 10 } = req.query;
    const query = {};

    if (req.user.role === 'customer') {
      query.customer = req.user.userId;
    } else if (req.user.role === 'provider') {
      query.provider = req.user.userId;
    }

    if (status) {
      query.status = status;
    }

    if (date) {
      const targetDate = new Date(date);
      const nextDay = new Date(targetDate);
      nextDay.setDate(targetDate.getDate() + 1);

      query.date = {
        $gte: targetDate,
        $lt: nextDay
      };
    }

    const bookings = await Booking.find(query)
      .populate('service', 'name category duration price')
      .populate('customer', 'name email phone')
      .populate('provider', 'name email phone')
      .sort({ date: -1, startTime: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Booking.countDocuments(query);

    res.json({
      bookings,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateBookingStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status, notes } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (req.user.role === 'customer' && booking.customer.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }
    if (req.user.role === 'provider' && booking.provider.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    booking.status = status;
    if (notes) {
      if (req.user.role === 'provider') {
        booking.providerNotes = notes;
      } else {
        booking.customerNotes = notes;
      }
    }

    if (status === 'cancelled') {
      booking.cancelledAt = new Date();
      booking.cancelledBy = req.user.userId;
    }

    await booking.save();
    await booking.populate(['service', 'customer', 'provider']);

    res.json({
      message: 'Booking updated successfully',
      booking
    });
  } catch (error) {
    console.error('Update booking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAvailableSlots = async (req, res) => {
  try {
    const { serviceId, date } = req.query;

    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    const targetDate = new Date(date);
    const dayOfWeek = targetDate.getDay();

    const availability = service.availability.find(av => av.dayOfWeek === dayOfWeek);
    if (!availability) {
      return res.json({ availableSlots: [] });
    }

    const existingBookings = await Booking.find({
      service: serviceId,
      date: targetDate,
      status: { $in: ['pending', 'confirmed'] }
    });

    const availableSlots = [];
    const [startHour, startMinute] = availability.startTime.split(':').map(Number);
    const [endHour, endMinute] = availability.endTime.split(':').map(Number);

    let currentTime = startHour * 60 + startMinute;
    const endTime = endHour * 60 + endMinute;
    const serviceDuration = service.duration;

    while (currentTime + serviceDuration <= endTime) {
      const slotStart = `${Math.floor(currentTime / 60).toString().padStart(2, '0')}:${(currentTime % 60).toString().padStart(2, '0')}`;
      const slotEndTime = currentTime + serviceDuration;
      const slotEnd = `${Math.floor(slotEndTime / 60).toString().padStart(2, '0')}:${(slotEndTime % 60).toString().padStart(2, '0')}`;

      const hasConflict = existingBookings.some(booking => {
        const bookingStart = booking.startTime.split(':').map(Number);
        const bookingEnd = booking.endTime.split(':').map(Number);
        const bookingStartMinutes = bookingStart[0] * 60 + bookingStart[1];
        const bookingEndMinutes = bookingEnd[0] * 60 + bookingEnd[1];

        return (currentTime < bookingEndMinutes && slotEndTime > bookingStartMinutes);
      });

      if (!hasConflict) {
        availableSlots.push({
          startTime: slotStart,
          endTime: slotEnd
        });
      }

      currentTime += 30;
    }

    res.json({ availableSlots });
  } catch (error) {
    console.error('Get available slots error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
