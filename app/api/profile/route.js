import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    const data = await request.json();
    const { name, email, password, newPassword } = data;

    await dbConnect();

    // Find user
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'المستخدم غير موجود' }, { status: 404 });
    }

    // Verify current password
    if (password) {
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return NextResponse.json({ error: 'كلمة المرور الحالية غير صحيحة' }, { status: 400 });
      }
    } else {
      return NextResponse.json({ error: 'يجب إدخال كلمة المرور الحالية للحفظ' }, { status: 400 });
    }

    // Check if new email is already taken by someone else
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return NextResponse.json({ error: 'البريد الإلكتروني مستخدم مسبقاً' }, { status: 400 });
      }
      user.email = email;
    }

    if (name) user.name = name;

    if (newPassword && newPassword.length >= 6) {
      user.password = await bcrypt.hash(newPassword, 12);
    }

    await user.save();

    return NextResponse.json({ success: true, message: 'تم تحديث البيانات بنجاح' });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json({ error: 'حدث خطأ في الخادم' }, { status: 500 });
  }
}
