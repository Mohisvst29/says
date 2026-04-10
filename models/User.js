import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'الاسم مطلوب'],
  },
  email: {
    type: String,
    required: [true, 'البريد الإلكتروني مطلوب'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'كلمة المرور مطلوبة'],
  },
  role: {
    type: String,
    enum: ['admin', 'editor'],
    default: 'admin',
  },
}, {
  timestamps: true,
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
