import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    const data = await request.formData();
    const file = data.get('file');

    if (!file) {
      return NextResponse.json({ error: 'لم يتم رفع أي ملف' }, { status: 400 });
    }

    // Convert file to Buffer then to Base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Get MIME type
    const contentType = file.type || 'image/jpeg';
    
    // Create Base64 string
    const base64String = `data:${contentType};base64,${buffer.toString('base64')}`;

    // Return the base64 string directly - this will be saved in MongoDB
    return NextResponse.json({ 
      success: true, 
      url: base64String,
      isBase64: true 
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'حدث خطأ أثناء معالجة الملف' }, { status: 500 });
  }
}
