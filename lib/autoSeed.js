import dbConnect from '@/lib/mongodb';
import bcrypt from 'bcryptjs';

async function autoSeed() {
  try {
    await dbConnect();

    const User = (await import('@/models/User')).default;
    const Car = (await import('@/models/Car')).default;
    const Testimonial = (await import('@/models/Testimonial')).default;
    const SiteSettings = (await import('@/models/SiteSettings')).default;

    // Check if already seeded
    const existingAdmin = await User.findOne({ email: 'admin@sayarati.com' });
    if (existingAdmin) return false;

    console.log('🌱 جاري إنشاء البيانات الأولية...');

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 12);
    await User.create({
      name: 'مدير النظام',
      email: 'admin@sayarati.com',
      password: hashedPassword,
      role: 'admin',
    });

    // Seed cars
    await Car.insertMany([
      {
        title: 'مرسيدس S-Class',
        year: '2025',
        subtitle: 'سيدان فاخرة',
        category: 'sedan',
        price: 850000,
        horsepower: '496 حصان',
        fuelType: 'بنزين',
        transmission: 'أوتوماتيك',
        badge: 'جديدة',
        image: '/images/car-sedan.png',
        featured: true,
        isActive: true,
        description: 'مرسيدس S-Class 2025 - أيقونة الفخامة والتكنولوجيا المتقدمة',
      },
      {
        title: 'رينج روفر فوج',
        year: '2025',
        subtitle: 'دفع رباعي فاخر',
        category: 'suv',
        price: 920000,
        horsepower: '523 حصان',
        fuelType: 'بنزين',
        transmission: 'أوتوماتيك',
        badge: 'مميزة',
        image: '/images/car-suv.png',
        featured: true,
        isActive: true,
        description: 'رينج روفر فوج - ملك الطرق الوعرة بلمسة فاخرة',
      },
      {
        title: 'بورش 911 GT3',
        year: '2025',
        subtitle: 'سيارة رياضية',
        category: 'sports',
        price: 1200000,
        horsepower: '502 حصان',
        fuelType: 'بنزين',
        transmission: 'PDK',
        badge: 'رياضية',
        image: '/images/car-sports.png',
        featured: true,
        isActive: true,
        description: 'بورش 911 GT3 - أداء خارق على الحلبات والشوارع',
      },
      {
        title: 'BMW iX xDrive50',
        year: '2025',
        subtitle: 'كهربائية بالكامل',
        category: 'electric',
        price: 680000,
        horsepower: '516 حصان',
        fuelType: 'كهربائي',
        transmission: 'أوتوماتيك',
        badge: 'كهربائية',
        image: '/images/car-electric.png',
        featured: true,
        isActive: true,
        description: 'BMW iX - مستقبل التنقل الكهربائي الفاخر',
      },
      {
        title: 'أودي A8 L',
        year: '2025',
        subtitle: 'سيدان تنفيذية',
        category: 'sedan',
        price: 750000,
        horsepower: '453 حصان',
        fuelType: 'بنزين',
        transmission: 'أوتوماتيك',
        badge: 'حصرية',
        image: '/images/car-luxury.png',
        featured: true,
        isActive: true,
        description: 'أودي A8 L - الرفاهية الألمانية في أبهى صورها',
      },
      {
        title: 'لكزس LX 600',
        year: '2025',
        subtitle: 'دفع رباعي فاخر',
        category: 'suv',
        price: 560000,
        horsepower: '409 حصان',
        fuelType: 'بنزين',
        transmission: 'أوتوماتيك',
        badge: 'وصل حديثاً',
        image: '/images/car-suv.png',
        featured: true,
        isActive: true,
        description: 'لكزس LX 600 - الفخامة اليابانية بموثوقية لا مثيل لها',
      },
    ]);

    // Seed testimonials
    await Testimonial.insertMany([
      {
        name: 'أحمد محمد',
        title: 'رجل أعمال — الرياض',
        text: 'تجربة رائعة من البداية للنهاية. الفريق كان محترفاً جداً وساعدني في اختيار السيارة المناسبة. الأسعار ممتازة مقارنة بالسوق.',
        rating: 5,
        initials: 'أ م',
        isActive: true,
      },
      {
        name: 'خالد العمري',
        title: 'مهندس — جدة',
        text: 'اشتريت سيارتي الأولى من سيارتي وكانت التجربة مذهلة. خدمة التمويل كانت سهلة وسريعة، والسيارة وصلت بحالة ممتازة.',
        rating: 5,
        initials: 'خ ع',
        isActive: true,
      },
      {
        name: 'فهد السالم',
        title: 'طبيب — الدمام',
        text: 'أنصح الجميع بزيارة معرض سيارتي. التشكيلة واسعة والأسعار معقولة جداً. خدمة ما بعد البيع ممتازة والفريق ودود ومتعاون.',
        rating: 4.5,
        initials: 'ف س',
        isActive: true,
      },
    ]);

    // Seed site settings
    await SiteSettings.create({
      features: [
        { icon: 'fas fa-shield-alt', title: 'ضمان شامل', description: 'نقدم ضمان شامل على جميع سياراتنا مع خدمة صيانة مجانية لمدة عام كامل' },
        { icon: 'fas fa-hand-holding-usd', title: 'تمويل مرن', description: 'خيارات تمويل متعددة بالتعاون مع أفضل البنوك والمؤسسات المالية بأقل نسبة ربح' },
        { icon: 'fas fa-search-dollar', title: 'فحص دقيق', description: 'كل سيارة تخضع لفحص شامل من 200 نقطة بواسطة خبراء متخصصين قبل عرضها' },
        { icon: 'fas fa-truck', title: 'توصيل مجاني', description: 'خدمة توصيل مجانية لجميع أنحاء المملكة مع إمكانية التجربة قبل الشراء' },
      ],
    });

    console.log('✅ تم إنشاء البيانات الأولية بنجاح!');
    console.log('📧 البريد: admin@sayarati.com');
    console.log('🔑 كلمة المرور: admin123');
    return true;
  } catch (error) {
    console.error('Auto-seed error:', error.message);
    return false;
  }
}

export default autoSeed;
