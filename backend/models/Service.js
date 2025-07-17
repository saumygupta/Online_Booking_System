import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Hair', 'Wellness', 'Health', 'Fitness', 'Creative', 'Business', 'Other']
  },
  duration: {
    type: Number,
    required: true, // in minutes
    min: 15,
    max: 480
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  availability: [
    {
      dayOfWeek: {
        type: Number,
        min: 0,
        max: 6 // 0 = Sunday, 6 = Saturday
      },
      startTime: String, // "09:00"
      endTime: String    // "17:00"
    }
  ],
  image: String,
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  maxAdvanceBooking: {
    type: Number,
    default: 30 // days
  }
}, {
  timestamps: true
});

const Service = mongoose.model('Service', serviceSchema);
export default Service;
