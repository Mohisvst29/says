import mongoose from 'mongoose';

const CarSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'اسم السيارة مطلوب'],
  },
  year: {
    type: String,
    required: [true, 'سنة الصنع مطلوبة'],
  },
  subtitle: {
    type: String,
    default: '',
  },
  category: {
    type: String,
    enum: ['sedan', 'suv', 'sports', 'electric'],
    required: [true, 'الفئة مطلوبة'],
  },
  price: {
    type: Number,
    required: [true, 'السعر مطلوب'],
  },
  horsepower: {
    type: String,
    default: '',
  },
  fuelType: {
    type: String,
    default: 'بنزين',
  },
  transmission: {
    type: String,
    default: 'أوتوماتيك',
  },
  badge: {
    type: String,
    default: 'جديدة',
  },
  image: {
    type: String,
    default: '/images/car-sedan.png',
  },
  featured: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  description: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

export default mongoose.models.Car || mongoose.model('Car', CarSchema);
