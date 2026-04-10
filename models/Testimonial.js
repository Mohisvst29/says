import mongoose from 'mongoose';

const TestimonialSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'اسم العميل مطلوب'],
  },
  title: {
    type: String,
    default: '',
  },
  text: {
    type: String,
    required: [true, 'نص التقييم مطلوب'],
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: 5,
  },
  initials: {
    type: String,
    default: '',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

export default mongoose.models.Testimonial || mongoose.model('Testimonial', TestimonialSchema);
