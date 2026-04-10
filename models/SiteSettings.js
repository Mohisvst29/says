import mongoose from 'mongoose';

const SiteSettingsSchema = new mongoose.Schema({
  // General Site Settings
  siteNameAr: { type: String, default: 'سيارتي' },
  siteNameEn: { type: String, default: 'SAYARATI' },

  // Hero Section
  heroBadge: { type: String, default: 'معرض سيارات فاخرة منذ 2010' },
  heroBadgeEn: { type: String, default: 'Luxury Car Dealership Since 2010' },
  heroTitle1: { type: String, default: 'اكتشف' },
  heroTitle1En: { type: String, default: 'Discover' },
  heroTitleHighlight: { type: String, default: 'أفخم السيارات' },
  heroTitleHighlightEn: { type: String, default: 'Luxury Cars' },
  heroTitle2: { type: String, default: 'في مكان واحد' },
  heroTitle2En: { type: String, default: 'In One Place' },
  heroDescription: { type: String, default: 'نقدم لك تجربة شراء سيارات لا مثيل لها مع تشكيلة واسعة من أرقى العلامات التجارية العالمية وخيارات تمويل مرنة تناسب احتياجاتك' },
  heroDescriptionEn: { type: String, default: 'We offer an unparalleled car buying experience with a wide selection of top global brands and flexible financing options to suit your needs' },
  heroImage: { type: String, default: '/images/hero-car.png' },
  heroMedia1: { type: String, default: '' },
  heroMedia2: { type: String, default: '' },
  heroMedia3: { type: String, default: '' },


  // Stats
  statCarsSold: { type: Number, default: 2500 },
  statBrands: { type: Number, default: 50 },
  statSatisfaction: { type: Number, default: 98 },
  statYearsExperience: { type: Number, default: 15 },

  // Brands
  brands: { type: [String], default: ['MERCEDES-BENZ', 'BMW', 'AUDI', 'LEXUS', 'PORSCHE', 'RANGE ROVER', 'TOYOTA', 'HYUNDAI', 'KIA', 'NISSAN'] },

  // Features Section
  featuresTitle: { type: String, default: 'مميزات تجعلنا الأفضل' },
  featuresBadge: { type: String, default: 'لماذا سيارتي؟' },
  features: [{
    icon: { type: String, default: 'fas fa-shield-alt' },
    title: { type: String },
    description: { type: String },
  }],

  // About Section
  aboutTitle: { type: String, default: 'رحلة التميز تبدأ هنا' },
  aboutDescription: { type: String, default: 'منذ تأسيسنا في عام 2010، نسعى لتقديم أفضل تجربة شراء سيارات في المملكة. نحن نؤمن بأن شراء سيارة يجب أن يكون تجربة ممتعة وموثوقة، ولهذا نحرص على تقديم أعلى معايير الجودة والشفافية.' },
  aboutImage: { type: String, default: '/images/car-luxury.png' },
  aboutFeatures: { type: [String], default: [
    'فحص شامل لجميع السيارات قبل العرض',
    'فريق خبراء متخصص في عالم السيارات',
    'خدمة ما بعد البيع ودعم فني على مدار الساعة',
    'أسعار تنافسية وعروض حصرية مستمرة',
  ]},

  // Contact Section
  ctaTitle: { type: String, default: 'جاهز لتجد سيارة أحلامك؟' },
  ctaDescription: { type: String, default: 'تواصل معنا الآن واحصل على استشارة مجانية من خبرائنا. نحن هنا لمساعدتك في كل خطوة.' },
  phone: { type: String, default: '+966500000000' },
  whatsapp: { type: String, default: '966500000000' },
  address: { type: String, default: 'طريق الملك فهد، الرياض' },
  phoneDisplay: { type: String, default: '+966 50 000 0000' },
  workingHours: { type: String, default: 'السبت - الخميس | 9 ص - 10 م' },

  // Social Media
  twitter: { type: String, default: '#' },
  instagram: { type: String, default: '#' },
  snapchat: { type: String, default: '#' },
  youtube: { type: String, default: '#' },

  // Footer
  footerDescription: { type: String, default: 'وجهتك الأولى لشراء أفخم السيارات في المملكة العربية السعودية. نقدم تشكيلة واسعة من أرقى العلامات التجارية مع خدمة عملاء استثنائية.' },

  // SEO
  seoTitle: { type: String, default: 'سيارتي | أفخم معرض سيارات في المملكة' },
  seoDescription: { type: String, default: 'سيارتي - وجهتك الأولى لشراء أفخم السيارات الجديدة والمستعملة. نقدم لك تشكيلة واسعة من أرقى العلامات التجارية مع خدمة عملاء استثنائية وأسعار منافسة.' },
  seoKeywords: { type: String, default: 'سيارات, سيارات فاخرة, معرض سيارات, سيارتي, بيع سيارات, سيارات جديدة, سيارات مستعملة' },
  ogImage: { type: String, default: '/images/hero-car.png' },
  // Styling & Design
  primaryColor: { type: String, default: '#C8A456' },
  secondaryColor: { type: String, default: '#0a0a0f' },
  accentColor: { type: String, default: '#1a73e8' },
  textPrimaryColor: { type: String, default: '#f0ece4' },
  textSecondaryColor: { type: String, default: '#a0a0b0' },
  fontFamily: { type: String, default: 'Cairo' },

  // Logo Settings
  logoImage: { type: String, default: '' },
  logoWidth: { type: Number, default: 120 },
  logoPosition: { type: String, default: 'right' },

  // Top Marquee Banner
  marqueeEnabled: { type: Boolean, default: false },
  marqueeText: { type: String, default: 'أهلاً بكم في أفخم معرض سيارات في المملكة. خصومات خاصة بمناسبة الافتتاح!' },
  marqueeColor: { type: String, default: '#ffffff' },
  marqueeBgColor: { type: String, default: '#C8A456' },
  marqueeFontSize: { type: String, default: '16px' },
  marqueeSpeed: { type: String, default: '20s' },
}, {
  timestamps: true,
  strict: false // Allow dynamic fields to save even if schema isn't fully reloaded
});

delete mongoose.models.SiteSettings;
export default mongoose.model('SiteSettings', SiteSettingsSchema);
