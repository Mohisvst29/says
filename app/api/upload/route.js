import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb', // زيادة حد حجم الملف
    },
  },
};

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      console.log('Upload failed: No session');
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    const data = await request.formData();
    const file = data.get('file');

    if (!file) {
      console.log('Upload failed: No file found in FormData');
      return NextResponse.json({ error: 'لم يتم رفع أي ملف' }, { status: 400 });
    }

    // Convert file to Base64 using standard Uint8Array for compatibility
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const contentType = file.type || 'image/jpeg';
    const base64String = `data:${contentType};base64,${buffer.toString('base64')}`;

    console.log('Upload success: File size', bytes.byteLength);

    return NextResponse.json({ 
      success: true, 
      url: base64String,
      isBase64: true 
    });
  } catch (error) {
    console.error('SERVER UPLOAD ERROR:', error);
    return NextResponse.json({ 
      error: 'حدث خطأ في معالجة الملف',
      details: error.message 
    }, { status: 500 });
  }
}
