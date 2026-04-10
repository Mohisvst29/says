import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Car from '@/models/Car';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const car = await Car.findById(id);
    if (!car) {
      return NextResponse.json({ error: 'السيارة غير موجودة' }, { status: 404 });
    }
    return NextResponse.json(car);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    await dbConnect();
    const { id } = await params;
    const body = await request.json();
    const car = await Car.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    if (!car) {
      return NextResponse.json({ error: 'السيارة غير موجودة' }, { status: 404 });
    }
    return NextResponse.json(car);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    await dbConnect();
    const { id } = await params;
    const car = await Car.findByIdAndDelete(id);
    if (!car) {
      return NextResponse.json({ error: 'السيارة غير موجودة' }, { status: 404 });
    }
    return NextResponse.json({ message: 'تم حذف السيارة بنجاح' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
