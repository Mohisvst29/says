import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import SiteSettings from '@/models/SiteSettings';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET() {
  try {
    await dbConnect();
    let settings = await SiteSettings.findOne({});
    if (!settings) {
      settings = await SiteSettings.create({
        features: [
          { icon: 'fas fa-shield-alt', title: 'ضمان شامل', description: 'نقدم ضمان شامل على جميع سياراتنا مع خدمة صيانة مجانية لمدة عام كامل' },
          { icon: 'fas fa-hand-holding-usd', title: 'تمويل مرن', description: 'خيارات تمويل متعددة بالتعاون مع أفضل البنوك والمؤسسات المالية بأقل نسبة ربح' },
          { icon: 'fas fa-search-dollar', title: 'فحص دقيق', description: 'كل سيارة تخضع لفحص شامل من 200 نقطة بواسطة خبراء متخصصين قبل عرضها' },
          { icon: 'fas fa-truck', title: 'توصيل مجاني', description: 'خدمة توصيل مجانية لجميع أنحاء المملكة مع إمكانية التجربة قبل الشراء' },
        ],
      });
    }
    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    await dbConnect();
    const body = await request.json();
    let settings = await SiteSettings.findOne({});
    if (!settings) {
      settings = await SiteSettings.create(body);
    } else {
      settings = await SiteSettings.findByIdAndUpdate(settings._id, body, { new: true, runValidators: true });
    }
    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
