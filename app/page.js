import HomeClient from '@/components/HomeClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const defaultSettings = {
  heroBadge: 'معرض سيارات فاخرة منذ 2010',
  heroTitle1: 'اكتشف',
  heroTitleHighlight: 'أفخم السيارات',
  heroTitle2: 'في مكان واحد',
  heroDescription: 'نقدم لك تجربة شراء سيارات لا مثيل لها مع تشكيلة واسعة من أرقى العلامات التجارية العالمية وخيارات تمويل مرنة تناسب احتياجاتك',
  statCarsSold: 2500,
  statBrands: 50,
  statSatisfaction: 98,
  statYearsExperience: 15,
  brands: ['MERCEDES-BENZ', 'BMW', 'AUDI', 'LEXUS', 'PORSCHE', 'RANGE ROVER', 'TOYOTA', 'HYUNDAI', 'KIA', 'NISSAN'],
  featuresTitle: 'تجعلنا الأفضل',
  featuresBadge: 'لماذا سيارتي؟',
  features: [
    { icon: 'fas fa-shield-alt', title: 'ضمان شامل', description: 'نقدم ضمان شامل على جميع سياراتنا مع خدمة صيانة مجانية لمدة عام كامل' },
    { icon: 'fas fa-hand-holding-usd', title: 'تمويل مرن', description: 'خيارات تمويل متعددة بالتعاون مع أفضل البنوك والمؤسسات المالية بأقل نسبة ربح' },
    { icon: 'fas fa-search-dollar', title: 'فحص دقيق', description: 'كل سيارة تخضع لفحص شامل من 200 نقطة بواسطة خبراء متخصصين قبل عرضها' },
    { icon: 'fas fa-truck', title: 'توصيل مجاني', description: 'خدمة توصيل مجانية لجميع أنحاء المملكة مع إمكانية التجربة قبل الشراء' },
  ],
  aboutTitle: 'رحلة التميز تبدأ هنا',
  aboutDescription: 'منذ تأسيسنا في عام 2010، نسعى لتقديم أفضل تجربة شراء سيارات في المملكة. نحن نؤمن بأن شراء سيارة يجب أن يكون تجربة ممتعة وموثوقة، ولهذا نحرص على تقديم أعلى معايير الجودة والشفافية.',
  aboutFeatures: [
    'فحص شامل لجميع السيارات قبل العرض',
    'فريق خبراء متخصص في عالم السيارات',
    'خدمة ما بعد البيع ودعم فني على مدار الساعة',
    'أسعار تنافسية وعروض حصرية مستمرة',
  ],
  ctaTitle: 'جاهز لتجد سيارة أحلامك؟',
  ctaDescription: 'تواصل معنا الآن واحصل على استشارة مجانية من خبرائنا. نحن هنا لمساعدتك في كل خطوة.',
  phone: '+966500000000',
  whatsapp: '966500000000',
  address: 'طريق الملك فهد، الرياض',
  phoneDisplay: '+966 50 000 0000',
  workingHours: 'السبت - الخميس | 9 ص - 10 م',
  twitter: '#',
  instagram: '#',
  snapchat: '#',
  youtube: '#',
  footerDescription: 'وجهتك الأولى لشراء أفخم السيارات في المملكة العربية السعودية. نقدم تشكيلة واسعة من أرقى العلامات التجارية مع خدمة عملاء استثنائية.',
  seoTitle: 'سيارتي | أفخم معرض سيارات في المملكة',
  seoDescription: 'سيارتي - وجهتك الأولى لشراء أفخم السيارات',
  seoKeywords: 'سيارات, سيارات فاخرة',
};

const defaultCars = [
  {
    _id: '1',
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
  },
  {
    _id: '2',
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
  },
  {
    _id: '3',
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
  },
  {
    _id: '4',
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
  },
  {
    _id: '5',
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
  },
  {
    _id: '6',
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
  },
];

const defaultTestimonials = [
  {
    _id: '1',
    name: 'أحمد محمد',
    title: 'رجل أعمال — الرياض',
    text: 'تجربة رائعة من البداية للنهاية. الفريق كان محترفاً جداً وساعدني في اختيار السيارة المناسبة. الأسعار ممتازة مقارنة بالسوق.',
    rating: 5,
    initials: 'أ م',
  },
  {
    _id: '2',
    name: 'خالد العمري',
    title: 'مهندس — جدة',
    text: 'اشتريت سيارتي الأولى من سيارتي وكانت التجربة مذهلة. خدمة التمويل كانت سهلة وسريعة، والسيارة وصلت بحالة ممتازة.',
    rating: 5,
    initials: 'خ ع',
  },
  {
    _id: '3',
    name: 'فهد السالم',
    title: 'طبيب — الدمام',
    text: 'أنصح الجميع بزيارة معرض سيارتي. التشكيلة واسعة والأسعار معقولة جداً. خدمة ما بعد البيع ممتازة والفريق ودود ومتعاون.',
    rating: 4.5,
    initials: 'ف س',
  },
];

async function getData() {
  try {
    const dbConnect = (await import('@/lib/mongodb')).default;
    await dbConnect();

    const Car = (await import('@/models/Car')).default;
    const Testimonial = (await import('@/models/Testimonial')).default;
    const SiteSettings = (await import('@/models/SiteSettings')).default;

    // Auto-seed if database is empty
    const carCount = await Car.countDocuments();
    if (carCount === 0) {
      const autoSeed = (await import('@/lib/autoSeed')).default;
      await autoSeed();
    }

    const carsData = await Car.find({ isActive: true }).sort({ createdAt: -1 }).lean();
    const testimonialsData = await Testimonial.find({ isActive: true }).sort({ createdAt: -1 }).lean();
    let settingsData = await SiteSettings.findOne({}).lean();

    const cars = carsData.length > 0 ? JSON.parse(JSON.stringify(carsData)) : defaultCars;
    const testimonials = testimonialsData.length > 0 ? JSON.parse(JSON.stringify(testimonialsData)) : defaultTestimonials;
    const settings = settingsData ? JSON.parse(JSON.stringify(settingsData)) : defaultSettings;

    return { cars, testimonials, settings };
  } catch (error) {
    console.error('Database connection failed, using defaults:', error.message);
    return {
      cars: defaultCars,
      testimonials: defaultTestimonials,
      settings: defaultSettings,
    };
  }
}

export async function generateMetadata() {
  try {
    const dbConnect = (await import('@/lib/mongodb')).default;
    await dbConnect();
    const SiteSettings = (await import('@/models/SiteSettings')).default;
    const settings = await SiteSettings.findOne({}).lean();
    if (settings) {
      return {
        title: settings.seoTitle,
        description: settings.seoDescription,
        keywords: settings.seoKeywords,
        openGraph: {
          title: settings.seoTitle,
          description: settings.seoDescription,
          images: [settings.ogImage || '/images/hero-car.png'],
        },
      };
    }
  } catch (e) {
    // fallback
  }

  return {
    title: 'سيارتي | أفخم معرض سيارات في المملكة',
    description: 'سيارتي - وجهتك الأولى لشراء أفخم السيارات',
  };
}

export default async function HomePage() {
  const { cars, testimonials, settings } = await getData();
  return <HomeClient cars={cars} testimonials={testimonials} settings={settings} />;
}
